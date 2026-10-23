import { medianBucket } from './analysis.mjs';
export const telemetryValue = (snapshot, key) => snapshot?.totals?.[`GSC_O1_${key}`] ?? null;
export function measuredRate(part, total) {
  return Number.isSafeInteger(part) && Number.isSafeInteger(total) && total > 0 && part >= 0 && part <= total ? part / total * 100 : null;
}
export function firstSaleTiming(snapshot) {
  const total = telemetryValue(snapshot, 'SALE_TIMED');
  const limits = [5, 15, 30, 60, 120];
  const cumulative = limits.map(m => telemetryValue(snapshot, `SALE_LE_${m}`));
  if (!Number.isSafeInteger(total) || total <= 0 || cumulative.some((v, i) =>
    !Number.isSafeInteger(v) || v < 0 || v > total || (i > 0 && v < cumulative[i - 1]))) return null;
  let count = 0, min = 0;
  const bins = limits.map((max, i) => {
    const bin = { minMinutes: min, maxMinutes: max, count: cumulative[i] - count };
    count = cumulative[i]; min = max; return bin;
  });
  bins.push({ minMinutes: min, maxMinutes: null, count: total - count });
  return medianBucket(bins);
}
