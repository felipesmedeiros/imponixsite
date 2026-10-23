import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { allCatalogs, catalogFor, validateHistory } from '../observatory/catalogs.mjs';
import { HistoryStore, downloadChunk } from '../observatory/store.mjs';
import { verifyAccess } from '../observatory/auth.mjs';
import { handleObservatory } from '../observatory/handler.mjs';

const schema = await readFile(new URL('../observatory/schema.sql', import.meta.url), 'utf8');
function database() {
  const sqlite = new DatabaseSync(':memory:'); sqlite.exec(schema);
  function statement(sql, params = []) {
    return { bind: (...values) => statement(sql, values), first: async () => sqlite.prepare(sql).get(...params) || null,
      run: async () => ({ meta: { changes: Number(sqlite.prepare(sql).run(...params).changes) } }) };
  }
  return { sqlite, prepare: statement, async batch(statements) {
    sqlite.exec('BEGIN');
    try { const result = []; for (const s of statements) result.push(await s.run()); sqlite.exec('COMMIT'); return result; }
    catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  } };
}
function snapshot(catalog) {
  return { id: crypto.randomUUID(), appId: catalog.appId, catalogVersion: 2, fetchedAt: '2026-01-01T00:00:00.000Z', totals: Object.fromEntries(catalog.stats.map(s => [s.key, null])), achievements: Object.fromEntries(catalog.achievements.map(s => [s.key, null])), unavailable: {}, missing: catalog.stats.map(s => s.key), warnings: [] };
}
function seed(db, catalog, snapshots = [snapshot(catalog)]) {
  const history = { version: 1, appId: catalog.appId, snapshots, reports: [] };
  const body = JSON.stringify(history);
  db.sqlite.prepare('INSERT INTO observatory_history (stream,app_id,body) VALUES (?,?,?)').run(catalog.stream, catalog.appId, body);
  return body;
}
const req = (path, options) => new Request(`https://imponix.com${path}`, options);
const authorized = { authorize: async () => true };

test('every private page, asset, API and export fails closed without a valid Access token', async () => {
  for (const path of ['/observatory', '/observatory/', '/observatory/gsc/', '/observatory/bridge.js', '/observatory/gsc/assets/test.js', '/observatory/noema/api/snapshots', '/observatory/photoncytosis/api/archive.json']) {
    const response = await handleObservatory(req(path, { headers: { 'Cf-Access-Authenticated-User-Email': 'imponixgamestudio@gmail.com' } }), {});
    assert.equal(response.status, 401, path);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  }
  const bypass = await handleObservatory(req('/observatory/'), { OBSERVATORY_LOCAL_DEV: '1' });
  assert.equal(bypass.status, 401, 'local dev flag cannot open the public host');
});

test('Access validates signature, issuer, audience, time and email', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey); publicKey.kid = 'test';
  const config = { teamDomain: 'test-observatory.cloudflareaccess.com', audience: 'private-app', emails: ['owner@example.com'] };
  const now = Date.now();
  const base = { iss: `https://${config.teamDomain}`, aud: [config.audience], email: 'owner@example.com', iat: Math.floor(now/1000)-1, exp: Math.floor(now/1000)+300 };
  const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  async function token(claims, alg = 'RS256') {
    const payload = `${b64({ alg, kid: 'test' })}.${b64(claims)}`;
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keys.privateKey, new TextEncoder().encode(payload));
    return `${payload}.${Buffer.from(sig).toString('base64url')}`;
  }
  const certs = async (url, options) => {
    assert.equal(url, `https://${config.teamDomain}/cdn-cgi/access/certs`);
    assert.equal(options.redirect, 'manual', 'Workers reject redirect:error.');
    return Response.json({ keys: [publicKey] });
  };
  const check = async value => verifyAccess(req('/observatory/', { headers: { 'Cf-Access-Jwt-Assertion': value } }), config, certs, now);
  assert.equal(await check(await token(base)), true);
  for (const change of [{ email: 'outsider@example.com' }, { aud: ['other'] }, { iss: 'https://evil.example' }, { exp: 1 }, { iat: Math.floor(now/1000)+120 }, { nbf: Math.floor(now/1000)+120 }]) assert.equal(await check(await token({ ...base, ...change })), false);
  assert.equal(await check(await token(base, 'HS256')), false);
  const good = await token(base); assert.equal(await check(good.slice(0,-10) + 'AAAAAAAAAA'), false);
});

