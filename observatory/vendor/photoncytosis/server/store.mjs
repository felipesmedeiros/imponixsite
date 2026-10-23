import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { MANIFEST, appFor, statsFor, achievementsFor } from '../shared/catalog.mjs';
import { validateReport, validPercent, validTotal } from '../shared/analysis.mjs';

const empty = appId => ({ version: 1, appId: appFor(appId).id, snapshots: [], reports: [] });
export function validSnapshot(s, appId) {
  if (![1, MANIFEST.version].includes(s?.catalogVersion)) return false;
  const definitions = statsFor(appId,s.catalogVersion);
  return s?.appId === appFor(appId).id && typeof s.id === 'string' && s.id.length > 0
    && Number.isFinite(Date.parse(s.fetchedAt)) && s.totals && s.achievements
    && Array.isArray(s.warnings) && s.warnings.every(w => typeof w === 'string')
    && s.unavailable && Object.values(s.unavailable).every(v => typeof v === 'string')
    && definitions.every(({key}) => s.totals[key] === null || (typeof s.totals[key] === 'number' && validTotal(s.totals[key]) !== null))
    && Object.keys(s.totals).every(key => definitions.some(d => d.key === key))
    && achievementsFor(appId).every(({key}) => s.achievements[key] === null || validPercent(s.achievements[key]) !== null)
    && Object.values(s.achievements).every(v => v === null || validPercent(v) !== null)
    && (appFor(appId).edition !== 'demo' || Object.keys(s.achievements).length === 0);
}
export async function readHistory(directory, appId) {
  try {
    const history = JSON.parse(await readFile(join(directory, 'history.json'), 'utf8'));
    if (history.version !== 1 || history.appId !== appFor(appId).id || !Array.isArray(history.snapshots)
      || !Array.isArray(history.reports) || !history.snapshots.every(s => validSnapshot(s, appId))) throw new Error('Invalid history.');
    const ids = new Set();
    for (const entry of [...history.snapshots, ...history.reports]) {
      if (typeof entry.id !== 'string' || !entry.id || ids.has(entry.id)) throw new Error('Invalid or duplicated history ID.');
      ids.add(entry.id);
    }
    for (const report of history.reports) {
      if (report.appId !== appFor(appId).id || !Number.isFinite(Date.parse(report.savedAt))) throw new Error('Invalid report metadata.');
      validateReport(report, appId);
    }
    return history;
  } catch (error) {
    if (error.code === 'ENOENT') return empty(appId);
    throw new Error('Cannot read this edition’s history.json. The file was preserved. Restore a valid backup before saving or refreshing.');
  }
}
async function persist(directory, history) {
  await mkdir(directory, { recursive: true });
  const previous = await readHistory(directory, history.appId);
  const temp = join(directory, `history-${randomUUID()}.tmp`);
  if (previous.snapshots.length || previous.reports.length) {
    const backupTemp = join(directory, 'history.backup.tmp');
    await writeFile(backupTemp, JSON.stringify(previous, null, 2) + '\n', 'utf8');
    await rename(backupTemp, join(directory, 'history.backup.json'));
  }
  await writeFile(temp, JSON.stringify(history, null, 2) + '\n', 'utf8');
  await rename(temp, join(directory, 'history.json'));
}
export function createService(directory, appId, download, cooldownMs = 60_000) {
  appId = appFor(appId).id;
  let pending, lastAttempt = 0, mutation = Promise.resolve();
  const enqueue = action => { const result = mutation.then(action); mutation = result.catch(() => {}); return result; };
  return {
    read: () => readHistory(directory, appId),
    refresh() {
      if (pending) return pending;
      pending = enqueue(async () => {
        const history = await readHistory(directory, appId), latest = history.snapshots.at(-1);
        if (Date.now() - lastAttempt < cooldownMs || (latest && Date.now() - Date.parse(latest.fetchedAt) < cooldownMs)) {
          if (latest) return { ...history, cached: true };
          throw new Error('Wait one minute before retrying Steam.');
        }
        lastAttempt = Date.now();
        const snapshot = await download(appId);
        if (!validSnapshot(snapshot, appId)) throw new Error('Invalid download; previous history was preserved.');
        history.snapshots.push(snapshot); await persist(directory, history);
        return { ...history, cached: false };
      }).finally(() => { pending = null; });
      return pending;
    },
    addReport(raw) {
      const report = { ...validateReport(raw, appId), id: randomUUID(), savedAt: new Date().toISOString() };
      return enqueue(async () => {
        const history = await readHistory(directory, appId);
        history.reports.push(report); await persist(directory, history); return history;
      });
    },
  };
}
