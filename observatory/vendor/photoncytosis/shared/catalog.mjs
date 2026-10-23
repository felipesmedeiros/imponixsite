import manifest from '../external/catalog.json' with { type: 'json' };

export const MANIFEST = manifest;
export const APPS = [
  { id: manifest.apps.demo, edition: 'demo', label: 'Demo' },
  { id: manifest.apps.full, edition: 'full', label: 'Full game' },
];
export function appFor(raw) {
  const id = Number(raw);
  const app = APPS.find(a => a.id === id);
  if (!app) throw new Error('Choose the Photoncytosis Demo or Full game App ID.');
  return app;
}
export function statsFor(appId, catalogVersion = manifest.version) {
  const app = appFor(appId);
  if (![1, manifest.version].includes(catalogVersion)) throw new Error('Unsupported Observatory catalog version.');
  // v2 appends DNA entries after the original 39; historical snapshots stay intact.
  const definitions = catalogVersion === 1 ? manifest.stats.slice(0,39) : manifest.stats;
  return definitions.filter(s => s.scope === 'shared' || app.edition === 'demo')
    .map(s => ({ ...s, unit: s.kind === 'flag' ? 'accounts' : s.kind === 'seconds' ? 'seconds' : s.kind === 'maximum' ? 'sum of account maxima' : 'actions', max: s.kind === 'flag' ? 1 : 2147483647 }));
}
export const STATS_URL = 'https://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v1/';
export const ACHIEVEMENTS_URL = 'https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/';
export const ACHIEVEMENTS = [
  { key: 'ACH_FEEDING_GROUND', label: 'New feeding ground' },
  { key: 'ACH_GROWING_COLONY', label: 'Growing colony' },
  { key: 'ACH_FIRST_CURE', label: 'First cure' },
  { key: 'ACH_SURVIVOR', label: 'Survivor' },
];
export function achievementsFor(appId) { return appFor(appId).edition === 'full' ? ACHIEVEMENTS : []; }
