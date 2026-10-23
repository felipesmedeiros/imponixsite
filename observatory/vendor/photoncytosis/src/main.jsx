import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { APPS, appFor, statsFor, achievementsFor } from '../shared/catalog.mjs';
import { consistencyWarnings, delta, reach, medianBucket } from '../shared/analysis.mjs';
import { comparisonFor, localDay, snapshotForDay, daysBefore } from '../shared/comparison.mjs';
import icon from '../external/icon.png';
import './style.css';

const fmt = n => Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—';
const minutes = n => Number.isFinite(n) ? `${fmt(n / 60)} min` : '—';
const stamp = s => new Date(s).toLocaleString();
const signed = (n, format = fmt) => Number.isFinite(n) ? `${n > 0 ? '+' : ''}${format(n)}` : '—';
function ComparisonValues({before, after, format = fmt, suffix = ''}) {
  const change = delta(after,before);
  return <div className="comparison-values"><div><small>From</small><span>{format(before)}</span></div><div><small>To</small><span>{format(after)}</span></div><div className={change < 0 ? 'negative' : change > 0 ? 'positive' : ''}><small>Change</small><strong>{signed(change,format)}{change !== null ? suffix : ''}</strong></div></div>;
}
const initialApp = Number(new URLSearchParams(location.search).get('appId'));
function App() {
  const [appId,setAppId] = useState(APPS.some(a => a.id === initialApp) ? initialApp : APPS[0].id);
  const [history,setHistory] = useState(null), [selected,setSelected] = useState(''), [baselineId,setBaselineId] = useState('');
  const [page,setPage] = useState('Overview'), [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState(''), [search,setSearch] = useState('');
  const [dateNotice,setDateNotice] = useState('');
  const app = appFor(appId), defs = statsFor(appId);
  const api = path => `/observatory/photoncytosis/api/${path}${path.includes('?') ? '&' : '?'}appId=${appId}`;
  const snapshots = history?.snapshots ?? [], reports = history?.reports ?? [];
  const {ordered,snapshot,earlier,baseline} = comparisonFor(snapshots,appId,selected,baselineId);
  const totals = snapshot?.totals ?? {};
  useEffect(() => {
    const controller = new AbortController();
    setHistory(null);setSelected('');setBaselineId('');setError('');setNotice('');setDateNotice('');
    setPage(p => p === 'Demo goals' && app.edition === 'full' ? 'Overview' : p);
    const url = new URL(location.href);url.searchParams.set('appId',appId);window.history.replaceState(null,'',url);
    fetch(`/observatory/photoncytosis/api/history?appId=${appId}`,{ signal:controller.signal }).then(async r => {
      const data = await r.json();if (!r.ok) throw new Error(data.error);return data;
    }).then(setHistory).catch(e => {if(e.name !== 'AbortError')setError(e.message);});
    return () => controller.abort();
  },[appId]);
  async function refresh() {
    setBusy(true);setError('');setNotice('');
    try {
      const r = await fetch(api('refresh'),{ method:'POST' }),data = await r.json();
      if(!r.ok)throw new Error(data.error);
      setHistory(data);setDateNotice('');
      setNotice(data.cached ? 'Showing the latest saved snapshot; downloads have a one-minute cooldown.' : 'Steam snapshot saved for this edition.');
    } catch(e) {setError(e.message);} finally {setBusy(false);}
  }
  function chooseDay(side, day) {
    const match = snapshotForDay(side === 'from' ? earlier : ordered,day);
    if (!match) return;
    if (side === 'from') setBaselineId(match.id); else setSelected(match.id);
    setDateNotice(localDay(match.fetchedAt) === day ? '' : `No ${side === 'from' ? 'earlier ' : ''}snapshot on ${day}. Using the closest saved date: ${stamp(match.fetchedAt)}. No values are interpolated.`);
  }
  function preset(days) {
    if (!days) {setBaselineId(earlier.at(-1)?.id ?? '');setDateNotice('');}
    else chooseDay('from',daysBefore(snapshot.fetchedAt,days));
  }
  const tabs = ['Overview','Progression','Research & cells','DNA','Discovery','Idle time',...(app.edition === 'demo' ? ['Demo goals'] : []),'Audience & playtime','Measurements','Reading the data'];
  const warnings = [...(snapshot?.warnings ?? []), ...consistencyWarnings(snapshot)];
  const cards = [ ['PH_O1_LAUNCHED','Launched accounts'],['PH_O1_STARTED','Observed a live organism'],['PH_O1_RESEARCH_COMPLETED','Reached research'],[app.edition === 'demo' ? 'PH_O1_DEMO_COMPLETE' : 'PH_O1_GROWN_32',app.edition === 'demo' ? 'Completed required demo goals' : 'Reached 32 healthy cells'] ];
  function Rows({items}) {
    return <div className="reach-list">{items.map(d => {
      const percentage = snapshot ? reach(d,snapshot) : null;
      return <div className="reach-row" key={d.key} title={d.condition}>
        <div><strong>{d.label}</strong><small>{d.unit}{d.denominator ? ` / ${defs.find(x => x.id === d.denominator)?.label.toLowerCase()} accounts` : ''}</small></div>
        <div className="track"><i style={{width:`${Math.min(100,Math.max(0,percentage ?? 0))}%`}}/></div>
        <div className="value">{baseline ? <ComparisonValues before={baseline.totals?.[d.key]} after={totals[d.key]}/> : fmt(totals[d.key])}<small>{percentage === null ? 'To reach: —' : `To reach: ${fmt(percentage)}%`}</small></div>
      </div>;
    })}</div>;
  }
  function TimeChart() {
    const keys = ['PH_O1_MENU_VISIBLE_SECONDS','PH_O1_MENU_HIDDEN_SECONDS'];
    const known = keys.every(k => Number.isFinite(totals[k])), sum = known ? keys.reduce((n,k) => n+totals[k],0) : null;
    return <><div className="time-total"><strong>{minutes(totals.PH_O1_ACTIVE_SECONDS)}</strong><span>Healthy, unpaused runtime across all measured accounts</span>{baseline && <ComparisonValues before={baseline.totals?.PH_O1_ACTIVE_SECONDS} after={totals.PH_O1_ACTIVE_SECONDS} format={minutes}/>}</div>
      {keys.map((k,i) => <div className="time-row" key={k}><span>Menu {i ? 'hidden or minimized' : 'visible'}</span><div className="track"><i className={i ? 'warm' : ''} style={{width:`${sum > 0 ? totals[k]/sum*100 : 0}%`}}/></div><strong>{minutes(totals[k])}</strong>{baseline && <ComparisonValues before={baseline.totals?.[k]} after={totals[k]} format={minutes}/>}<small>{sum > 0 ? `${fmt(totals[k]/sum*100)}% of measured seconds at To` : '—'}</small></div>)}
      <p className="muted">Background operation is an intended part of Photoncytosis. These buckets measure window visibility, not attention. Pause, extinction, Debug, diagnostics and suspension do not add runtime. Simulation speed does not multiply these clocks.</p></>;
  }
  return <div className="shell">
    <header><div className="brand"><img src={icon} alt=""/><div><h1>PHOTON<span>CYTOSIS</span></h1><p>PLAYER OBSERVATORY</p></div></div>
      <div className="header-actions"><div className="edition"><label htmlFor="edition">Measurement edition</label><select id="edition" disabled={busy} value={appId} onChange={e => setAppId(Number(e.target.value))}>{APPS.map(a => <option value={a.id} key={a.id}>{a.label} · {a.id}</option>)}</select></div>
      <button disabled={busy || !history} onClick={refresh}>{busy ? 'Downloading…' : 'Download Steam data'}</button></div></header>
    <section className="comparison-controls" aria-label="Date comparison">
      <div className="section-heading"><h2>Compare dates</h2><ExportMenu key={appId} app={app} snapshot={snapshot} baseline={baseline} disabled={busy || !history} api={api}/></div>
      <div className="date-range"><div className="date-endpoint"><label>From date<input type="date" value={baseline ? localDay(baseline.fetchedAt) : ''} disabled={!earlier.length || busy} onInput={e => chooseDay('from',e.target.value)}/></label><label>From snapshot<select value={baseline?.id ?? 'none'} disabled={!earlier.length || busy} onChange={e => {setBaselineId(e.target.value);setDateNotice('');}}><option value="none">No comparison</option>{earlier.slice().reverse().map(s => <option key={s.id} value={s.id}>{stamp(s.fetchedAt)}</option>)}</select></label></div>
      <span className="range-arrow" aria-hidden="true">→</span><div className="date-endpoint"><label>To date<input type="date" value={snapshot ? localDay(snapshot.fetchedAt) : ''} disabled={!ordered.length || busy} onInput={e => chooseDay('to',e.target.value)}/></label><label>To snapshot<select value={snapshot?.id ?? ''} disabled={!ordered.length || busy} onChange={e => {setSelected(e.target.value);setDateNotice('');}}>{!ordered.length && <option value="">No saved snapshots</option>}{ordered.slice().reverse().map(s => <option key={s.id} value={s.id}>{stamp(s.fetchedAt)}</option>)}</select></label></div></div>
      <div className="comparison-shortcuts"><span>Compare To with</span>{[[0,'Previous snapshot'],[7,'7 days ago'],[30,'30 days ago']].map(([days,label]) => <button key={days} disabled={!earlier.length || busy} onClick={() => preset(days)}>{label}</button>)}<small>{ordered.length} snapshots · {reports.length} reports · Dates in your local time</small></div>
      {dateNotice && <p role="status" className="date-notice">{dateNotice}</p>}
      <div className="comparison-summary">{baseline ? <><strong>{stamp(baseline.fetchedAt)} → {stamp(snapshot.fetchedAt)}</strong><span>Changes are To minus From in lifetime totals, not new-player counts.</span></> : <span>{snapshot ? `Showing ${stamp(snapshot.fetchedAt)}. ${earlier.length ? 'Choose a From date to compare.' : 'An earlier saved snapshot is needed to compare.'}` : 'Save at least two snapshots to compare dates.'}</span>}</div>
    </section>
    <nav aria-label="Observatory views">{tabs.map(t => <button key={t} className={page === t ? 'active' : ''} onClick={() => setPage(t)}>{t}</button>)}</nav>
    {error && <div role="alert" className="message error">{error}</div>}{notice && <div role="status" className="message">{notice}</div>}
    {warnings.map((w,i) => <div className="message warning" key={i}>{w}</div>)}
    {!snapshot && <div className="empty"><strong>No Steam snapshot for {app.label.toLowerCase()} yet.</strong><span>Tracking and reporting are ready. Steam definitions and an instrumented Release build must be published before custom totals are available. Missing measurements remain —.</span></div>}
    <main>
      {page === 'Overview' && <><section className="cards">{cards.map(([key,label]) => <article key={key}><small>{label}</small><strong>{fmt(totals[key])}</strong><span>Lifetime account reach at To</span>{baseline && <ComparisonValues before={baseline.totals?.[key]} after={totals[key]}/>}</article>)}</section><div className="columns"><section><h2>From light to life</h2><p className="muted">Observed milestones across experiments. Optional actions do not form an ordered abandonment funnel.</p><Rows items={defs.filter(d => ['Started','Feeding','Grown8','ResearchCompleted','Survived5m','Recovered'].includes(d.id))}/></section><section><h2>How the colony runs</h2><TimeChart/></section></div></>}
      {['Progression','Research & cells','Discovery','Demo goals'].includes(page) && <section><h2>{page}</h2><p className="muted">Per-account lifetime reach. Hover a row for the exact trigger. Counts can overlap and can include restored progress.</p><Rows items={defs.filter(d => d.kind === 'flag' && (page === 'Progression' ? d.group === 'Progression' : page === 'Research & cells' ? ['Research','Cells'].includes(d.group) : page === 'Discovery' ? d.group === 'Discovery' : d.group === 'Demo'))}/></section>}
      {page === 'Demo goals' && <section><h2>Required and optional discoveries</h2><p>Survival, growth, research, sequencing and an inherited gene effect complete the demo. Specialization and recovery are optional discoveries. Completion totals also retain earlier builds’ criteria.</p></section>}
      {page === 'DNA' && <><section><h2>From sequencing to an inherited effect</h2><p className="muted">Lifetime account reach. Sequencing can finish without a living subject. Inheritance requires healthy tissue; an effect requires positive work measured during live play.</p><Rows items={defs.filter(d => d.group === 'DNA' && d.kind === 'flag')}/><p className="muted">Loaded libraries and birth templates can count as progress. Loading a gene does not count as observing its effect. Older snapshots show — for DNA; no history is filled with invented zeros.</p></section><section><h2>Genome progression</h2><div className="columns">{defs.filter(d => d.group === 'DNA' && d.kind === 'maximum').map(d => <div className="time-total" key={d.key} title={d.condition}><span>{d.label}</span><strong>{fmt(totals[d.key])}</strong><span>Sum of account maxima at To</span>{baseline && <ComparisonValues before={baseline.totals?.[d.key]} after={totals[d.key]}/>}</div>)}</div><p className="muted">These totals sum each account’s best gene count. They are neither an average genome size nor the largest genome worldwide. {app.edition === 'demo' ? 'Demo limits: 4 sequenced, 3 expressed.' : 'Full game limits: 20 sequenced, 10 expressed.'}</p></section></>}
      {page === 'Idle time' && <section><h2>Real time, independent of biology speed</h2><TimeChart/><Rows items={defs.filter(d => d.group === 'Time' && d.kind === 'flag')}/><p>Cumulative duration reach can be earned across sessions. It does not measure first-session retention or average session length.</p></section>}
      {page === 'Measurements' && <section><h2>All measurements</h2><input aria-label="Filter measurements" placeholder="Filter labels or API names…" value={search} onChange={e => setSearch(e.target.value)}/><div className="table-wrap"><table><thead><tr><th>Measurement</th><th>Unit</th><th>From<small>{baseline ? stamp(baseline.fetchedAt) : 'No comparison'}</small></th><th>To<small>{snapshot ? stamp(snapshot.fetchedAt) : 'No snapshot'}</small></th><th>Change<small>To − From</small></th><th>Availability</th></tr></thead><tbody>{[...defs,...achievementsFor(appId).map(a => ({...a,unit:'percent',kind:'achievement'}))].filter(d => `${d.label} ${d.key}`.toLowerCase().includes(search.toLowerCase())).map(d => {
        const field = d.kind === 'achievement' ? 'achievements' : 'totals', n = snapshot?.[field]?.[d.key], b = baseline?.[field]?.[d.key], change = delta(n,b);
        return <tr key={d.key}><td title={d.condition}>{d.label}<code>{d.key}</code></td><td>{d.unit}</td><td>{fmt(b)}</td><td>{fmt(n)}</td><td className={change < 0 ? 'negative' : change > 0 ? 'positive' : ''}>{signed(change)}{d.kind === 'achievement' && change !== null ? ' pp' : ''}</td><td>{snapshot?.unavailable?.[d.key] ?? (Number.isFinite(n) ? 'Available' : 'Not collected')}</td></tr>;
      })}</tbody></table></div><p className="muted">Exports include every definition, irrespective of this filter. Comparisons stay within the selected edition. Negative changes remain visible.</p></section>}
      {page === 'Audience & playtime' && <section><h2>Steamworks audience & playtime reports</h2><p className="muted">Separate publisher reports entered by you. These are not inferred from gameplay totals. Each report belongs to {app.label.toLowerCase()} ({app.id}).</p><ReportForm key={appId} appId={appId} disabled={busy} onSave={async raw => {
        setBusy(true);
        try {const r = await fetch(api('reports'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(raw)}), data = await r.json();if(!r.ok)throw new Error(data.error);setHistory(data);}
        finally {setBusy(false);}
      }}/><div className="report-list">{[...reports].reverse().map(r => {const bound = medianBucket(r.histogram);return <article key={r.id}><h3>{r.label}</h3><p>{r.asOf} UTC · {r.population.replaceAll('_',' ')} · {fmt(r.uniquePlayers)} accounts</p><p>Median: {r.medianMinutes !== null ? `${fmt(r.medianMinutes)} min (reported)` : bound ? `${fmt(bound.minMinutes)}–${bound.maxMinutes === null ? 'unbounded' : fmt(bound.maxMinutes)} min (histogram bounds)` : '—'} · Mean: {fmt(r.meanMinutes)} min</p><small>Source: {r.source}</small><p>{r.notes}</p></article>;})}</div></section>}
      {page === 'Reading the data' && <section className="guide"><h2>Reading the data</h2><h3>Reach, not a reconstruction of a play session</h3><p>Account flags are 0/1 for each Steam account. Global totals sum those flags. Repeated experiments do not add another account. Shared definitions have the same meaning in both editions, but their accounts, totals and histories remain separate.</p><h3>Name the denominator</h3><p>Rows show their denominator. Zero or missing denominators produce no percentage. Optional features can be discovered in any order; independent sums cannot identify intersections between groups. A store-link action is not a wishlist or purchase.</p><h3>Time has two meanings</h3><p>Subject survival uses biological seconds and is affected by simulation speed. Runtime counters use real seconds while healthy player tissue lives and the simulation is unpaused. Focus does not gate runtime. Menu-hidden time can be desirable idle play. It does not prove abandonment.</p><h3>Loaded progress and offline play</h3><p>Observed colony, research and checklist states can recognize restored progress. Historic real time is not reconstructed. Account totals merge by maximum when Steam reconnects; independent offline devices can undercount cumulative activity. Steam acknowledgements confirm storage, not immediate global aggregation.</p><h3>Snapshots are baselines</h3><p>Download timestamps record fetch time. Differences are net changes in lifetime totals, not a cohort of new players. Existing players, QA, older builds and delayed uploads can contribute. Do not reset Steam stats to create a research baseline.</p><h3>Bring other evidence</h3><p>Playtime histograms, audience, store traffic, wishlists, reviews and observed playtests answer different questions. This tool downloads custom aggregate stats and full-game achievement percentages; it does not automatically download those publisher reports or individual player histories.</p></section>}
    </main><footer>Imponix Game Studio · Photoncytosis · {app.label} / {app.id} · Private history, manual downloads</footer>
  </div>;
}
function ExportMenu({app,snapshot,baseline,disabled,api}) {
  const [open,setOpen] = useState(false), container = useRef(null), trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = e => {if (!container.current?.contains(e.target)) setOpen(false);};
    const escape = e => {if (e.key === 'Escape') {setOpen(false);trigger.current?.focus();}};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
    return () => {document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
  },[open]);
  useEffect(() => {if (disabled) setOpen(false);},[disabled]);
  return <div className="export-menu" ref={container} onBlur={e => {if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);}}>
    <button ref={trigger} disabled={disabled} aria-expanded={open} aria-controls="export-options" onClick={() => setOpen(!open)}>Exports ▾</button>
    {open && <div id="export-options" className="export-options" role="region" aria-label="Available exports">
      <small>{app.label} · {app.id}</small>
      {snapshot ? <a className="button" href={api(`snapshot.csv?snapshot=${snapshot.id}${baseline ? `&baseline=${baseline.id}` : ''}`)} onClick={() => setOpen(false)}>Export CSV</a> : <button disabled>Export CSV</button>}
      {!snapshot && <small>Download a snapshot to export CSV.</small>}
      <a className="button" href={api('archive.json')} onClick={() => setOpen(false)}>Export edition archive</a>
    </div>}
  </div>;
}
function ReportForm({appId,onSave,disabled}) {
  const [error,setError] = useState(''), [busy,setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();setError('');setBusy(true);
    try {
      const form = e.currentTarget, data = new FormData(form), number = key => data.get(key) === '' ? null : Number(data.get(key));
      await onSave({ appId,label:data.get('label'),source:data.get('source'),asOf:data.get('asOf'),population:data.get('population'),uniquePlayers:number('uniquePlayers'),medianMinutes:number('medianMinutes'),meanMinutes:number('meanMinutes'),notes:data.get('notes'),histogram:JSON.parse(data.get('histogram') || '[]') });
      form.reset();
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  return <form onSubmit={submit} className="report-form"><div className="form-grid"><label>Report label<input name="label" required maxLength={120}/></label><label>Source / report location<input name="source" required maxLength={500}/></label><label>As-of date (UTC)<input type="date" name="asOf" required/></label><label>Population<select name="population"><option value="period_players">Players in a period</option><option value="lifetime_players">Lifetime players</option><option value="owners">Owners</option><option value="other">Other (describe below)</option></select></label><label>Population count<input name="uniquePlayers" type="number" min="0" step="1"/></label><label>Median minutes<input name="medianMinutes" type="number" min="0" step="any"/></label><label>Mean minutes<input name="meanMinutes" type="number" min="0" step="any"/></label></div><label>Period, filters and population notes<textarea name="notes" maxLength={2000}/></label><label>Optional complete histogram JSON<textarea name="histogram" placeholder='[{"minMinutes":0,"maxMinutes":10,"count":12},{"minMinutes":10,"maxMinutes":null,"count":8}]'/></label>{error && <p role="alert" className="negative">{error}</p>}<button disabled={disabled || busy}>{busy ? 'Saving…' : 'Save report'}</button></form>;
}
createRoot(document.getElementById('root')).render(<App/>);
