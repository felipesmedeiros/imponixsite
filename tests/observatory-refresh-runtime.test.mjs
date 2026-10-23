import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Miniflare } from 'miniflare';
import { allCatalogs } from '../observatory/catalogs.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const build = resolve(root, 'dist/server');
const config = JSON.parse(await readFile(resolve(build, 'wrangler.json'), 'utf8'));
const paths = (await readdir(build, { recursive: true })).filter(p => p.endsWith('.js'))
  .sort((a,b) => a === 'index.js' ? -1 : b === 'index.js' ? 1 : a.localeCompare(b));

test('production Worker downloads all editions in bounded batches, saves history and preserves backups', async () => {
  const catalogs = allCatalogs();
  let calls = 0, rejectSteam = false;
  const runtime = new Miniflare({
    modules: paths.map(p => ({ type: 'ESModule', path: resolve(build, p) })),
    compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
    bindings: { OBSERVATORY_LOCAL_DEV: '1' }, d1Databases: { OBSERVATORY_DB: 'refresh-regression' },
    d1Persist: false,
    outboundService: async request => {
      const url = new URL(request.url);
      assert.ok(['api.steampowered.com', 'partner.steam-api.com'].includes(url.hostname), 'Only mocked Steam calls are allowed.');
      calls++;
      if (rejectSteam) return new Response(null, { status: 302, headers: { Location: 'https://unexpected.invalid/' } });
      const catalog = catalogs.find(c => c.appId === Number(url.searchParams.get('appid') || url.searchParams.get('gameid')));
      assert.ok(catalog);
      if (url.searchParams.has('gameid')) return Response.json({ achievementpercentages: { achievements: catalog.achievements.map(a => ({ name: a.key, percent: 5 })) } });
      const names = Array.from(url.searchParams).filter(([name]) => name.startsWith('name[')).map(([,value]) => value);
      return Response.json({ response: { result: 1, globalstats: Object.fromEntries(names.map(name => [name, { total: '2000000' }])) } });
    },
  });
  try {
    await runtime.ready;
    const db = await runtime.getD1Database('OBSERVATORY_DB');
    const schema = await readFile(resolve(root, 'observatory/schema.sql'), 'utf8');
    for (const statement of schema.split(';').map(s => s.trim()).filter(Boolean)) await db.prepare(statement).run();
    const originals = new Map();
    for (const c of catalogs) {
      const snapshots = [1, 2].map(day => ({
        id: `${c.stream}-existing-${day}`, appId: c.appId, catalogVersion: 2,
        fetchedAt: `2026-01-0${day}T00:00:00.000Z`,
        totals: Object.fromEntries(c.stats.map(s => [s.key, null])),
        achievements: Object.fromEntries(c.achievements.map(a => [a.key, null])),
        unavailable: {}, missing: c.stats.map(s => s.key), warnings: [],
      }));
      const original = JSON.stringify({ version: 1, appId: c.appId, snapshots, ...(c.slug === 'noema' ? {} : { reports: [] }) });
      originals.set(c.stream, original);
      await db.prepare('INSERT INTO observatory_history (stream,app_id,body) VALUES (?,?,?)').bind(c.stream, c.appId, original).run();
    }
    async function refresh(catalog) {
      let job, response, body, iterations = 0;
      do {
        const url = new URL(`http://localhost/observatory/${catalog.slug}/api/refresh`);
        url.searchParams.set('appId', catalog.appId);
        if (job) url.searchParams.set('job', job);
        const before = calls;
        response = await runtime.dispatchFetch(url, { method: 'POST', headers: { Origin: 'http://localhost' } });
        body = await response.json();
        assert.ok(calls - before <= 18, 'Each refresh request stays within its Steam-call budget.');
        assert.ok(++iterations <= 10, 'The staged download must finish.');
        job = body.jobId;
      } while (response.status === 202);
      return { response, body, iterations };
    }
    // Refused redirects must not replace history or be followed to another host.
    rejectSteam = true;
    const failed = await refresh(catalogs[0]);
    assert.equal(failed.response.status, 502);
    assert.equal((await db.prepare('SELECT body FROM observatory_history WHERE stream=?').bind('gsc').first()).body, originals.get('gsc'));
    rejectSteam = false;
    await db.prepare('UPDATE observatory_history SET last_attempt=0 WHERE stream=?').bind('gsc').run();
    for (const catalog of catalogs) {
      const before = calls;
      const { response, body, iterations } = await refresh(catalog);
      assert.equal(response.status, 200, `${catalog.stream}: ${JSON.stringify(body)}`);
      assert.equal(body.snapshots.length, 3, catalog.stream);
      assert.deepEqual(body.snapshots.slice(0, 2), JSON.parse(originals.get(catalog.stream)).snapshots, 'Every previous snapshot is retained.');
      assert.equal(body.snapshots.at(-1).appId, catalog.appId);
      assert.ok(Object.values(body.snapshots.at(-1).totals).some(value => value === 2000000));
      assert.equal(calls - before, catalog.slug === 'noema' ? 1 : catalog.stats.length + (catalog.achievements.length ? 1 : 0));
      assert.ok(iterations >= 1);
      const row = await db.prepare('SELECT * FROM observatory_history WHERE stream=?').bind(catalog.stream).first();
      assert.equal(row.revision, 1); assert.equal(row.job, null); assert.equal(row.lease, null);
      const backup = await db.prepare('SELECT body FROM observatory_backups WHERE stream=?').bind(catalog.stream).first();
      assert.equal(backup.body, originals.get(catalog.stream), 'The exact previous history must be backed up.');
    }
  } finally { await runtime.dispose(); }
});
