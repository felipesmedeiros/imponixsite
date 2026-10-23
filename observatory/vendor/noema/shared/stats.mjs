export const APP_ID = 5254450;
export const SOURCE =
  "https://api.steampowered.com/ISteamUserStats/GetGlobalStatsForGame/v1/";

const account = (key, label, group, description) => ({
  key: `stat_demo_${key}`,
  label,
  group,
  unit: "accounts",
  description,
});
const counter = (key, label, group, unit, description) => ({
  key: `stat_demo_${key}`,
  label,
  group,
  unit,
  description,
});

export const STATS = [
  account(
    "launched",
    "Launched demo",
    "Progression",
    "Accounts that launched a build with telemetry enabled.",
  ),
  account(
    "started",
    "Started a run",
    "Progression",
    "Began a New Game or loaded an existing run.",
  ),
  account(
    "assignment_1",
    "Assignment 1 complete",
    "Progression",
    "First ordinary assignment accepted.",
  ),
  account(
    "assignment_2",
    "Assignment 2 complete",
    "Progression",
    "Second ordinary assignment accepted.",
  ),
  account(
    "signal_offered",
    "First signal offered",
    "Progression",
    "First clandestine signal appeared.",
  ),
  account(
    "signal_accepted",
    "Signal accepted",
    "Progression",
    "Accepted a clandestine signal.",
  ),
  account(
    "first_tone",
    "First correct tone",
    "Progression",
    "Entered a correct tone in a decoding field.",
  ),
  account(
    "first_fragment",
    "First fragment decoded",
    "Progression",
    "Decoded at least one story fragment.",
  ),
  account(
    "message_1",
    "Message 1 complete",
    "Progression",
    "Recovered all pieces of A LIFE WELL SPENT.",
  ),
  account(
    "message_2",
    "Message 2 complete",
    "Progression",
    "Recovered all pieces of After hours.",
  ),
  account(
    "message_3",
    "Message 3 complete",
    "Progression",
    "Recovered all pieces of Other operators.",
  ),
  account(
    "ending_reached",
    "Demo completed",
    "Progression",
    "Completed the ending challenge.",
  ),
  account(
    "archive_opened",
    "Opened Archive",
    "Exploration",
    "Opened Archive during a run.",
  ),
  account(
    "messages_opened",
    "Opened Messages",
    "Exploration",
    "Opened Messages during a run.",
  ),
  account(
    "store_opened",
    "Opened Steam page",
    "Exploration",
    "Clicked either in-game store link. This does not measure wishlists and is not conditional on finishing the demo.",
  ),
  account(
    "foreground_2m",
    "2 minutes",
    "Foreground reach",
    "Reached 2 cumulative foreground minutes across sessions.",
  ),
  account(
    "foreground_5m",
    "5 minutes",
    "Foreground reach",
    "Reached 5 cumulative foreground minutes across sessions.",
  ),
  account(
    "foreground_10m",
    "10 minutes",
    "Foreground reach",
    "Reached 10 cumulative foreground minutes across sessions.",
  ),
  counter(
    "fragments_decoded",
    "Fragments recovered",
    "Depth & time",
    "fragments",
    "Sum of each account’s highest distinct fragment count in one run (up to 24 per account); not the total number of decoding actions.",
  ),
  counter(
    "foreground_seconds",
    "Foreground play",
    "Depth & time",
    "seconds",
    "Cumulative focused, visible active-run seconds. Excludes title, F9, minimized, suspended and closed time.",
  ),
  counter(
    "work_seconds",
    "Ordinary work",
    "Depth & time",
    "seconds",
    "Foreground seconds on the ordinary-work side.",
  ),
  counter(
    "connection_seconds",
    "Clandestine workspace",
    "Depth & time",
    "seconds",
    "Foreground seconds in the clandestine workspace.",
  ),
  account(
    "compact_used",
    "Used compact",
    "Modes",
    "Used compact or hosted monitor view during an active run. Mini is separate.",
  ),
  account(
    "mini_used",
    "Used mini",
    "Modes",
    "Used mini view, including restoring a saved view. Mini is unavailable on some platforms.",
  ),
  account(
    "processing_started",
    "Processing started",
    "Processing",
    "Observed a story decoding timer or its ready result.",
  ),
  account(
    "processing_ready",
    "Result ready",
    "Processing",
    "A story decoding timer finished, including recovery or acting on a saved result.",
  ),
  account(
    "processing_continued",
    "Retained or transmitted",
    "Processing",
    "Successfully retained or transmitted a ready result.",
  ),
  account(
    "processing_quit",
    "Exited during processing",
    "Processing",
    "Closed normally with a story timer active. Includes players who later return; excludes crashes and forced exits.",
  ),
  account(
    "processing_compact",
    "Processed in compact",
    "Modes",
    "Story timer active with compact selected, focused or not.",
  ),
  account(
    "processing_mini",
    "Processed in mini",
    "Modes",
    "Story timer active with mini selected, focused or not.",
  ),
  account(
    "processing_background",
    "Processed in background",
    "Modes",
    "Story timer active while unfocused or minimized.",
  ),
  counter(
    "processing_main_seconds",
    "Main terminal",
    "Waiting time",
    "seconds",
    "Story processing seconds focused in the full terminal, including ordinary work while decoding continues.",
  ),
  counter(
    "processing_compact_seconds",
    "Compact",
    "Waiting time",
    "seconds",
    "Story processing seconds focused in compact or hosted monitor view.",
  ),
  counter(
    "processing_mini_seconds",
    "Mini",
    "Waiting time",
    "seconds",
    "Story processing seconds focused in mini view.",
  ),
  counter(
    "processing_background_seconds",
    "Background",
    "Waiting time",
    "seconds",
    "Story processing seconds unfocused or minimized. Takes priority over selected view; buckets do not overlap.",
  ),
  account("background_help_seen", "Saw background explanation", "Background play", "Accounts shown either background onboarding prompt or its Menu help. New measurements begin with the tray/notification build."),
  account("background_chosen", "Chose background play", "Background play", "Clicked Continue in background, or Open monitor on platforms without desktop notifications. Counts players, not clicks."),
  account("tray_used", "Minimized to tray", "Background play", "Actually minimized an active run through NOEMA's controls with a tray icon available. Selecting the setting alone does not count."),
  account("taskbar_used", "Minimized to taskbar", "Background play", "Actually minimized an active run through NOEMA's controls without hiding to tray. Selecting the setting alone does not count."),
  account("notification_opened", "Opened ready notification", "Background play", "Activated the ready toast or native notification. Tray icon, taskbar and ordinary focus returns do not count."),
  account("pacing_v1_started", "Started a run", "First-message pacing v1", "Accounts whose first tracked run began on the revised pacing build, after checking local and Steam history. Denominator for this separate funnel; earlier tracked players are excluded."),
  account("pacing_v1_fragment_1", "First fragment recovered", "First-message pacing v1", "Eligible revised-pacing accounts that recovered at least one distinct fragment of A LIFE WELL SPENT."),
  account("pacing_v1_fragment_3", "Three fragments recovered", "First-message pacing v1", "Eligible revised-pacing accounts that recovered at least three distinct fragments of A LIFE WELL SPENT in one run."),
  account("pacing_v1_fragment_5", "Five fragments recovered", "First-message pacing v1", "Eligible revised-pacing accounts that recovered at least five distinct fragments of A LIFE WELL SPENT in one run."),
  account("pacing_v1_message_1", "First message complete", "First-message pacing v1", "Eligible revised-pacing accounts that recovered every fragment of A LIFE WELL SPENT. Lifetime account reach, including later sessions; not first-session retention."),
];

