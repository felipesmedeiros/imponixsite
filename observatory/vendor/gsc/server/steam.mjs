import { randomUUID } from 'node:crypto';
import { ACHIEVEMENTS, ACHIEVEMENTS_URL, APP_ID, STATS, STATS_URL } from '../shared/catalog.mjs';
import { validPercent, validTotal } from '../shared/analysis.mjs';

async function request(url, fetchImpl) {
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(12_000), redirect: 'error', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Steam returned HTTP ${response.status}.`);
  return response.json();
}
export async function downloadSnapshot(fetchImpl = fetch) {
  const totals = {}, achievements = {}, unavailable = {}, warnings = [];
  const startedAt = new Date().toISOString();
  let validStats = 0, validAchievements = 0, cursor = 0;
  // One unavailable stat causes an entire batch request to fail. Query each name
  // separately, with three workers, so new/unaggregated definitions remain visible.
  async function worker() {
    while (cursor < STATS.length) {
      const def = STATS[cursor++];
      totals[def.key] = null;
      const url = new URL(STATS_URL);
      url.searchParams.set('appid', String(APP_ID));
      url.searchParams.set('count', '1');
      url.searchParams.set('name[0]', def.key);
      try {
        const body = await request(url, fetchImpl);
        if (body?.response?.result !== 1) throw new Error(typeof body?.response?.error === 'string' ? body.response.error.slice(0, 250) : 'Steam did not accept this stat request.');
        const value = validTotal(body.response.globalstats?.[def.key]?.total);
        if (value === null) throw new Error('Steam returned a missing, invalid or unsafe total.');
        totals[def.key] = value;
        validStats++;
      } catch (error) {
        unavailable[def.key] = error.name === 'TimeoutError' ? 'Steam request timed out.' : error.message;
      }
    }
  }
  async function loadAchievements() {
    ACHIEVEMENTS.forEach(a => { achievements[a.key] = null; });
    const url = new URL(ACHIEVEMENTS_URL);
    url.searchParams.set('gameid', String(APP_ID));
    try {
      const body = await request(url, fetchImpl);
      const rows = body?.achievementpercentages?.achievements;
      if (!Array.isArray(rows)) throw new Error('Steam returned no achievement percentage list.');
      const seen = new Set();
      for (const row of rows) {
        if (typeof row?.name !== 'string' || seen.has(row.name)) continue;
        seen.add(row.name);
        const percentage = validPercent(row.percent);
        // Retain extra Steam definitions for the raw data view and archive.
        if (/^[A-Z0-9_]{1,128}$/.test(row.name) && percentage !== null) {
          achievements[row.name] = percentage;
          validAchievements++;
        }
      }
      if (!validAchievements) throw new Error('Steam returned no valid achievement percentages.');
      for (const def of ACHIEVEMENTS) if (achievements[def.key] === null) unavailable[def.key] = 'Achievement absent from the full-game response.';
    } catch (error) {
      const message = `Achievement download failed: ${error.message}`;
      warnings.push(message);
      ACHIEVEMENTS.forEach(a => { unavailable[a.key] = message; });
    }
  }
  await Promise.all([worker(), worker(), worker(), loadAchievements()]);
  if (!validStats && !validAchievements) throw new Error('Steam returned no usable stats or achievements. Previous history was preserved.');
  if (!validStats) warnings.push('No global stats were available in this download.');
  return { id: randomUUID(), appId: APP_ID, startedAt, fetchedAt: new Date().toISOString(), sources: [STATS_URL, ACHIEVEMENTS_URL], totals, achievements, unavailable, warnings };
}