test('all game histories remain separate, legacy values stay unknown, wrong edition is rejected', () => {
  for (const c of allCatalogs()) {
    const s = snapshot(c), history = { version: 1, appId: c.appId, snapshots: [s], reports: [] };
    assert.equal(validateHistory(history, c).snapshots.length, 1);
    assert.throws(() => validateHistory({ ...history, snapshots: [{ ...s, appId: 1 }] }, c));
    assert.throws(() => validateHistory({ ...history, snapshots: [s, s] }, c));
  }
  const noema = catalogFor('noema'), s = snapshot(noema); delete s.totals.stat_demo_pacing_v1_started;
  assert.equal(validateHistory({ version: 1, snapshots: [s] }, noema).snapshots[0].totals.stat_demo_pacing_v1_started, null);
});

test('database locking prevents lost writes and preserves exact previous history', async () => {
  const db = database(), catalog = catalogFor('gsc'), original = seed(db, catalog);
  const a = new HistoryStore(db, catalog), b = new HistoryStore(db, catalog), row = await a.row();
  const [first, second] = await Promise.all([a.lock(row), b.lock(row)]);
  assert.ok(first); assert.equal(second, null);
  const history = JSON.parse(original); history.snapshots.push({ ...snapshot(catalog), fetchedAt: '2026-01-02T00:00:00.000Z' });
  await a.save(row, first, JSON.stringify(history));
  assert.equal((await a.read()).snapshots.length, 2);
  assert.equal(db.sqlite.prepare('SELECT body FROM observatory_backups').get().body, original);
  assert.equal(await b.lock(row), null, 'stale revision cannot acquire a lease');
  db.sqlite.close();
});

test('corrupt cloud history refuses writes without replacement', async () => {
  const db = database(), catalog = catalogFor('gsc'); seed(db, catalog);
  db.sqlite.prepare('UPDATE observatory_history SET body=?').run('{broken');
  await assert.rejects(new HistoryStore(db, catalog).read());
  assert.equal(db.sqlite.prepare('SELECT body FROM observatory_history').get().body, '{broken'); db.sqlite.close();
});

test('unstarted Full edition reads empty without creating data; other missing histories fail closed', async () => {
  const db = database(), full = catalogFor('photoncytosis', 5372120);
  const response = await handleObservatory(req('/observatory/photoncytosis/api/history?appId=5372120'), { OBSERVATORY_DB: db }, authorized);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { version: 1, appId: full.appId, snapshots: [], reports: [] });
  assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM observatory_history').get().n, 0);
  await assert.rejects(new HistoryStore(db, catalogFor('gsc')).read(), /not been imported/);
  const store = new HistoryStore(db, full);
  await store.row({ initialize: true });
  assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM observatory_history').get().n, 1);
  assert.deepEqual((await store.read()).snapshots, []);
  db.sqlite.close();
});

test('cloud download batches reuse upstream downloader and keep calls below free limits', async () => {
  const catalog = catalogFor('gsc'), job = { startedAt: new Date().toISOString(), responses: {} };
  let calls = 0, iterations = 0, result;
  const steam = async input => {
    calls++; const url = new URL(input), name = url.searchParams.get('name[0]');
    return name ? Response.json({ response: { result: 1, globalstats: { [name]: { total: 12 } } } }) : Response.json({ achievementpercentages: { achievements: catalog.achievements.map(a => ({ name: a.key, percent: 5 })) } });
  };
  do {
    const before = calls; result = await downloadChunk(catalog, job, steam, 18); iterations++;
    assert.ok(calls-before <= 18); assert.ok(iterations <= 10);
  } while (!result.complete);
  assert.equal(calls, catalog.stats.length+1);
  assert.equal(result.snapshot.totals.PRODUCTS_SOLD, 12);
  assert.equal(result.snapshot.startedAt, job.startedAt);
  assert.equal(result.snapshot.achievements.STORE_FIRST_SALE, 5);
  assert.equal(catalog.unchanged(result.snapshot, result.snapshot), true);
  await assert.rejects(downloadChunk(catalog, { startedAt: job.startedAt, responses: {} }, async () => { throw new Error('offline'); }, 100));
});

