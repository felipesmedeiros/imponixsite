import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  APP_ID,
  STATS,
  group,
  stat,
  value,
  snapshotsWithChanges,
  percent,
  delta,
  sum,
  consistencyWarnings,
  toCsv,
} from "../shared/stats.mjs";
import "./style.css";

const number = (n) =>
  n === null || n === undefined ? "—" : n.toLocaleString();
const accounts = (n) => `${number(n)} ${n === 1 ? "account" : "accounts"}`;
const percentage = (n) =>
  n === null
    ? "—"
    : `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
const stamp = (s) =>
  new Date(s).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
function duration(n) {
  if (n === null) return "—";
  if (n < 60) return `${Math.floor(n)}s`;
  if (n < 3600) return `${Math.floor(n / 60)}m ${Math.floor(n % 60)}s`;
  return `${Math.floor(n / 3600).toLocaleString()}h ${Math.floor((n % 3600) / 60)}m`;
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function api(path, method = "GET") {
  const response = await fetch(path, { method });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.error || "Could not load the dashboard.");
  return body;
}
function Heading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function Metric({ label, metric, note, accent }) {
  return (
    <article className={`metric ${accent ? "accent" : ""}`}>
      <span className="eyebrow">{label}</span>
      <strong>{metric}</strong>
      <p>{note}</p>
    </article>
  );
}
function Bars({
  snapshot,
  definitions,
  denominator,
  suffix = "of launched accounts",
  compact = false,
}) {
  return (
    <div className={`bars ${compact ? "compact-bars" : ""}`}>
      {definitions.map((s, index) => {
        const count = value(snapshot, s.key),
          share = percent(count, denominator);
        return (
          <div className="bar-row" key={s.key} title={s.description}>
            <div className="bar-label">
              <span className="row-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{s.label}</span>
              <strong>{number(count)}</strong>
              <span
                className="bar-percent"
                aria-label={
                  share === null
                    ? "Percentage unavailable"
                    : `${percentage(share)} ${suffix}`
                }
              >
                {percentage(share)}
              </span>
            </div>
            <div className="track" aria-hidden="true">
              <div
                style={{ width: `${Math.min(100, Math.max(0, share ?? 0))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [snapshots, setSnapshots] = useState([]);
  const [selected, setSelected] = useState("");
  const [baselineId, setBaselineId] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stats");
  const history = snapshotsWithChanges(snapshots);
  const snapshot = history.find((s) => s.id === selected) ?? history.at(-1);
  const earlier = history.filter(
    (s) =>
      snapshot &&
      s.id !== snapshot.id &&
      Date.parse(s.fetchedAt) < Date.parse(snapshot.fetchedAt),
  );
  const baseline = earlier.find((s) => s.id === baselineId) ?? null;
  const launched = value(snapshot, "launched");
  const started = value(snapshot, "started");
  const processing = value(snapshot, "processing_started");
  const waiting = sum(snapshot, group("Waiting time"));
  const missingStats = snapshot ? STATS.filter(s => value(snapshot,s.key) === null) : [];
  const warnings = consistencyWarnings(snapshot);
  const table = STATS.filter(
    (s) =>
      (category === "All stats" || s.group === category) &&
      `${s.label} ${s.key} ${s.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  useEffect(() => {
    let active = true;
    api("/observatory/noema/api/snapshots")
      .then((data) => {
        if (active) setSnapshots(data.snapshots);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function refresh() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await api("/observatory/noema/api/refresh", "POST");
      setSnapshots(data.snapshots);
      setSelected("");
      setNotice(
        data.cached
          ? "Showing the latest stats change. Steam requests are limited to once a minute."
          : snapshotsWithChanges(data.snapshots).at(-1)?.id ===
              data.snapshots.at(-1)?.id
            ? "Steam totals downloaded. A new snapshot is available in history."
            : "Steam totals downloaded. No stats changed; this download is hidden from history.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const fileDate = snapshot?.fetchedAt
    .replaceAll(":", "-")
    .replaceAll(".", "-");
  function exportJson() {
    download(
      `noema-demo-stats-${fileDate}.json`,
      JSON.stringify(
        {
          version: 1,
          appId: APP_ID,
          definitions: STATS,
          selectedSnapshotId: snapshot.id,
          baselineId: baseline?.id ?? null,
          snapshots,
        },
        null,
        2,
      ),
      "application/json",
    );
  }

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-mark">( = )</span> NOEMA
          <span className="brand-sub">DEMO OBSERVATORY</span>
        </a>
        <div className="sidebar-label">REPORTS</div>
        <nav aria-label="Reports">
          <a href="#overview">
            <span>01</span> Overview
          </a>
          <a href="#progression">
            <span>02</span> Player journey
          </a>
          <a href="#pacing">
            <span>03</span> First message
          </a>
          <a href="#processing">
            <span>04</span> Processing & modes
          </a>
          <a href="#background">
            <span>05</span> Background play
          </a>
          <a href="#data">
            <span>06</span> All statistics
          </a>
          <a href="#reading">
            <span>07</span> Reading the data
          </a>
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" /> STEAM GLOBAL STATS
          <br />
          <span>DEMO APP / {APP_ID}</span>
          <p>
            Read-only reporting
            <br />
            Stored in the private database
          </p>
          <a
            href="https://partner.steamgames.com/apps/stats/5254450"
            target="_blank"
            rel="noreferrer"
          >
            Open Steamworks ↗
          </a>
        </div>
      </aside>

      <main id="main">
        <header className="topbar">
          <span>
            NOEMA <span className="slash">/</span> PLAYER RESEARCH
          </span>
          <span className="local-tag">PRIVATE DASHBOARD</span>
        </header>
        <section id="overview" className="intro">
          <span className="eyebrow">DEMO / AUDIENCE SIGNALS</span>
          <div className="intro-row">
            <div>
              <h1>Follow the signal.</h1>
              <p>
                See how far players go, and where the experience slows down.
              </p>
            </div>
            <button className="primary" onClick={refresh} disabled={busy}>
              {busy ? "Connecting…" : "↻ Download Steam stats"}
            </button>
          </div>
          <div className="sync-line">
            <span className={`status-dot ${snapshot ? "" : "muted"}`} />
            {snapshot ? (
              <>
                Downloaded {stamp(snapshot.fetchedAt)}{" "}
                <span className="dot-separator">·</span>{" "}
                {STATS.length - missingStats.length}/{STATS.length} stats available
              </>
            ) : (
              "No Steam data downloaded yet"
            )}
            <span className="sync-help">
              {snapshots.length > 0 &&
                `Last checked ${stamp(snapshots.at(-1).fetchedAt)}. `}
              Steam totals may lag behind gameplay.
            </span>
          </div>
        </section>

        {error && (
          <div role="alert" className="alert error">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="alert notice">
            {notice}
          </div>
        )}
        {missingStats.length > 0 && (
          <div role="status" className="alert error">
            {missingStats.length === 1
              ? "One stat is"
              : `${missingStats.length} stats are`}{" "}
            unavailable in this response. Missing values appear as “—”, never as
            zero. Inspect All statistics for details.
          </div>
        )}
        {warnings.length > 0 && (
          <div className="alert error">
            <strong>Some totals do not agree.</strong>
            <ul>
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {!snapshot ? (
          <section className="empty panel">
            <span className="empty-mark">( · )</span>
            <h2>Your next playtest starts here.</h2>
            <p>
              Download the demo’s {STATS.length} aggregate stats from Steam.
              <br />
              Each refresh saves a snapshot so you can compare later.
            </p>
            <p className="muted-text">
              No Steam login, API key, or Unity Editor required.
            </p>
          </section>
        ) : (
          <>
            <div className="snapshot-toolbar">
              <label>
                Viewing snapshot
                <select
                  value={selected}
                  onChange={(e) => {
                    setSelected(e.target.value);
                    setBaselineId("");
                  }}
                >
                  <option value="">Latest stats change</option>
                  {[...history].reverse().map((s) => (
                    <option key={s.id} value={s.id}>
                      {stamp(s.fetchedAt)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Compare changes with
                <select
                  value={baseline?.id ?? ""}
                  onChange={(e) => setBaselineId(e.target.value)}
                >
                  <option value="">No comparison</option>
                  {[...earlier].reverse().map((s) => (
                    <option key={s.id} value={s.id}>
                      {stamp(s.fetchedAt)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="export-actions">
                <button
                  onClick={() =>
                    download(
                      `noema-demo-stats-${fileDate}.csv`,
                      "\uFEFF" + toCsv(snapshot, baseline),
                      "text/csv;charset=utf-8",
                    )
                  }
                >
                  ↓ CSV
                </button>
                <button onClick={exportJson}>↓ JSON archive</button>
              </div>
            </div>
            <p className="comparison-note">
              History shows the first download and changes to stats only.
              {snapshots.length > history.length &&
                ` ${snapshots.length - history.length} unchanged downloads hidden.`}
            </p>
            {baseline && (
              <p className="comparison-note">
                Comparing with {stamp(baseline.fetchedAt)}. Changes appear in
                the table below. Charts show lifetime totals; snapshot
                differences do not identify a new-player cohort.
              </p>
            )}
            <div className="metrics">
              <Metric
                label="TRACKED ACCOUNTS"
                metric={number(launched)}
                note="Launched an instrumented demo build"
                accent
              />
              <Metric
                label="FIRST FRAGMENT"
                metric={percentage(
                  percent(value(snapshot, "first_fragment"), launched),
                )}
                note={`${accounts(value(snapshot, "first_fragment"))} decoded a fragment`}
              />
              <Metric
                label="DEMO COMPLETED"
                metric={number(value(snapshot, "ending_reached"))}
                note={`${percentage(percent(value(snapshot, "ending_reached"), launched))} of tracked accounts`}
              />
              <Metric
                label="FOREGROUND PLAY"
                metric={duration(value(snapshot, "foreground_seconds"))}
                note="Total across accounts and sessions"
              />
            </div>
            <div className="context-strip">
              <span className="context-symbol">i</span>
              <p>
                These stats begin with the instrumented build. Earlier players
                are included only if they return.{" "}
                <strong>Our live QA activity is included.</strong>
              </p>
            </div>

            <div className="report-grid" id="progression">
              <section className="panel journey">
                <Heading eyebrow="01 / PROGRESSION" title="The player journey">
                  <span className="pill">LIFETIME REACH</span>
                </Heading>
                <p className="section-note">
                  Accounts that have ever reached each milestone. Percentages
                  use {number(launched)} tracked accounts.
                </p>
                <Bars
                  snapshot={snapshot}
                  definitions={group("Progression")}
                  denominator={launched}
                />
                <p className="footnote">
                  A gap shows lower recorded reach, not confirmed abandonment.
                  Players can continue in later sessions.
                </p>
              </section>
              <div className="right-column">
                <section className="panel">
                  <Heading
                    eyebrow="02 / TIME"
                    title="Stayed with the terminal"
                  />
                  <Bars
                    compact
                    snapshot={snapshot}
                    definitions={group("Foreground reach")}
                    denominator={started}
                    suffix="of accounts that started"
                  />
                  <p className="footnote">
                    Share of {number(started)} accounts that started a run.
                    Cumulative foreground time across sessions, not Steam’s
                    playtime histogram.
                  </p>
                </section>
                <section className="panel">
                  <Heading eyebrow="03 / EXPLORATION" title="Beyond the work" />
                  <Bars
                    compact
                    snapshot={snapshot}
                    definitions={group("Exploration")}
                    denominator={started}
                    suffix="of accounts that started"
                  />
                  <p className="footnote">
                    Steam-page clicks can happen before the ending. They do not
                    count wishlists.
                  </p>
                </section>
                <section className="panel depth">
                  <Heading
                    eyebrow="04 / RECOVERY"
                    title="Pieces of the story"
                  />
                  <strong className="depth-number">
                    {number(value(snapshot, "fragments_decoded"))}
                    <span>fragments</span>
                  </strong>
                  <p className="footnote">
                    Sum of each account’s best run: up to 24 distinct fragments
                    each. Replaying a fragment does not increase this total.
                  </p>
                  <div className="time-split">
                    <div>
                      <span>Ordinary work</span>
                      <strong>
                        {duration(value(snapshot, "work_seconds"))}
                      </strong>
                    </div>
                    <div>
                      <span>Clandestine</span>
                      <strong>
                        {duration(value(snapshot, "connection_seconds"))}
                      </strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <section id="pacing" className="panel processing-panel">
              <Heading eyebrow="PACING EXPERIMENT / V1" title="The first complete message" />
              <p className="section-note">
                Accounts whose first tracked run began with the shorter first-message timers.
                Earlier tracked players are excluded. Percentages use {number(value(snapshot, "pacing_v1_started"))} eligible starters.
              </p>
              <Bars
                snapshot={snapshot}
                definitions={group("First-message pacing v1")}
                denominator={value(snapshot, "pacing_v1_started")}
                suffix="of eligible pacing-v1 starters"
              />
              <p className="footnote">
                Distinct fragments from A LIFE WELL SPENT, with reach preserved across sessions and New Game resets.
                These counts do not measure first-session retention. Values stay unknown until Steam reports them.
              </p>
            </section>

            <section id="processing" className="panel processing-panel">
              <Heading
                eyebrow="05 / THE WAIT"
                title="What happens during processing?"
              />
              <div className="processing-grid">
                <div>
                  <h3>From timer to next action</h3>
                  <Bars
                    compact
                    snapshot={snapshot}
                    definitions={group("Processing").slice(0, 3)}
                    denominator={processing}
                    suffix="of accounts that processed"
                  />
                  <div className="exit-note">
                    <strong>
                      {number(value(snapshot, "processing_quit"))}
                    </strong>
                    <p>
                      accounts exited during a timer
                      <br />
                      <span>They may have returned and continued later.</span>
                    </p>
                  </div>
                  <p className="footnote">
                    Lifetime account reach, not individual processing cycles.
                  </p>
                </div>
                <div>
                  <h3>Where waiting time is spent</h3>
                  <div className="waiting-total">
                    {duration(waiting)}
                    <span>measured processing time</span>
                  </div>
                  <div className="stacked-bar" aria-hidden="true">
                    {group("Waiting time").map((s, i) => (
                      <span
                        className={`tone-${i}`}
                        key={s.key}
                        style={{
                          width: `${percent(value(snapshot, s.key), waiting) ?? 0}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="waiting-legend">
                    {group("Waiting time").map((s, i) => (
                      <div key={s.key}>
                        <span className={`swatch tone-${i}`} />
                        <span>{s.label}</span>
                        <strong>{duration(value(snapshot, s.key))}</strong>
                        <span>
                          {percentage(percent(value(snapshot, s.key), waiting))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="footnote">
                    Time buckets do not overlap. Background takes priority over
                    view. Ordinary assignment waits are excluded.
                  </p>
                </div>
              </div>
            </section>

            <section className="panel modes">
              <Heading
                eyebrow="06 / SMALL VIEWS"
                title="Does the idle workflow get discovered?"
              />
              <Bars
                compact
                snapshot={snapshot}
                definitions={group("Modes")}
                denominator={started}
                suffix="of accounts that started"
              />
              <p className="footnote">
                Percentages use accounts that started a run. Mode flags overlap;
                mini is unavailable on some platforms. Background activity alone
                does not establish understanding or frustration.
              </p>
            </section>

            <section id="background" className="panel modes">
              <Heading eyebrow="07 / BACKGROUND PLAY" title="Do players use the tray and notifications?" />
              <Bars compact snapshot={snapshot} definitions={group("Background play")} denominator={started} suffix="of accounts that started" />
              <p className="footnote">
                Unique accounts across sessions, not numbers of clicks. Tray and taskbar use can overlap.
                Notification opens count the alert itself, not returning through the tray icon or taskbar.
                These five measurements begin with the new background-play build; older snapshots show —.
                Exposure and adoption alone do not prove understanding. Compare changes against your release baseline.
              </p>
            </section>

            <section id="data" className="panel data-panel">
              <Heading eyebrow="08 / SOURCE DATA" title="All statistics">
                <span className="pill">{table.length} / {STATS.length}</span>
              </Heading>
              <div className="table-filters">
                <label className="search-label">
                  <span className="sr-only">Search statistics</span>
                  <input
                    type="search"
                    placeholder="Find a stat or API name…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  <span className="sr-only">Stat category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>All stats</option>
                    {[...new Set(STATS.map((s) => s.group))].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Statistic / API name</th>
                      <th>Unit</th>
                      <th className="numeric">Lifetime total</th>
                      {baseline && (
                        <th className="numeric">Change since snapshot</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((s) => {
                      const change = baseline
                        ? delta(snapshot, baseline, s.key)
                        : null;
                      return (
                        <tr key={s.key}>
                          <td>
                            <details>
                              <summary>{s.label}</summary>
                              <p>{s.description}</p>
                            </details>
                            <code>{s.key}</code>
                          </td>
                          <td>{s.unit}</td>
                          <td className="numeric">
                            {number(value(snapshot, s.key))}
                            {value(snapshot, s.key) === null && (
                              <small>Unavailable</small>
                            )}
                          </td>
                          {baseline && (
                            <td
                              className={`numeric ${change < 0 ? "negative" : ""}`}
                            >
                              {change === null
                                ? "—"
                                : `${change > 0 ? "+" : ""}${number(change)}`}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {table.length === 0 && (
                  <p className="no-results">No statistics match your search.</p>
                )}
              </div>
              <p className="footnote">
                CSV downloads this table’s full {STATS.length}-stat snapshot, including
                comparison values when selected. JSON includes all saved
                snapshots and stat definitions. Negative changes are preserved
                for investigation.
              </p>
            </section>
          </>
        )}

        <section id="reading" className="reading">
          <Heading
            eyebrow="FIELD NOTES"
            title="A little context before conclusions."
          />
          <div className="reading-grid">
            <div>
              <h3>Reach, not sessions</h3>
              <p>
                Milestones count Steam accounts once, across sessions and New
                Game resets. Original lifetime totals cannot isolate first-session exits
                or individual journeys. Pacing v1 follows a separately enrolled group.
              </p>
            </div>
            <div>
              <h3>A separate playtime report</h3>
              <p>
                The Steamworks playtime distribution you shared is not part of
                these custom stats. Foreground time here deliberately excludes
                idle background time.
              </p>
            </div>
            <div>
              <h3>Keep a release baseline</h3>
              <p>
                Download a snapshot before deployment and another after the
                playtest. Compare the changes in the table. Test activity stays
                in Steam’s totals; a baseline does not remove later QA activity.
              </p>
            </div>
          </div>
          <p className="reading-source">
            Source:{" "}
            <a
              href="https://partner.steamgames.com/doc/features/achievements#Global_Stats"
              target="_blank"
              rel="noreferrer"
            >
              Steam global stats ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://partner.steamgames.com/doc/webapi/ISteamUserStats#GetGlobalStatsForGame"
              target="_blank"
              rel="noreferrer"
            >
              Web API reference ↗
            </a>
          </p>
        </section>
        <footer>
          <span>NOEMA / DEMO OBSERVATORY</span>
          <span>{STATS.length} signals. One experience to understand.</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
