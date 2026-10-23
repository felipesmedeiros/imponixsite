// Runs the production build with Cloudflare's local workerd/D1 runtime only.
// No Cloudflare account credentials, remote database, or deployment API is used.
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Miniflare } from 'miniflare';
import { catalogFor, validateHistory } from '../observatory/catalogs.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
let backup, check = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--backup' && args[i + 1]) backup = resolve(args[++i]);
  else if (args[i] === '--check') check = true;
  else throw new Error(`Unknown argument: ${args[i]}`);
}
if (!backup) throw new Error('Supply --backup <validated backup directory containing d1-verification.json>.');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const manifest = await readJson(resolve(backup, 'manifest.json'));
const verification = await readJson(resolve(backup, 'd1-verification.json'));
const binding = await readJson(resolve(root, 'observatory/cloudflare.json'));
const access = await readJson(resolve(root, 'observatory/access.json'));
const build = resolve(root, 'dist/server');
const wrangler = await readJson(resolve(build, 'wrangler.json'));
const sha = body => createHash('sha256').update(body).digest('hex');
assert.equal(manifest.valid, true);
assert.equal(verification.database.id, binding.databaseId);
assert.ok(wrangler.d1_databases.some(d => d.binding === 'OBSERVATORY_DB' && d.database_id === binding.databaseId));
assert.ok(!('OBSERVATORY_LOCAL_DEV' in wrangler.vars), 'Preview bypass must never be in the deployment config.');
const originals = [];
for (const file of manifest.files) {
  const body = await readFile(file.destination, 'utf8');
  assert.equal(sha(body), file.sha256);
  assert.equal(Buffer.byteLength(body), file.bytes);
  assert.ok(verification.archives.some(a => a.sha256 === file.sha256 && a.exactBytesPreserved));
  originals.push({ ...file, appId: manifest.histories.find(h => h.stream === file.stream).appId, body });
}

// Signed test tokens exercise the actual Worker verifier. These keys exist only
// in this process; their public JWKS is substituted only in this local runtime.
const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
publicKey.kid = 'local-verification-only';
let steamRequests = 0;
const paths = (await readdir(build, { recursive: true })).filter(p => p.endsWith('.js'))
  .sort((a,b) => a === 'index.js' ? -1 : b === 'index.js' ? 1 : a.localeCompare(b));
