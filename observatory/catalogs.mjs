import * as gsc from './vendor/gsc/shared/catalog.mjs';
import { validSnapshot as validGscSnapshot, normalizeLegacySnapshot } from './vendor/gsc/server/store.mjs';
import { sameProductsSold, validateReport as validateGscReport, snapshotCsv as gscCsv } from './vendor/gsc/shared/analysis.mjs';
import { downloadSnapshot as downloadGsc } from './vendor/gsc/server/steam.mjs';
import * as noema from './vendor/noema/shared/stats.mjs';
import { downloadStats } from './vendor/noema/server/steam.mjs';
import * as photon from './vendor/photoncytosis/shared/catalog.mjs';
import { validSnapshot as validPhotonSnapshot } from './vendor/photoncytosis/server/store.mjs';
import { validateReport as validatePhotonReport, snapshotCsv as photonCsv } from './vendor/photoncytosis/shared/analysis.mjs';
import { downloadSnapshot as downloadPhoton } from './vendor/photoncytosis/server/steam.mjs';

export function catalogFor(slug, requestedAppId) {
  if (slug === 'gsc') return { slug, appId: gsc.APP_ID, stream: 'gsc', filename: 'gsc', stats: gsc.STATS, achievements: gsc.ACHIEVEMENTS,
    normalize: normalizeLegacySnapshot, validSnapshot: validGscSnapshot, validateReport: validateGscReport,
    download: downloadGsc, csv: gscCsv, unchanged: sameProductsSold };
  if (slug === 'noema') return { slug, appId: noema.APP_ID, stream: 'noema', filename: 'noema-demo', stats: noema.STATS, achievements: [],
    normalize(snapshot) {
      const totals = { ...snapshot.totals };
      for (const key of noema.LEGACY_OPTIONAL_KEYS) if (totals[key] === undefined) totals[key] = null;
      return { ...snapshot, totals, missing: noema.STATS.filter(({key}) => totals[key] === null).map(({key}) => key) };
    },
    validSnapshot: s => s?.appId === noema.APP_ID && typeof s.id === 'string' && Number.isFinite(Date.parse(s.fetchedAt)) && Array.isArray(s.missing) && s.totals && noema.STATS.every(({key}) => s.totals[key] === null || (Number.isSafeInteger(s.totals[key]) && s.totals[key] >= 0)),
    download: downloadStats };
  if (slug === 'photoncytosis') {
    const app = photon.appFor(requestedAppId || photon.MANIFEST.apps.demo);
    return { slug, appId: app.id, stream: `photoncytosis-${app.edition}`, filename: `photoncytosis-${app.edition}`,
      stats: photon.statsFor(app.id), achievements: photon.achievementsFor(app.id), normalize: s => s,
      validSnapshot: s => validPhotonSnapshot(s, app.id), validateReport: raw => validatePhotonReport(raw, app.id),
      download: fetchImpl => downloadPhoton(app.id, fetchImpl), csv: photonCsv };
  }
  throw new Error('Unknown Observatory.');
}
export const allCatalogs = () => [catalogFor('gsc'), catalogFor('noema'), catalogFor('photoncytosis', 5372510), catalogFor('photoncytosis', 5372120)];
export function validateHistory(raw, catalog) {
  if (raw?.version !== 1 || !Array.isArray(raw.snapshots)
    || (catalog.slug !== 'noema' && (raw.appId !== catalog.appId || !Array.isArray(raw.reports)))) throw new Error('Invalid history; saved data was preserved.');
  const history = { ...raw, snapshots: raw.snapshots.map(catalog.normalize) };
  const ids = new Set();
  for (const snapshot of history.snapshots) {
    if (!catalog.validSnapshot(snapshot) || ids.has(snapshot.id)) throw new Error('Invalid snapshot history; saved data was preserved.');
    ids.add(snapshot.id);
  }
  for (const report of history.reports || []) {
    if (!catalog.validateReport || report.appId !== catalog.appId || typeof report.id !== 'string' || ids.has(report.id) || !Number.isFinite(Date.parse(report.savedAt))) throw new Error('Invalid report history; saved data was preserved.');
    catalog.validateReport(report); ids.add(report.id);
  }
  return history;
}