// These keys did not exist in saved snapshots from the original 35-stat catalog.
export const BACKGROUND_KEYS = new Set(STATS.filter(s => s.group === "Background play").map(s => s.key));
export const PACING_KEYS = new Set(STATS.filter(s => s.group === "First-message pacing v1").map(s => s.key));
export const LEGACY_OPTIONAL_KEYS = new Set([...BACKGROUND_KEYS, ...PACING_KEYS]);

export const stat = (key) => STATS.find((s) => s.key === `stat_demo_${key}`);
export const group = (name) => STATS.filter((s) => s.group === name);
export const value = (snapshot, key) =>
  snapshot?.totals?.[key.startsWith("stat_demo_") ? key : `stat_demo_${key}`] ??
  null;
export function snapshotsWithChanges(snapshots) {
  return snapshots.filter(
    (snapshot, index) =>
      index === 0 ||
      STATS.some(
        ({ key }) => value(snapshot, key) !== value(snapshots[index - 1], key),
      ),
  );
}
export const percent = (part, total) =>
  part === null || total === null || total <= 0 ? null : (part / total) * 100;
export const delta = (current, previous, key) => {
  const a = value(current, key),
    b = value(previous, key);
  return a === null || b === null ? null : a - b;
};
export function sum(snapshot, definitions) {
  const values = definitions.map((s) => value(snapshot, s.key));
  if (values.some((v) => v === null)) return null;
  const total = values.reduce((a, b) => a + b, 0);
  return Number.isSafeInteger(total) ? total : null;
}

export function consistencyWarnings(snapshot) {
  if (!snapshot) return [];
  const warnings = [];
  const chains = [
    group("Progression"),
    [stat("started"), ...group("Foreground reach")],
    group("Processing").slice(0, 3),
    group("First-message pacing v1"),
  ];
  for (const chain of chains)
    for (let i = 1; i < chain.length; i++) {
      const before = value(snapshot, chain[i - 1].key),
        after = value(snapshot, chain[i].key);
      if (before !== null && after !== null && after > before)
        warnings.push(
          `${chain[i].label} exceeds ${chain[i - 1].label}. Treat this comparison as incomplete until Steam totals agree.`,
        );
    }
  return warnings;
}

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export function toCsv(snapshot, baseline = null) {
  const rows = [
    [
      "app_id",
      "fetched_at_utc",
      "stat",
      "label",
      "unit",
      "total",
      "baseline_fetched_at_utc",
      "change",
      "description",
    ],
  ];
  for (const s of STATS)
    rows.push([
      APP_ID,
      snapshot.fetchedAt,
      s.key,
      s.label,
      s.unit,
      value(snapshot, s.key),
      baseline?.fetchedAt,
      baseline ? delta(snapshot, baseline, s.key) : null,
      s.description,
    ]);
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