const runtime = new Miniflare({
  modules: paths.map(p => ({ type: 'ESModule', path: resolve(build, p) })),
  compatibilityDate: wrangler.compatibility_date,
  compatibilityFlags: wrangler.compatibility_flags,
  bindings: { OBSERVATORY_LOCAL_DEV: '1' },
  d1Databases: { OBSERVATORY_DB: binding.databaseId },
  d1Persist: false,
  assets: { directory: resolve(root, 'dist/client'), binding: 'ASSETS', routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true } },
  outboundService: async request => {
    if (request.url === `https://${access.teamDomain}/cdn-cgi/access/certs`) return Response.json({ keys: [publicKey] });
    if (new URL(request.url).hostname.includes('steam')) steamRequests++;
    return new Response('External downloads are disabled in this local preview.', { status: 503 });
  },
  host: '127.0.0.1', port: 4191,
});
let closed = false;
const close = async () => { if (!closed) { closed = true; await runtime.dispose(); } };
try {
  await runtime.ready;
  const db = await runtime.getD1Database('OBSERVATORY_DB');
  for (const sql of await readJson(resolve(backup, 'd1-import-statements.json'))) await db.prepare(sql).run();
  async function verifyBytes() {
    for (const file of originals) {
      const archived = await db.prepare('SELECT body FROM observatory_backups WHERE stream = ? AND sha256 = ?').bind(file.stream, file.sha256).first();
      assert.equal(archived.body, file.body);
      if (file.kind === 'current') {
        const row = await db.prepare('SELECT * FROM observatory_history WHERE stream = ?').bind(file.stream).first();
        assert.equal(row.body, file.body); assert.equal(row.revision, 0); assert.equal(row.job, null);
      }
    }
    assert.equal((await db.prepare('SELECT count(*) AS n FROM observatory_history').first()).n, verification.currentHistories.length);
    assert.equal((await db.prepare('SELECT count(*) AS n FROM observatory_backups').first()).n, originals.length);
  }
  await verifyBytes();
  const summaries = [];
  const local = path => runtime.dispatchFetch(`http://localhost${path}`);
  for (const file of originals.filter(f => f.kind === 'current')) {
    const slug = file.stream.startsWith('photoncytosis') ? 'photoncytosis' : file.stream;
    const catalog = catalogFor(slug, file.appId);
    const base = `/observatory/${slug}/api/`;
    const source = validateHistory(JSON.parse(file.body), catalog);
    const response = await local(`${base}${slug === 'noema' ? 'snapshots' : 'history'}?appId=${file.appId}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
    assert.deepEqual((await response.json()).snapshots, source.snapshots);
    const archive = await local(`${base}archive.json?appId=${file.appId}`);
    assert.equal(archive.status, 200);
    assert.deepEqual((await archive.json()).snapshots, source.snapshots);
    if (catalog.csv) {
      const latest = source.snapshots.at(-1), baseline = source.snapshots[0];
      const csv = await local(`${base}snapshot.csv?appId=${file.appId}&snapshot=${latest.id}&baseline=${baseline.id}`);
      assert.equal(csv.status, 200); assert.equal(await csv.text(), catalog.csv(latest, baseline));
    }
    summaries.push({ stream: file.stream, snapshots: source.snapshots.length, archiveAndHistoryMatch: true });
  }
  const full = await local('/observatory/photoncytosis/api/history?appId=5372120');
  assert.equal(full.status, 200); assert.deepEqual((await full.json()).snapshots, []);
  for (const path of ['/', '/observatory/', '/observatory/gsc/', '/observatory/noema/', '/observatory/photoncytosis/']) {
    assert.equal((await local(path)).status, 200, path);
  }
  const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  async function token(changes = {}) {
    const now = Math.floor(Date.now() / 1000);
    const payload = `${b64({ alg: 'RS256', kid: publicKey.kid })}.${b64({ iss: `https://${access.teamDomain}`, aud: [access.audience], email: access.emails[0], iat: now - 1, exp: now + 300, ...changes })}`;
    return `${payload}.${Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keys.privateKey, new TextEncoder().encode(payload))).toString('base64url')}`;
  }
  const publicPaths = ['/observatory/', '/observatory/gsc/', '/observatory/noema/api/snapshots', '/observatory/photoncytosis/api/archive.json?appId=5372510', '/observatory/bridge.js'];
  for (const path of publicPaths) {
    assert.equal((await runtime.dispatchFetch(`https://imponix.com${path}`)).status, 401, path);
    assert.equal((await runtime.dispatchFetch(`https://imponix.com${path}`, { headers: { 'Cf-Access-Authenticated-User-Email': access.emails[0] } })).status, 401, 'Email header alone must not authenticate.');
  }
  for (const changes of [{ email: 'outsider@example.com' }, { aud: ['other-app'] }, { exp: 1 }]) {
    assert.equal((await runtime.dispatchFetch('https://imponix.com/observatory/', { headers: { 'Cf-Access-Jwt-Assertion': await token(changes) } })).status, 401);
  }
  const accepted = await runtime.dispatchFetch('https://imponix.com/observatory/gsc/api/history', { headers: { 'Cf-Access-Jwt-Assertion': await token(), 'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' } });
  assert.equal(accepted.status, 200); assert.equal((await accepted.json()).snapshots.length, 28);
  for (const origin of [undefined, 'https://outsider.example']) {
    const rejected = await runtime.dispatchFetch('http://localhost/observatory/gsc/api/refresh', { method: 'POST', headers: origin ? { Origin: origin } : {} });
    assert.equal(rejected.status, 403);
  }
  await verifyBytes();
  assert.equal(steamRequests, 0, 'Tests must not download new Steam data.');
  const report = { testedAt: new Date().toISOString(), runtime: 'Cloudflare workerd + local D1 emulator', source: backup, histories: summaries, currentSnapshots: summaries.reduce((n,s) => n + s.snapshots, 0), exactArchivesPreserved: originals.length, photoncytosisFullSnapshots: 0, signedAccessTokenTests: 'passed using local test keys and production issuer/audience/email configuration', realAccessLoginTested: false, sourceAndRemoteDataModified: false, published: false };
  await mkdir(resolve(root, '.observatory-data'), { recursive: true });
  await writeFile(resolve(root, '.observatory-data/local-test-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (check) await close();
  else {
    console.log('Local preview: http://127.0.0.1:4191/observatory/ — Ctrl+C to stop. Local data is discarded on exit.');
    process.once('SIGINT', close); process.once('SIGTERM', close);
  }
} catch (error) { await close(); throw error; }
