export const snapshotTime = snapshot => Date.parse(snapshot.fetchedAt);

// Use browser-local calendar dates consistently with the displayed timestamps.
export function localDay(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function comparisonFor(snapshots, appId, selectedId, baselineId) {
  const ordered = snapshots.filter(s => s.appId === appId && Number.isFinite(snapshotTime(s)))
    .slice().sort((a,b) => snapshotTime(a) - snapshotTime(b));
  const snapshot = ordered.find(s => s.id === selectedId) ?? ordered.at(-1);
  const earlier = snapshot ? ordered.filter(s => snapshotTime(s) < snapshotTime(snapshot)) : [];
  const baseline = baselineId === 'none' ? undefined : earlier.find(s => s.id === baselineId) ?? earlier.at(-1);
  return { ordered, snapshot, earlier, baseline };
}

// Prefer the latest capture on the requested day. Otherwise use the closest
// saved calendar day, breaking ties toward the earlier day. Never invent data.
export function snapshotForDay(snapshots, day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined;
  const target = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(target) || new Date(target).toISOString().slice(0,10) !== day) return undefined;
  return snapshots.slice().sort((a,b) => {
    const da = Date.parse(`${localDay(a.fetchedAt)}T00:00:00Z`), db = Date.parse(`${localDay(b.fetchedAt)}T00:00:00Z`);
    return Math.abs(da - target) - Math.abs(db - target) || da - db || snapshotTime(b) - snapshotTime(a);
  })[0];
}

export function daysBefore(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() - days);
  return localDay(date);
}
