import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ACHIEVEMENTS, APP_ID, COVERAGE, GROUPS, PROGRESS_KEYS, STATS } from '../shared/catalog.mjs';
import { achievementCount, delta, medianBucket, snapshotsWithSalesChanges, validateReport } from '../shared/analysis.mjs';
import gameLogo from '../external/logo.jpg';
import Telemetry from './Telemetry.jsx';
import './style.css';

const num = n => Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—';
const pct = n => Number.isFinite(n) ? `${num(n)}%` : '—';
const signed = (n, suffix = '') => Number.isFinite(n) ? `${n > 0 ? '+' : ''}${num(n)}${suffix}` : '—';
const stamp = s => new Date(s).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const minutes = n => Number.isFinite(n) ? n < 60 ? `${num(n)} min` : `${num(n / 60)} hr` : '—';
const range = b => b ? `${minutes(b.minMinutes)} – ${b.maxMinutes === null ? 'unbounded' : minutes(b.maxMinutes)}` : '—';
const populations = { lifetime_players: 'Lifetime players', period_players: 'Players in a reporting period', owners: 'Owners / licenses', other: 'Other population' };
const pages = [['overview', 'Overview'], ['progression', 'Early progression'], ['multiplayer', 'Multiplayer'], ['achievements', 'Achievement reach'], ['activity', 'Activity & trends'], ['audience', 'Audience & playtime'], ['data', 'Data & exports'], ['reading', 'Reading the results']];
async function api(path, method = 'GET', value) {
  const response = await fetch(path, { method, ...(value === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) }) });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? 'Could not load the Observatory.');
  return body;
}
function Card({ label, value, note, accent = false }) {
  return <article className={`metric ${accent ? 'accent' : ''}`}><span className="eyebrow">{label}</span><strong>{value}</strong><p>{note}</p></article>;
}
function Heading({ kicker, title, children }) {
  return <div className="section-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{children}</div>;
}
function Achievements({ definitions, snapshot, baseline, report }) {
  return <div className="reach-list">{definitions.map((a, i) => {
    const value = snapshot?.achievements?.[a.key] ?? null;
    const change = delta(value, baseline?.achievements?.[a.key]);
    const count = achievementCount(value, report, snapshot?.fetchedAt);
    return <div className="reach-row" key={a.key}>
      <div className="reach-label"><span className="index">{String(i + 1).padStart(2, '0')}</span><span title={a.description}>{a.label}</span><strong>{pct(value)}</strong>{baseline && <span className="change">{signed(change, ' pp')}</span>}</div>
      <div className="track" aria-label={`${a.label}: ${pct(value)}`}><div style={{ width: `${value ?? 0}%` }} /></div>
      {value === null && <p className="small muted">{snapshot?.unavailable?.[a.key] ?? 'No snapshot yet.'}</p>}
      {count !== null && <p className="small muted">≈ {num(count)} accounts · estimate from rounded percentage and manually verified population</p>}
    </div>;
  })}</div>;
}
function Trend({ snapshots, metricKey, kind }) {
  const points = snapshots.map(s => ({ time: Date.parse(s.fetchedAt), value: s[kind]?.[metricKey], date: s.fetchedAt })).filter(p => Number.isFinite(p.value));
  if (points.length < 2) return <div className="empty compact"><h3>Save another snapshot to see a trend</h3><p>Downloads capture the current totals. Choose a baseline to compare net changes.</p></div>;
  const minT = Math.min(...points.map(p => p.time)), maxT = Math.max(...points.map(p => p.time));
  const min = kind === 'achievements' ? 0 : Math.min(...points.map(p => p.value));
  const max = kind === 'achievements' ? 100 : Math.max(...points.map(p => p.value));
  const x = p => 60 + (p.time - minT) / (maxT - minT || 1) * 800;
  const y = p => 180 - (p.value - min) / (max - min || 1) * 145;
  return <div className="chart-wrap"><svg className="trend" viewBox="0 0 920 230" role="img" aria-label={`Snapshot trend for ${metricKey}`}>
    {[0, .5, 1].map(r => <g key={r}><line x1="60" x2="860" y1={180 - r * 145} y2={180 - r * 145} className="grid-line" /><text x="50" y={185 - r * 145} textAnchor="end">{num(min + r * (max - min))}{kind === 'achievements' ? '%' : ''}</text></g>)}
    <polyline points={points.map(p => `${x(p)},${y(p)}`).join(' ')} fill="none" className="trend-line" />
    {points.map((p, i) => <circle key={i} cx={x(p)} cy={y(p)} r="5"><title>{stamp(p.date)} · {num(p.value)}{kind === 'achievements' ? '%' : ''}</title></circle>)}
    <text x="60" y="216">{new Date(minT).toLocaleDateString()}</text><text x="860" y="216" textAnchor="end">{new Date(maxT).toLocaleDateString()}</text>
  </svg></div>;
}
const initialReport = { label: '', source: 'Steamworks playtime report', asOf: new Date().toISOString().slice(0, 10), population: 'lifetime_players', uniquePlayers: '', medianMinutes: '', meanMinutes: '', achievementPopulationVerified: false, histogramText: '', notes: '' };
function ReportForm({ onSave, busy }) {
  const [form, setForm] = useState(initialReport), [error, setError] = useState('');
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  async function submit(event) {
    event.preventDefault(); setError('');
    try {
      const report = { ...form, histogram: form.histogramText.trim() ? JSON.parse(form.histogramText) : [] };
      for (const key of ['uniquePlayers', 'medianMinutes', 'meanMinutes']) report[key] = form[key] === '' ? null : Number(form[key]);
      const validated = validateReport(report);
      await onSave(validated);
      setForm(initialReport);
    } catch (e) { setError(e.message); }
  }
  return <form onSubmit={submit} className="report-form">
    <div className="form-grid">
      <label>Report label<input required maxLength="120" value={form.label} onChange={e => set('label', e.target.value)} placeholder="September lifetime playtime" /></label>
      <label>Source / report reference<input required maxLength="500" value={form.source} onChange={e => set('source', e.target.value)} /></label>
      <label>As-of date (UTC)<input type="date" required value={form.asOf} onChange={e => set('asOf', e.target.value)} /></label>
      <label>Population<select value={form.population} onChange={e => setForm(f => ({ ...f, population: e.target.value, achievementPopulationVerified: false }))}>{Object.entries(populations).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
      <label>Population count<input type="number" min="0" step="1" value={form.uniquePlayers} onChange={e => set('uniquePlayers', e.target.value)} placeholder="Leave blank if unavailable" /></label>
      <label>Median total playtime (minutes)<input type="number" min="0" step="any" value={form.medianMinutes} onChange={e => set('medianMinutes', e.target.value)} placeholder="From the report" /></label>
      <label>Mean total playtime (minutes)<input type="number" min="0" step="any" value={form.meanMinutes} onChange={e => set('meanMinutes', e.target.value)} placeholder="Optional" /></label>
    </div>
    <label className="checkbox"><input type="checkbox" disabled={form.population !== 'lifetime_players' || !(Number(form.uniquePlayers) > 0)} checked={form.achievementPopulationVerified} onChange={e => set('achievementPopulationVerified', e.target.checked)} /><span>I verified that this count uses the same lifetime population as Steam’s global achievement percentages.<small>Use only when the report establishes this. Same-day snapshots are also required. Resulting counts remain estimates.</small></span></label>
    <label>Playtime histogram (optional JSON)<textarea rows="4" value={form.histogramText} onChange={e => set('histogramText', e.target.value)} placeholder={'[{"minMinutes":0,"maxMinutes":10,"count":12},\n {"minMinutes":10,"maxMinutes":null,"count":8}]'} /><small>Counts must sum to the population count. Use ordered, contiguous buckets from 0 to an open-ended final bucket. Units are minutes.</small></label>
    <label>Period, filters and interpretation notes<textarea rows="2" maxLength="2000" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Record included accounts, reporting dates, platform filters, and other context." /></label>
    {error && <div className="message error" role="alert">{error}</div>}
    <button className="primary" disabled={busy}>Save report</button>
  </form>;
}
function App() {
  const [history, setHistory] = useState({ snapshots: [], reports: [] });
  const [selected, setSelected] = useState(''), [baselineId, setBaseline] = useState(''), [reportId, setReport] = useState('');
  const [page, setPage] = useState(pages.some(([key]) => key === location.hash.slice(1)) ? location.hash.slice(1) : 'overview');
  const [busy, setBusy] = useState(true), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [query, setQuery] = useState(''), [achievementGroup, setGroup] = useState('All'), [trendKey, setTrend] = useState('STORE_FIRST_SALE');
  useEffect(() => {
    api('/observatory/gsc/api/history').then(data => { setHistory(data); setSelected(snapshotsWithSalesChanges(data.snapshots).at(-1)?.id ?? ''); setReport(data.reports.at(-1)?.id ?? ''); }).catch(e => setError(e.message)).finally(() => setBusy(false));
    const listener = () => { const hash = location.hash.slice(1); if (pages.some(([key]) => key === hash)) setPage(hash); };
    window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [page]);
  const snapshots = snapshotsWithSalesChanges(history.snapshots);
  const snapshot = snapshots.find(s => s.id === selected) ?? snapshots.at(-1);
  const earlier = snapshots.filter(s => snapshot && Date.parse(s.fetchedAt) < Date.parse(snapshot.fetchedAt));
  const baseline = earlier.find(s => s.id === baselineId), report = history.reports.find(r => r.id === reportId);
  const median = report?.medianMinutes ?? null, bucket = medianBucket(report?.histogram);
  async function refresh() {
    setBusy(true); setError(''); setNotice('');
    try {
      const data = await api('/observatory/gsc/api/refresh', 'POST');
      setHistory(data); setSelected(snapshotsWithSalesChanges(data.snapshots).at(-1)?.id ?? '');
      setNotice(data.cached ? 'Showing the saved snapshot. Steam refresh has a one-minute cooldown.'
        : data.unchanged ? 'Products sold has not changed. This fetch was discarded; the previous snapshot is still selected.'
        : 'Steam snapshot saved. Account stats were only read.');
    }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function saveReport(value) {
    setBusy(true); setError(''); setNotice('');
    try { const data = await api('/observatory/gsc/api/reports', 'POST', value); setHistory(data); setReport(data.reports.at(-1).id); setNotice('Report saved with its source, population and date.'); }
    finally { setBusy(false); }
  }
  const countEnabled = achievementCount(0, report, snapshot?.fetchedAt) !== null;
  const trendDefinition = ACHIEVEMENTS.find(a => a.key === trendKey) ?? STATS.find(s => s.key === trendKey);
  const trendKind = ACHIEVEMENTS.some(a => a.key === trendKey) ? 'achievements' : 'totals';
  return <div className="shell">
    <aside className="sidebar"><a className="brand" href="#overview"><img className="brand-logo" src={gameLogo} alt="Game Store Chronicle" /><span className="brand-title">PLAYER <strong>OBSERVATORY</strong></span></a><span className="sidebar-caption">GAME STORE CHRONICLE</span>
      <nav aria-label="Observatory views">{pages.map(([key, label], i) => <a key={key} href={`#${key}`} className={page === key ? 'active' : ''} aria-current={page === key ? 'page' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
      <div className="sidebar-bottom"><span className="status-dot" /> PRIVATE RESEARCH TOOL<p>Steam App {APP_ID}<br />Read-only Steam access<br />History saved in the private database</p></div>
    </aside>
    <main><header><div><span className="eyebrow">PLAYER BEHAVIOR / OBSERVATORY V1</span><h1>{pages.find(([key]) => key === page)?.[1]}</h1><p>Understand reach, activity and time across your audience.</p></div><button className="primary" onClick={refresh} disabled={busy}>{busy ? 'Working…' : 'Download Steam data'}<span aria-hidden="true"> ↗</span></button></header>
      <div className="toolbar"><label>Steam snapshot<select value={snapshot?.id ?? ''} onChange={e => { setSelected(e.target.value); setBaseline(''); }} disabled={!snapshots.length || busy}>{!snapshots.length && <option value="">No snapshot downloaded</option>}{[...snapshots].reverse().map(s => <option key={s.id} value={s.id}>{stamp(s.fetchedAt)}</option>)}</select></label>
        <label>Compare with<select value={baselineId} onChange={e => setBaseline(e.target.value)} disabled={!earlier.length || busy}><option value="">No comparison</option>{[...earlier].reverse().map(s => <option key={s.id} value={s.id}>{stamp(s.fetchedAt)}</option>)}</select></label>
        <label>Audience report<select value={reportId} onChange={e => setReport(e.target.value)} disabled={!history.reports.length || busy}><option value="">No report selected</option>{[...history.reports].reverse().map(r => <option key={r.id} value={r.id}>{r.label} · {r.asOf}</option>)}</select></label>
      </div>
      {error && <div className="message error" role="alert">{error}</div>}{notice && <div className="message success" role="status">{notice}</div>}
      {snapshot?.warnings?.map((w, i) => <div className="message warning" key={i}>{w}</div>)}
      {(page === 'progression' || page === 'multiplayer') && <Telemetry snapshot={snapshot} multiplayer={page === 'multiplayer'} />}
      {page === 'overview' && <>
        <div className="metrics"><Card label="Audience / report" value={num(report?.uniquePlayers)} note={report ? `${populations[report.population]} · ${report.asOf}` : 'Add a Steamworks report to establish a population.'} /><Card label="Median total playtime" value={median !== null ? minutes(median) : range(bucket)} note={median !== null ? 'Entered from the selected report.' : bucket ? 'Bounded estimate from the report histogram.' : 'Requires a playtime report; unavailable from global sums.'} /><Card label="First sale achievement" value={pct(snapshot?.achievements?.STORE_FIRST_SALE)} note="Steam’s lifetime global achievement percentage." accent /><Card label="Products sold" value={num(snapshot?.totals?.PRODUCTS_SOLD)} note={baseline ? `${signed(delta(snapshot?.totals?.PRODUCTS_SOLD, baseline?.totals?.PRODUCTS_SOLD))} units since the comparison snapshot.` : 'Recorded sales volume across accounts.'} /></div>
        <div className="columns"><section className="panel"><Heading kicker="PROGRESSION LANDMARKS" title="How far does the audience reach?" /><p className="section-note">Independent lifetime achievements. These landmarks are not a required sequence or a measured abandonment funnel.</p><Achievements definitions={PROGRESS_KEYS.map(key => ACHIEVEMENTS.find(a => a.key === key))} snapshot={snapshot} baseline={baseline} report={report} /></section>
          <section className="panel questions"><Heading kicker="RESEARCH QUEUE" title="What should we investigate?" /><article><span className="tag">EARLY EXPERIENCE</span><h3>Between launch and first sale</h3><p>Setup reach and first-sale timing are prepared for tracking-enabled stores. Publish the Steam definitions and game build to start measuring.</p><a className="text-link" href="#progression">Early progression →</a></article><article><span className="tag">SUSTAINED PLAY</span><h3>From selling to building a business</h3><p>Use hiring, expansion and day-30 reach to identify areas for feedback. Each feature has its own requirements and release history.</p></article><article><span className="tag">PLAYING TOGETHER</span><h3>From invitation to a shared store</h3><p>New tracking separates attempted connections, playable visits, unique participants and time together.</p><a className="text-link" href="#multiplayer">Multiplayer measurements →</a></article><a className="text-link" href="#reading">Read the measurement limits →</a></section></div>
        <div className="coverage"><strong>Current coverage</strong><p>{COVERAGE}</p></div>
      </>}
      {page === 'achievements' && <section className="panel"><Heading kicker="ACCOUNT REACH" title="Existing achievement milestones"><label className="inline-label">Group<select value={achievementGroup} onChange={e => setGroup(e.target.value)}><option>All</option>{GROUPS.map(g => <option key={g}>{g}</option>)}</select></label></Heading><p className="section-note">Percentages come from Steam. Changes are percentage points. {countEnabled ? 'Account estimates are enabled for this manually verified, same-day report.' : 'Account estimates require a manually verified matching lifetime population and a same-day report.'}</p><Achievements definitions={ACHIEVEMENTS.filter(a => achievementGroup === 'All' || a.group === achievementGroup)} snapshot={snapshot} baseline={baseline} report={report} /></section>}
      {page === 'activity' && <>
        <section className="panel"><Heading kicker="SNAPSHOT HISTORY" title={trendDefinition?.label}><label className="inline-label">Metric<select value={trendKey} onChange={e => setTrend(e.target.value)}><optgroup label="Achievement percentages">{ACHIEVEMENTS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}</optgroup><optgroup label="Global stat totals">{STATS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</optgroup></select></label></Heading><Trend snapshots={snapshots.filter(s => !snapshot || Date.parse(s.fetchedAt) <= Date.parse(snapshot.fetchedAt))} metricKey={trendKey} kind={trendKind} /><p className="section-note">History keeps fetches where Products Sold changed. Other metrics may change between those fetches. Snapshot changes mix continuing accounts, delayed uploads and new accounts. Missing values are omitted. They do not identify a player cohort.</p></section>
        <section className="panel"><Heading kicker="RECORDED ACTIVITY" title="What players are doing" /><p className="section-note">Each metric keeps its own units. More sold units than staff checkouts does not establish a preferred activity or player share.</p><div className="table-wrap"><table><thead><tr><th>Activity</th><th>Lifetime / current sum</th><th>Net change</th><th>Meaning</th></tr></thead><tbody>{STATS.filter(s => s.group !== 'Legacy').map(s => <tr key={s.key}><td><strong>{s.label}</strong><small>{s.group}</small></td><td>{num(snapshot?.totals?.[s.key])}<small>{s.unit}</small></td><td>{signed(delta(snapshot?.totals?.[s.key], baseline?.totals?.[s.key]))}</td><td className="description">{s.description}{s.caution && <small className="caution">{s.caution}</small>}{snapshot?.unavailable?.[s.key] && <small className="caution">{snapshot.unavailable[s.key]}</small>}</td></tr>)}</tbody></table></div></section>
      </>}
      {page === 'audience' && <>
        <div className="metrics three"><Card label="Selected population" value={num(report?.uniquePlayers)} note={report ? `${populations[report.population]} · ${report.asOf}` : 'Add a sourced Steamworks report below.'} /><Card label="Median total playtime" value={median !== null ? minutes(median) : range(bucket)} note={median !== null ? 'Report value, entered manually.' : bucket ? 'A range derived from histogram counts.' : 'No report measurement available.'} /><Card label="Mean total playtime" value={minutes(report?.meanMinutes)} note="Report value. Longer-playing accounts can raise the mean." /></div>
        {report && <section className="panel"><Heading kicker="REPORT CONTEXT" title={report.label} /><p className="section-note">{report.source} · as of {report.asOf} UTC · {populations[report.population]}</p>{report.notes && <p className="report-notes">{report.notes}</p>}{report.histogram.length > 0 && <><h3 className="subheading">Total playtime distribution</h3><div className="histogram">{report.histogram.map((b, i) => <div className="hist-row" key={i}><span>{minutes(b.minMinutes)} – {b.maxMinutes === null ? '∞' : minutes(b.maxMinutes)}</span><div className="track"><div style={{ width: `${report.uniquePlayers ? b.count / report.uniquePlayers * 100 : 0}%` }} /></div><strong>{num(b.count)}</strong><span>{report.uniquePlayers ? pct(b.count / report.uniquePlayers * 100) : '—'}</span></div>)}</div>{bucket && <p className="section-note">Histogram median lies within {range(bucket)}. This is total accumulated playtime, not a first-session duration or time to an achievement.</p>}</>}</section>}
        <section className="panel"><Heading kicker="ADD HISTORICAL CONTEXT" title="Record a Steamworks report" /><p className="section-note">Enter measurements from the publisher report, or load a prepared JSON report. The global stats API does not supply population counts or median playtime.</p><label className="file-label">Load report JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={async e => { const file = e.target.files?.[0]; if (!file) return; try { if (file.size > 256 * 1024) throw new Error('Report exceeds 256 KiB.'); await saveReport(validateReport(JSON.parse(await file.text()))); } catch (err) { setError(err.message); } e.target.value = ''; }} /></label><ReportForm onSave={saveReport} busy={busy} /></section>
      </>}
      {page === 'data' && <section className="panel"><Heading kicker="AUDIT & BACKUP" title="Raw measurements"><div className="actions"><a className="button" aria-disabled={!snapshot} href={snapshot ? `/observatory/gsc/api/snapshot.csv?snapshot=${encodeURIComponent(snapshot.id)}${baseline ? `&baseline=${encodeURIComponent(baseline.id)}` : ''}` : undefined} download>Export snapshot CSV</a><a className="button" href="/observatory/gsc/api/archive.json" download>Export JSON archive</a></div></Heading><label className="search-label">Filter measurements<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or API key…" /></label><div className="table-wrap"><table><thead><tr><th>Measurement / API name</th><th>Value</th><th>Baseline</th><th>Net change</th><th>Status</th></tr></thead><tbody>{[...STATS.map(s => ({ ...s, kind: 'Stat', field: 'totals' })), ...ACHIEVEMENTS.map(a => ({ ...a, kind: 'Achievement', field: 'achievements', unit: '%' })), ...Object.keys(snapshot?.achievements ?? {}).filter(key => !ACHIEVEMENTS.some(a => a.key === key)).map(key => ({ key, label: key, kind: 'Extra Steam achievement', field: 'achievements', unit: '%' }))].filter(s => `${s.label} ${s.key}`.toLowerCase().includes(query.toLowerCase())).map(s => {
          const value = snapshot?.[s.field]?.[s.key] ?? null, prev = baseline?.[s.field]?.[s.key] ?? null;
          return <tr key={`${s.kind}-${s.key}`}><td><strong>{s.label}</strong><code>{s.key}</code><small>{s.kind}</small></td><td>{num(value)}<small>{s.unit}</small></td><td>{num(prev)}</td><td>{signed(delta(value, prev), s.kind.includes('achievement') || s.kind === 'Achievement' ? ' pp' : '')}</td><td className="description">{value === null ? snapshot?.unavailable?.[s.key] ?? 'No snapshot' : 'Available'}{s.caution && <small className="caution">{s.caution}</small>}</td></tr>;
        })}</tbody></table></div><p className="section-note">CSV exports every catalog metric regardless of the search filter. JSON includes reports, all saved snapshots, source URLs and definitions.</p></section>}
      {page === 'reading' && <div className="reading"><section className="panel"><Heading kicker="MEASUREMENT CONTRACT" title="Read the audience, then investigate" /><div className="reading-grid">
        <article><h3>Achievement reach</h3><p>Steam supplies lifetime percentages for its achievement population. Optional actions such as hiring and expansion do not form a required chain. A lower percentage invites investigation; it does not identify who abandoned the game or why.</p></article>
        <article><h3>Player counts</h3><p>New-game starts, loads, owners and concurrent players describe different populations. Account estimates stay off unless you explicitly verify a matching lifetime achievement population and its report has the snapshot’s UTC date. Rounded percentages make those counts approximate.</p></article>
        <article><h3>Median and mean</h3><p>A median requires a distribution or individual observations. The report’s median is stored as supplied. A full histogram gives a bounded median estimate; an open-ended bucket may leave its upper bound unknown. Summed time divided by players would give a mean.</p></article>
        <article><h3>Timing milestones</h3><p>A calendar achievement timestamp does not reveal gameplay time at unlock. Measuring minutes to first sale or first hire requires recording accumulated gameplay time when the action first succeeds. Existing global totals cannot reconstruct it.</p></article>
        <article><h3>Release history and modes</h3><p>{COVERAGE} New achievements have had less time to accumulate than older ones. A report annotation cannot filter the underlying Steam population.</p></article>
        <article><h3>Snapshot comparisons</h3><p>Differences are net changes between download times. They can include delayed uploads and continuing players. Resettable stats can fall. Achievement percentages can fall when the population grows; that does not imply revoked achievements.</p></article>
      </div></section><section className="panel"><Heading kicker="OBSERVATORY V1" title="Tracking prepared for the next build" /><p>Early setup reach, first-sale timing and multiplayer participation are implemented. Publish the new Steamworks definitions and a tracking-enabled build before expecting data. These measurements still cannot identify exact abandonment, calendar-day retention or player-level relationships with playtime. Repeated optional-feature use and timing later milestones remain future work.</p><div className="source-links"><a href="#progression">Early progression →</a><a href="#multiplayer">Multiplayer →</a><a href="https://partner.steamgames.com/doc/features/achievements" target="_blank" rel="noreferrer">Steam stats & achievements ↗</a><a href="https://partner.steamgames.com/doc/webapi/ISteamUserStats" target="_blank" rel="noreferrer">Steam stats Web API ↗</a><a href="https://partner.steamgames.com/doc/observatory/gsc/api/ISteamUserStats#GetAchievementAndUnlockTime" target="_blank" rel="noreferrer">Achievement unlock timestamps ↗</a></div></section></div>}
      {!snapshot && page !== 'audience' && page !== 'reading' && <div className="empty"><span className="empty-symbol">↗</span><h2>Your first snapshot starts here</h2><p>Download the existing GSC Steam stats and achievement percentages.<br />Add a Steamworks report for population and playtime context.</p><button onClick={refresh} disabled={busy}>Download Steam data</button></div>}
      <footer><span>GSC Observatory · App {APP_ID}</span><span>{snapshots.length} snapshots · {history.reports.length} reports · {snapshot ? `Downloaded ${stamp(snapshot.fetchedAt)}` : 'No Steam download yet'}{history.snapshots.length > snapshots.length && ` · ${history.snapshots.length - snapshots.length} older unchanged fetches hidden`}</span></footer>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
