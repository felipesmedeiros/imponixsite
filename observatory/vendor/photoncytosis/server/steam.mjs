import { randomUUID } from 'node:crypto';
import { MANIFEST, appFor, statsFor, achievementsFor, STATS_URL, ACHIEVEMENTS_URL } from '../shared/catalog.mjs';
import { validPercent, validTotal } from '../shared/analysis.mjs';

async function request(url, fetchImpl) {
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(8000), redirect: 'error', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Steam returned HTTP ${response.status}.`);
  return response.json();
}
export async function downloadSnapshot(appId, fetchImpl = fetch) {
  const app = appFor(appId), definitions = statsFor(app.id);
  const totals = {}, achievements = {}, unavailable = {}, warnings = [];
  const startedAt = new Date().toISOString();
  // Optional publisher authentication remains in the Node process. No key is
  // returned in snapshots, exports, browser assets or request diagnostics.
  const publisherKey = process.env.PHOTONCYTOSIS_STEAM_PUBLISHER_KEY?.trim();
  const statEndpoint = publisherKey ? 'https://partner.steam-api.com/ISteamUserStats/GetGlobalStatsForGame/v1/' : STATS_URL;
  let validStats = 0, validAchievements = 0, cursor = 0;
  async function worker() {
    while (cursor < definitions.length) {
      const def = definitions[cursor++];
      totals[def.key] = null;
      const url = new URL(statEndpoint);
      if (publisherKey) url.searchParams.set('key',publisherKey);
      url.searchParams.set('appid', String(app.id)); url.searchParams.set('count', '1');
      url.searchParams.set('name[0]', def.key);
      try {
        const body = await request(url, fetchImpl);
        if (body?.response?.result !== 1) throw new Error(typeof body?.response?.error === 'string' ? body.response.error.slice(0, 250) : 'Steam did not accept this stat request.');
        const value = validTotal(body.response.globalstats?.[def.key]?.total);
        if (value === null) throw new Error('Missing, invalid or unsafe global total.');
        totals[def.key] = value; validStats++;
      } catch (error) { unavailable[def.key] = publisherKey ? error.message.replaceAll(publisherKey,'[redacted]') : error.message; }
    }
  }
  async function loadAchievements() {
    const defs = achievementsFor(app.id);
    if (!defs.length) return;
    defs.forEach(d => { achievements[d.key] = null; });
    const url = new URL(ACHIEVEMENTS_URL); url.searchParams.set('gameid', String(app.id));
    try {
      const body = await request(url, fetchImpl);
      const rows = body?.achievementpercentages?.achievements;
      if (!Array.isArray(rows)) throw new Error('No achievement percentage list.');
      for (const row of rows) {
        const value = validPercent(row?.percent);
        if (/^[A-Z0-9_]{1,128}$/.test(row?.name) && value !== null) {
          achievements[row.name] = value; validAchievements++;
        }
      }
      for (const def of defs) if (achievements[def.key] === null) unavailable[def.key] = 'Achievement absent from the Steam response.';
    } catch (error) { warnings.push(`Achievement download: ${error.message}`); }
  }
  await Promise.all([worker(), worker(), worker(), loadAchievements()]);
  if (!validStats && !validAchievements) throw new Error('Steam returned no usable measurements. Definitions may still be unpublished. Previous history was preserved.');
  if (!validStats) warnings.push('No custom global stats were available.');
  return { id: randomUUID(), appId: app.id, catalogVersion: MANIFEST.version, startedAt, fetchedAt: new Date().toISOString(),
    sources: [statEndpoint, ...(app.edition === 'full' ? [ACHIEVEMENTS_URL] : [])], totals, achievements, unavailable, warnings };
}
