import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ACHIEVEMENTS, APP_ID, STATS, TELEMETRY_STATS } from '../shared/catalog.mjs';
import { sameProductsSold, validateReport, validPercent, validTotal } from '../shared/analysis.mjs';

const empty = () => ({ version: 1, appId: APP_ID, snapshots: [], reports: [] });
function normalizeLegacySnapshot(snapshot) {
  // Pre-instrumentation snapshots have none of the v1 keys. Normalize only
  // that known older catalog, without inventing measurements or rewriting disk.
  if (!snapshot?.totals || !snapshot.unavailable || !snapshot.achievements) return snapshot;
  const totals = { ...snapshot.totals }, unavailable = { ...snapshot.unavailable };
  if (!Object.keys(totals).some(key => key.startsWith('GSC_O1_'))) {
    for (const { key } of TELEMETRY_STATS) {
      totals[key] = null;
      unavailable[key] = 'Not collected by this older snapshot.';
    }
  }
  const achievements = { ...snapshot.achievements };
  const multiplayerKeys = ACHIEVEMENTS.filter(a => a.group === 'Multiplayer').map(a => a.key);
  if (multiplayerKeys.every(key => !Object.hasOwn(achievements, key))) {
    for (const key of multiplayerKeys) {
      achievements[key] = null;
      unavailable[key] = 'Not collected by this older snapshot.';
    }
  }
  return { ...snapshot, totals, achievements, unavailable };
}
function validSnapshot(snapshot) {
  return snapshot?.appId === APP_ID && typeof snapshot.id === 'string' && Number.isFinite(Date.parse(snapshot.fetchedAt)) && snapshot.totals && snapshot.achievements && Array.isArray(snapshot.warnings) && snapshot.warnings.every(w => typeof w === 'string') && snapshot.unavailable && Object.values(snapshot.unavailable).every(v => typeof v === 'string') && STATS.every(({ key }) => snapshot.totals[key] === null || (typeof snapshot.totals[key] === 'number' && validTotal(snapshot.totals[key]) !== null)) && ACHIEVEMENTS.every(({ key }) => snapshot.achievements[key] === null || (typeof snapshot.achievements[key] === 'number' && validPercent(snapshot.achievements[key]) !== null)) && Object.values(snapshot.achievements).every(v => v === null || (typeof v === 'number' && validPercent(v) !== null));
}
export async function readHistory(directory) {
  try {
    const history = JSON.parse(await readFile(join(directory, 'history.json'), 'utf8'));
    if (Array.isArray(history.snapshots)) history.snapshots = history.snapshots.map(normalizeLegacySnapshot);
    if (history.version !== 1 || history.appId !== APP_ID || !Array.isArray(history.snapshots) || !Array.isArray(history.reports) || !history.snapshots.every(validSnapshot)) throw new Error('Invalid history.');
    const ids = new Set();
    for (const entry of [...history.snapshots, ...history.reports]) {
      if (typeof entry.id !== 'string' || ids.has(entry.id)) throw new Error('Invalid or duplicated history ID.');
      ids.add(entry.id);
    }
    for (const report of history.reports) {
      if (report.appId !== APP_ID || !Number.isFinite(Date.parse(report.savedAt))) throw new Error('Invalid report metadata.');
      validateReport(report);
    }
    return history;
  } catch (error) {
    if (error.code === 'ENOENT') return empty();
    throw new Error('Cannot read .data/history.json. The file was preserved. Restore a valid backup before saving or refreshing.');
  }
}
async function persist(directory, history) {
  await mkdir(directory, { recursive: true });
  const target = join(directory, 'history.json');
  const temp = join(directory, `history-${randomUUID()}.tmp`);
  // Preserve the preceding validated history as a recoverable backup.
  const previous = await readHistory(directory);
  if (previous.snapshots.length || previous.reports.length) {
    const backupTemp = join(directory, 'history.backup.tmp');
    await writeFile(backupTemp, JSON.stringify(previous, null, 2) + '\n', 'utf8');
    await rename(backupTemp, join(directory, 'history.backup.json'));
  }
  await writeFile(temp, JSON.stringify(history, null, 2) + '\n', 'utf8');
  await rename(temp, target);
}
export function createService(directory, download, cooldownMs = 60_000) {
  let pending, lastAttempt = 0, mutation = Promise.resolve();
  const enqueue = action => {
    const result = mutation.then(action);
    mutation = result.catch(() => {});
    return result;
  };
  return {
    read: () => readHistory(directory),
    refresh() {
      if (pending) return pending;
      pending = enqueue(async () => {
        const history = await readHistory(directory);
        const latest = history.snapshots.at(-1);
        if (Date.now() - lastAttempt < cooldownMs || (latest && Date.now() - Date.parse(latest.fetchedAt) < cooldownMs)) {
          if (latest) return { ...history, cached: true };
          throw new Error('Wait one minute before retrying Steam.');
        }
        lastAttempt = Date.now();
        const snapshot = await download();
        if (!validSnapshot(snapshot)) throw new Error('Invalid download; previous history was preserved.');
        if (sameProductsSold(snapshot, latest)) {
          return { ...history, cached: false, unchanged: true, checkedAt: snapshot.fetchedAt };
        }
        history.snapshots.push(snapshot);
        await persist(directory, history);
        return { ...history, cached: false, unchanged: false };
      }).finally(() => { pending = null; });
      return pending;
    },
    addReport(raw) {
      const report = { ...validateReport(raw), id: randomUUID(), savedAt: new Date().toISOString() };
      return enqueue(async () => {
        const history = await readHistory(directory);
        history.reports.push(report);
        await persist(directory, history);
        return history;
      });
    },
  };
}

export { validSnapshot, normalizeLegacySnapshot };
