import { appFor, statsFor, achievementsFor } from './catalog.mjs';

export function validTotal(raw) {
  if (!((typeof raw === 'string' && /^\d+$/.test(raw)) || (typeof raw === 'number' && Number.isSafeInteger(raw)))) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}
export function validPercent(raw) {
  if (typeof raw !== 'number' && !(typeof raw === 'string' && /^\d+(\.\d+)?$/.test(raw))) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}
export const delta = (current, baseline) => Number.isFinite(current) && Number.isFinite(baseline) ? current - baseline : null;
export function reach(stat, snapshot) {
  if (!stat.denominator) return null;
  const denominator = statsFor(snapshot?.appId).find(s => s.id === stat.denominator);
  const n = snapshot?.totals?.[stat.key], d = snapshot?.totals?.[denominator?.key];
  return Number.isFinite(n) && Number.isFinite(d) && d > 0 ? n / d * 100 : null;
}
export function consistencyWarnings(snapshot) {
  if (!snapshot) return [];
  const warnings = [];
  for (const def of statsFor(snapshot.appId)) {
    const value = reach(def, snapshot);
    if (value !== null && value > 100) warnings.push(`${def.label} exceeds its account denominator. Check delayed uploads and measurement definitions.`);
  }
  const t = snapshot.totals;
  if ([t.PH_O1_ACTIVE_SECONDS,t.PH_O1_MENU_VISIBLE_SECONDS,t.PH_O1_MENU_HIDDEN_SECONDS].every(Number.isFinite)
      && t.PH_O1_ACTIVE_SECONDS !== t.PH_O1_MENU_VISIBLE_SECONDS + t.PH_O1_MENU_HIDDEN_SECONDS)
    warnings.push('Runtime buckets do not sum to total runtime. Offline device merges or saturation can affect this relationship.');
  return warnings;
}
export function validateReport(raw, appId = raw?.appId) {
  const APP_ID = appFor(appId).id;
  if (raw?.appId !== undefined && raw.appId !== APP_ID) throw new Error('Report App ID does not match the selected edition.');
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('A report must be a JSON object.');
  const text = (key, required = false, max = 2000) => {
    const value = raw[key] ?? '';
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`Invalid ${key}.`);
    return value.trim();
  };
  const label = text('label', true, 120), source = text('source', true, 500), notes = text('notes');
  const asOf = text('asOf', true, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !Number.isFinite(Date.parse(asOf)) || new Date(asOf).toISOString().slice(0, 10) !== asOf) throw new Error('As-of date must be a valid YYYY-MM-DD date.');
  if (!['lifetime_players', 'period_players', 'owners', 'other'].includes(raw.population)) throw new Error('Choose the report population.');
  const nullable = (key, integer = false) => {
    if (raw[key] === '' || raw[key] === undefined || raw[key] === null) return null;
    if (typeof raw[key] !== 'number' || !Number.isFinite(raw[key]) || raw[key] < 0 || (integer && !Number.isSafeInteger(raw[key]))) throw new Error(`Invalid ${key}: use a nonnegative ${integer ? 'integer' : 'number'}.`);
    return raw[key];
  };
  const uniquePlayers = nullable('uniquePlayers', true), medianMinutes = nullable('medianMinutes'), meanMinutes = nullable('meanMinutes');
  if (raw.achievementPopulationVerified !== undefined && typeof raw.achievementPopulationVerified !== 'boolean') throw new Error('Population verification must be a boolean.');
  const achievementPopulationVerified = raw.achievementPopulationVerified === true;
  if (achievementPopulationVerified && (raw.population !== 'lifetime_players' || !uniquePlayers)) throw new Error('Achievement estimates require a positive lifetime-player count and explicitly matching achievement population.');
  if (raw.histogram !== undefined && !Array.isArray(raw.histogram)) throw new Error('Histogram must be an array.');
  const histogram = (raw.histogram ?? []).map((bin, index) => {
    if (!bin || typeof bin !== 'object' || !Number.isFinite(bin.minMinutes) || bin.minMinutes < 0 || !Number.isSafeInteger(bin.count) || bin.count < 0 || !(bin.maxMinutes === null || (Number.isFinite(bin.maxMinutes) && bin.maxMinutes > bin.minMinutes))) throw new Error(`Invalid histogram bucket ${index + 1}.`);
    return { minMinutes: bin.minMinutes, maxMinutes: bin.maxMinutes, count: bin.count };
  });
  if (histogram.length > 100) throw new Error('Use at most 100 histogram buckets.');
  let total = 0;
  histogram.forEach((bin, index) => {
    if (index && (histogram[index - 1].maxMinutes === null || bin.minMinutes !== histogram[index - 1].maxMinutes)) throw new Error('Histogram buckets must be ordered, contiguous and non-overlapping.');
    total += bin.count;
    if (!Number.isSafeInteger(total)) throw new Error('Histogram count exceeds the safe integer range.');
  });
  if (histogram.length && (histogram[0].minMinutes !== 0 || histogram.at(-1).maxMinutes !== null || uniquePlayers === null || total !== uniquePlayers)) throw new Error('A full histogram must cover 0 minutes through an open-ended final bucket, and its counts must equal the report population count.');
  if (uniquePlayers === null && medianMinutes === null && meanMinutes === null) throw new Error('Enter at least one population or playtime measurement.');
  return { appId: APP_ID, label, source, asOf, population: raw.population, uniquePlayers, medianMinutes, meanMinutes, achievementPopulationVerified, histogram, notes };
}
export function medianBucket(histogram) {
  const total = histogram?.reduce((sum, bin) => sum + bin.count, 0) ?? 0;
  if (!total) return null;
  // An even population may have its two middle observations in separate buckets.
  const lowerRank = Math.floor((total + 1) / 2), upperRank = Math.floor(total / 2) + 1;
  let cumulative = 0, lower, upper;
  for (const bin of histogram) {
    cumulative += bin.count;
    if (!lower && cumulative >= lowerRank) lower = bin;
    if (!upper && cumulative >= upperRank) upper = bin;
  }
  return lower && upper ? { minMinutes: (lower.minMinutes + upper.minMinutes) / 2, maxMinutes: lower.maxMinutes === null || upper.maxMinutes === null ? null : (lower.maxMinutes + upper.maxMinutes) / 2, total } : null;
}
const csvCell = value => {
  let text = value === null || value === undefined ? '' : String(value);
  // Protect spreadsheet consumers from formula injection in user-entered labels/notes.
  if (/^[=+@-]/.test(text) && typeof value === 'string') text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function snapshotCsv(snapshot, baseline) {
  const APP_ID = appFor(snapshot.appId).id;
  if (baseline && baseline.appId !== APP_ID) throw new Error('Cannot compare different editions.');
  const STATS = statsFor(APP_ID), ACHIEVEMENTS = achievementsFor(APP_ID);
  const rows = [['app_id', 'fetched_at', 'baseline_at', 'kind', 'key', 'label', 'unit', 'value', 'baseline_value', 'net_change', 'change_unit', 'availability_note']];
  for (const [kind, definitions, field, unit] of [['stat', STATS, 'totals', null], ['achievement', ACHIEVEMENTS, 'achievements', 'percent']]) {
    for (const def of definitions) {
      const current = snapshot?.[field]?.[def.key] ?? null, previous = baseline?.[field]?.[def.key] ?? null;
      rows.push([APP_ID, snapshot?.fetchedAt, baseline?.fetchedAt, kind, def.key, def.label, unit ?? def.unit, current, previous, delta(current, previous), kind === 'achievement' ? 'percentage points' : def.unit, snapshot?.unavailable?.[def.key] ?? (snapshot?.[field]?.[def.key] === undefined ? 'Not collected in this catalog version' : '')]);
    }
  }
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
