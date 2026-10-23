import assets from './generated/assets.mjs';
import accessConfig from './access.json' with { type: 'json' };
import { verifyAccess } from './auth.mjs';
import { catalogFor } from './catalogs.mjs';
import { HistoryStore, downloadChunk } from './store.mjs';

const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'Vary': 'Cookie, Cf-Access-Jwt-Assertion', 'Content-Security-Policy': "frame-ancestors 'self'" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
const shape = (history, catalog) => catalog.slug === 'noema' ? { snapshots: history.snapshots } : history;
async function readJson(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new Error('Use application/json.');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('A JSON body is required.');
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 256 * 1024) { await reader.cancel(); throw new Error('Report exceeds 256 KiB.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function refresh(request, store, catalog, url) {
  const row = await store.row({ initialize: true }), now = Date.now();
  const history = JSON.parse(row.body), latest = history.snapshots.at(-1);
  let job = row.job ? JSON.parse(row.job) : null;
  if (job && now - Date.parse(job.startedAt) > 10 * 60 * 1000) job = null;
  const requestedJob = url.searchParams.get('job');
  if (requestedJob && requestedJob !== job?.id) return json({ error: 'This download has finished or expired. Reload before downloading again.' }, 409);
  if (!job && (now - row.last_attempt < 60000 || (latest && now - Date.parse(latest.fetchedAt) < 60000))) return json({ ...shape(await store.read(), catalog), cached: true });
  const token = await store.lock(row, now);
  if (!token) return json({ error: 'Another history operation is running. Try again shortly.' }, 409);
  job ||= { id: crypto.randomUUID(), startedAt: new Date().toISOString(), responses: {} };
  try {
    const result = await downloadChunk(catalog, job);
    if (!result.complete) {
      await store.saveJob(row, token, job, now);
      return json({ jobId: job.id, pending: true }, 202);
    }
    if (catalog.unchanged?.(result.snapshot, latest)) {
      await store.saveJob(row, token, null, now);
      return json({ ...shape(await store.read(), catalog), cached: false, unchanged: true, checkedAt: result.snapshot.fetchedAt });
    }
    history.snapshots.push(result.snapshot);
    await store.save(row, token, JSON.stringify(history), { lastAttempt: now });
    return json({ ...shape(await store.read(), catalog), cached: false, unchanged: false });
  } catch (error) {
    await store.saveJob(row, token, null, now);
    throw error;
  } finally { await store.unlock(token); }
}

export async function handleObservatory(request, env, { authorize, config = accessConfig } = {}) {
  const url = new URL(request.url);
  // A local bypass exists only on loopback when explicitly enabled in dev vars.
  const local = env.OBSERVATORY_LOCAL_DEV === '1' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if (!local && !(await (authorize ? authorize(request) : verifyAccess(request, config)))) return json({ error: 'Sign in through Cloudflare Access to open the Observatory.' }, 401);
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({ error: 'Cross-site requests are not allowed.' }, 403);
  if (!['GET', 'HEAD', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) return json({ error: 'Same-origin requests are required.' }, 403);
  const path = url.pathname;
  if (path === '/observatory') return new Response(null, { status: 308, headers: { ...headers, Location: '/observatory/' } });
  if (path === '/observatory/' || !path.includes('/api/')) {
    if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
    const key = path === '/observatory/' ? '/observatory/hub.html' : path.endsWith('/') ? path + 'index.html' : path;
    const asset = assets[key];
    if (!asset) return json({ error: 'Not found.' }, 404);
    const body = Uint8Array.from(atob(asset[1]), char => char.charCodeAt(0));
    return new Response(request.method === 'HEAD' ? null : body, { headers: { ...headers, 'Content-Type': asset[0] } });
  }
  if (!env.OBSERVATORY_DB) return json({ error: 'Observatory storage is not configured.' }, 503);
  const match = /^\/observatory\/(gsc|noema|photoncytosis)\/api\/(history|snapshots|archive\.json|snapshot\.csv|refresh|reports|health)$/.exec(path);
  if (!match) return json({ error: 'Unknown Observatory endpoint.' }, 404);
  let catalog;
  try { catalog = catalogFor(match[1], url.searchParams.get('appId')); } catch { return json({ error: 'Choose a valid game edition.' }, 400); }
  const action = match[2], store = new HistoryStore(env.OBSERVATORY_DB, catalog);
  const method = ['refresh', 'reports'].includes(action) ? 'POST' : 'GET';
  if (request.method !== method && !(method === 'GET' && request.method === 'HEAD')) return json({ error: 'Method not allowed.' }, 405);
  try {
    if (action === 'refresh') return await refresh(request, store, catalog, url);
    if (action === 'reports') {
      if (!catalog.validateReport) return json({ error: 'Reports are not supported by this dashboard.' }, 404);
      let report;
      try { report = { ...catalog.validateReport(await readJson(request)), id: crypto.randomUUID(), savedAt: new Date().toISOString() }; }
      catch (error) { return json({ error: error.message }, 400); }
      const row = await store.row({ initialize: true }), token = await store.lock(row);
      if (!token) return json({ error: 'Another history operation is running. Try again shortly.' }, 409);
      try {
        const history = JSON.parse(row.body); history.reports.push(report);
        await store.save(row, token, JSON.stringify(history), { job: row.job });
        return json(await store.read(), 201);
      } finally { await store.unlock(token); }
    }
    const history = await store.read();
    if (action === 'health') return json({ appId: catalog.appId, snapshots: history.snapshots.length, reports: history.reports?.length || 0 });
    if (action === 'history' || action === 'snapshots') return json(shape(history, catalog));
    if (action === 'archive.json') return new Response(JSON.stringify({ ...history, catalog: { stats: catalog.stats, achievements: catalog.achievements } }, null, 2), { headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${catalog.filename}-archive.json"` } });
    if (action === 'snapshot.csv' && catalog.csv) {
      const snapshot = history.snapshots.find(s => s.id === url.searchParams.get('snapshot'));
      const baselineId = url.searchParams.get('baseline'), baseline = baselineId ? history.snapshots.find(s => s.id === baselineId) : null;
      if (!snapshot || (baselineId && (!baseline || Date.parse(baseline.fetchedAt) >= Date.parse(snapshot.fetchedAt)))) return json({ error: 'Choose an existing snapshot and an earlier baseline from this edition.' }, 400);
      return new Response(catalog.csv(snapshot, baseline), { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${catalog.filename}-${snapshot.fetchedAt.slice(0,10)}.csv"` } });
    }
    return json({ error: 'Unknown Observatory endpoint.' }, 404);
  } catch (error) { return json({ error: error.message }, 502); }
}
