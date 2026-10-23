import React from 'react';
import { TELEMETRY_STATS } from '../shared/catalog.mjs';
import { telemetryValue as value, measuredRate, firstSaleTiming } from '../shared/telemetry.mjs';
const n = v => Number.isFinite(v) ? v.toLocaleString() : '—';
const percent = (v, total) => { const p = measuredRate(v, total); return p === null ? '—' : `${p.toFixed(1)}%`; };
function Numbers({ snapshot, names }) {
  return <div className="table-wrap"><table><thead><tr><th>Measurement</th><th>Recorded total</th><th>Definition</th></tr></thead><tbody>{names.map(name => {
    const definition = TELEMETRY_STATS.find(s => s.key === `GSC_O1_${name}`);
    return <tr key={name}><td><strong>{definition.label}</strong></td><td>{n(value(snapshot, name))}<small>{definition.unit}</small></td><td className="description">{definition.description}</td></tr>;
  })}</tbody></table></div>;
}
export default function Telemetry({ snapshot, multiplayer }) {
  const total = value(snapshot, 'STARTED');
  const timed = firstSaleTiming(snapshot);
  const keys = multiplayer ? ['MP_HOST_ATTEMPTS', 'MP_JOIN_ATTEMPTS', 'MP_HOST_READY', 'MP_GUEST_READY'] : ['STARTED', 'SALE', 'DAY1'];
  const missing = keys.some(key => value(snapshot, key) === null);
  const progress = ['GUIDED', 'SKIPPED', 'PLACED', 'ORDERED', 'STOCKED', 'PRICED', 'OPENED', 'SALE', 'DAY1', 'DAY3', 'DAY7', 'RETURNED'];
  return <>
    {missing && <div className="message warning" role="status">Observatory v1 measurements are unavailable in this snapshot. Configure the new Steamworks stats, publish a build with tracking, then download a fresh snapshot. Unavailable values are shown as —.</div>}
    <div className="coverage"><strong>Measurement version 1</strong><p>{multiplayer
      ? 'Hosts and guests report their own participation. Use hosted ready visits for host-observed shared visits; adding host and guest totals counts participants twice. Sandbox and Standard are included. Counts combine public and pre-release builds.'
      : 'Account reach across Standard stores created with tracking enabled. Existing players can start measured stores. Steps can be skipped or completed in different orders; these are reach measurements, not an abandonment rate.'}</p></div>
    {multiplayer ? <>
      <div className="metrics three"><article className="metric"><span className="eyebrow">Multiplayer accounts</span><strong>{n(value(snapshot, 'MP_ACCOUNTS'))}</strong><p>Reached a playable visit in either role.</p></article><article className="metric"><span className="eyebrow">Guest readiness / attempts</span><strong>{percent(value(snapshot, 'MP_GUEST_READY'), value(snapshot, 'MP_JOIN_ATTEMPTS'))}</strong><p>Includes attempts still in progress or with delayed uploads.</p></article><article className="metric"><span className="eyebrow">Repeat multiplayer reach</span><strong>{percent(value(snapshot, 'MP_REPEAT'), value(snapshot, 'MP_ACCOUNTS'))}</strong><p>At least two ready participations, either role.</p></article></div>
      <section className="panel"><h2>From invitation to playable visit</h2><p className="section-note">An available lobby is not yet a shared gameplay session. Readiness is recorded after snapshot loading and world catch-up. The current protocol supports two participants, so every ready visit has a peak of two.</p><Numbers snapshot={snapshot} names={['MP_INVITE_SENT','MP_INVITE_FAILED','MP_HOST_ATTEMPTS','MP_HOST_AVAILABLE','MP_HOST_FAILED','MP_JOIN_ATTEMPTS','MP_JOIN_CONNECTED','MP_HOST_READY','MP_GUEST_READY','MP_HOST_ACCOUNTS','MP_GUEST_ACCOUNTS']} /></section>
      <section className="panel"><h2>Connection outcomes</h2><p className="section-note">Each guest attempt has at most one pre-readiness failure/cancellation category. Remote disconnects do not reveal whether the peer chose to leave or lost connectivity.</p><Numbers snapshot={snapshot} names={['MP_JOIN_FAIL_LOCAL','MP_JOIN_FAIL_LOBBY','MP_JOIN_FAIL_COMPAT','MP_JOIN_FAIL_NETWORK','MP_JOIN_FAIL_WORLD','MP_JOIN_FAIL_TIMEOUT','MP_JOIN_FAIL_CANCEL','MP_JOIN_FAIL_INTERRUPTED','MP_END_LOCAL','MP_END_REMOTE','MP_END_WORLD','MP_END_INTERRUPTED']} /></section>
      <section className="panel"><h2>Time spent connected and ready</h2><p className="section-note">Unscaled time includes menus and game pauses after readiness. Long suspended frames are excluded. Duration buckets cover ended visits; interrupted visits retain their last checkpoint. Lifetime event counts can undercount concurrent offline activity on multiple devices.</p><Numbers snapshot={snapshot} names={['MP_HOST_SECONDS','MP_GUEST_SECONDS',...['HOST','GUEST'].flatMap(role => ['LT5','5_15','15_30','30_60','60_PLUS'].map(bin => `MP_${role}_DURATION_${bin}`))]} /></section>
    </> : <>
      <div className="metrics three"><article className="metric"><span className="eyebrow">Measured-store accounts</span><strong>{n(total)}</strong><p>Denominator for the reach measurements below.</p></article><article className="metric"><span className="eyebrow">Existing-save accounts</span><strong>{n(value(snapshot, 'EXISTING'))}</strong><p>May also create a measured store. Groups overlap.</p></article><article className="metric"><span className="eyebrow">Best first-sale time / median bounds</span><strong>{timed ? `${timed.minMinutes}–${timed.maxMinutes ?? '∞'} min` : '—'}</strong><p>Best observed measured-store first-sale time per account, among timed achievers.</p></article></div>
      <section className="panel"><h2>Early progression reach</h2><p className="section-note">A repeated load or action does not count another account. Continue and Skip reflect explicit tutorial choices; Skip never completes analytics milestones. Days count distinct played days within one measured store. A return is another application launch, not day-1 retention.</p><div className="table-wrap"><table><thead><tr><th>Milestone</th><th>Accounts</th><th>Share of measured accounts</th></tr></thead><tbody>{progress.map(key => <tr key={key}><td>{TELEMETRY_STATS.find(s => s.key === `GSC_O1_${key}`).label}</td><td>{n(value(snapshot, key))}</td><td>{percent(value(snapshot, key), total)}</td></tr>)}</tbody></table></div><p className="small">Rates are withheld if counts are missing or a numerator exceeds its denominator during synchronization.</p></section>
      <section className="panel"><h2>First-sale timing thresholds</h2><p className="section-note">The clock includes focused gameplay, checkout and in-game menus. Title, pause, loading and day transitions are excluded. Thresholds are cumulative and can overlap; repeated new stores may improve an account’s best result. These values do not describe first-ever purchasers or historical playtime.</p><Numbers snapshot={snapshot} names={['SALE_TIMED', ...[5,15,30,60,120].map(m => `SALE_LE_${m}`)]} /></section>
    </>}
  </>;
}