test('authenticated hub, dashboards and APIs work while cross-origin writes fail', async () => {
  const db = database(); for (const c of allCatalogs()) seed(db,c);
  for (const path of ['/observatory/', '/observatory/gsc/', '/observatory/noema/', '/observatory/photoncytosis/', '/observatory/bridge.js']) {
    const response = await handleObservatory(req(path), { OBSERVATORY_DB: db }, authorized);
    assert.equal(response.status, 200, path); assert.match(await response.text(), /Observator|observator|nativeFetch/);
  }
  for (const c of allCatalogs()) {
    const url = `/observatory/${c.slug}/api/${c.slug === 'noema' ? 'snapshots' : 'history'}?appId=${c.appId}`;
    const response = await handleObservatory(req(url), { OBSERVATORY_DB: db }, authorized);
    assert.equal(response.status, 200); const body = await response.json(); assert.equal(body.snapshots[0].appId, c.appId);
  }
  for (const origin of [undefined, 'https://evil.example']) {
    const response = await handleObservatory(req('/observatory/gsc/api/refresh', { method: 'POST', headers: origin ? { Origin: origin } : {} }), { OBSERVATORY_DB: db }, authorized);
    assert.equal(response.status, 403);
  }
  assert.equal((await handleObservatory(req('/observatory/photoncytosis/api/history?appId=3463400'), { OBSERVATORY_DB: db }, authorized)).status, 400);
  const archive = await handleObservatory(req('/observatory/gsc/api/archive.json'), { OBSERVATORY_DB: db }, authorized);
  assert.equal((await archive.json()).snapshots.length, 1); assert.match(archive.headers.get('Content-Disposition'), /attachment/);
  const s = (await new HistoryStore(db, catalogFor('gsc')).read()).snapshots[0];
  const csv = await handleObservatory(req(`/observatory/gsc/api/snapshot.csv?snapshot=${s.id}`), { OBSERVATORY_DB: db }, authorized);
  assert.equal(csv.status, 200); assert.match(await csv.text(), /PRODUCTS_SOLD/);
  db.sqlite.close();
});

test('report writes preserve snapshots and an in-progress download', async () => {
  const db = database(), c = catalogFor('gsc'); const original = seed(db,c);
  db.sqlite.prepare('UPDATE observatory_history SET job=?').run('{"id":"download"}');
  const response = await handleObservatory(req('/observatory/gsc/api/reports', { method: 'POST', headers: { Origin:'https://imponix.com','Content-Type':'application/json' }, body: JSON.stringify({ label:'Publisher report', source:'Steamworks', asOf:'2026-01-01', population:'owners', uniquePlayers:12 }) }), { OBSERVATORY_DB: db }, authorized);
  assert.equal(response.status, 201); const body = await response.json(); assert.equal(body.reports.length,1); assert.deepEqual(body.snapshots, JSON.parse(original).snapshots);
  assert.equal(db.sqlite.prepare('SELECT job FROM observatory_history').get().job, '{"id":"download"}'); db.sqlite.close();
});

test('no snapshot histories or source maps are packaged as public assets', async () => {
  const { default: assets } = await import('../observatory/generated/assets.mjs');
  for (const [path, [type, body]] of Object.entries(assets)) {
    assert.ok(path.startsWith('/observatory/')); assert.doesNotMatch(path, /history\.json|snapshots\.json|\.map$/);
    if (type.startsWith('text/javascript')) {
      const source = Buffer.from(body,'base64').toString(); assert.doesNotMatch(source, /["'`]\/api\//);
    }
  }
});
