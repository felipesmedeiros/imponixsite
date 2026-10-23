import { validateHistory } from './catalogs.mjs';
const hash = async body => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))), b => b.toString(16).padStart(2, '0')).join('');
export class HistoryStore {
  constructor(db, catalog) { this.db = db; this.catalog = catalog; }
  emptyHistory() { return { version: 1, appId: this.catalog.appId, snapshots: [], reports: [] }; }
  async row({ initialize = false } = {}) {
    let row = await this.db.prepare('SELECT * FROM observatory_history WHERE stream = ?').bind(this.catalog.stream).first();
    // Full has never had a source history. Reads show an empty edition without
    // writing anything; its first explicit download/report may start a history.
    if (!row && this.catalog.stream === 'photoncytosis-full') {
      if (!initialize) return null;
      await this.db.prepare('INSERT OR IGNORE INTO observatory_history (stream, app_id, body) VALUES (?, ?, ?)')
        .bind(this.catalog.stream, this.catalog.appId, JSON.stringify(this.emptyHistory())).run();
      row = await this.db.prepare('SELECT * FROM observatory_history WHERE stream = ?').bind(this.catalog.stream).first();
    }
    if (!row) throw new Error('This history has not been imported yet.');
    if (row.app_id !== this.catalog.appId) throw new Error('History edition mismatch.');
    validateHistory(JSON.parse(row.body), this.catalog);
    return row;
  }
  async read() {
    const row = await this.row();
    return row ? validateHistory(JSON.parse(row.body), this.catalog) : this.emptyHistory();
  }
  async lock(row, now = Date.now()) {
    const token = crypto.randomUUID();
    const result = await this.db.prepare('UPDATE observatory_history SET lease = ?, lease_until = ? WHERE stream = ? AND revision = ? AND lease_until < ?')
      .bind(token, now + 90000, this.catalog.stream, row.revision, now).run();
    return result.meta.changes === 1 ? token : null;
  }
  async unlock(token) { await this.db.prepare('UPDATE observatory_history SET lease = NULL, lease_until = 0 WHERE stream = ? AND lease = ?').bind(this.catalog.stream, token).run(); }
  async save(row, token, body, { job = null, lastAttempt = row.last_attempt } = {}) {
    validateHistory(JSON.parse(body), this.catalog);
    const backupId = `revision:${this.catalog.stream}:${row.revision}`;
    const result = await this.db.batch([
      this.db.prepare('INSERT OR IGNORE INTO observatory_backups (id, stream, source, sha256, body, saved_at) SELECT ?, stream, ?, ?, body, ? FROM observatory_history WHERE stream = ? AND revision = ? AND lease = ?')
        .bind(backupId, 'cloud-revision', await hash(row.body), new Date().toISOString(), this.catalog.stream, row.revision, token),
      this.db.prepare('UPDATE observatory_history SET body = ?, revision = revision + 1, job = ?, last_attempt = ?, lease = NULL, lease_until = 0 WHERE stream = ? AND revision = ? AND lease = ?')
        .bind(body, job, lastAttempt, this.catalog.stream, row.revision, token),
    ]);
    if (result[1].meta.changes !== 1) throw new Error('History changed concurrently. Retry the operation.');
  }
  async saveJob(row, token, job, lastAttempt) {
    const result = await this.db.prepare('UPDATE observatory_history SET job = ?, last_attempt = ?, lease = NULL, lease_until = 0 WHERE stream = ? AND revision = ? AND lease = ?')
      .bind(job ? JSON.stringify(job) : null, lastAttempt, this.catalog.stream, row.revision, token).run();
    if (result.meta.changes !== 1) throw new Error('Download changed concurrently. Retry.');
  }
}

// Cache upstream responses across requests, using the original game downloader.
// At most 18 external calls per request fits the Workers Free subrequest limit.
export async function downloadChunk(catalog, job, fetchImpl = fetch, budget = 18) {
  let started = 0, deferred = 0;
  const transport = async (input, init) => {
    const url = String(input);
    let entry = job.responses[url];
    if (!entry) {
      if (started >= budget) { deferred++; throw new Error('Download pending.'); }
      started++;
      try {
        const response = await fetchImpl(input, init);
        const text = await response.text();
        if (text.length > 1024 * 1024) throw new Error('Steam response exceeds the size limit.');
        entry = { status: response.status, text };
      } catch { entry = { error: 'Steam request failed or timed out.' }; }
      job.responses[url] = entry;
    }
    if (entry.error) throw new Error(entry.error);
    return new Response(entry.text, { status: entry.status, headers: { 'Content-Type': 'application/json' } });
  };
  let snapshot, failure;
  try { snapshot = await catalog.download(transport); } catch (error) { failure = error; }
  if (deferred) return { complete: false, job };
  if (failure) throw failure;
  if (!catalog.validSnapshot(snapshot)) throw new Error('Invalid download; saved history was preserved.');
  snapshot.startedAt = job.startedAt;
  return { complete: true, snapshot };
}
