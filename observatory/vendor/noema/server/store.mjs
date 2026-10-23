import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { APP_ID, STATS, LEGACY_OPTIONAL_KEYS } from "../shared/stats.mjs";

export async function readSnapshots(directory) {
  try {
    const data = JSON.parse(
      await readFile(join(directory, "snapshots.json"), "utf8"),
    );
    if (
      data.version !== 1 ||
      !Array.isArray(data.snapshots) ||
      !data.snapshots.every(
        (s) =>
          s.appId === APP_ID &&
          typeof s.id === "string" &&
          Number.isFinite(Date.parse(s.fetchedAt)) &&
          Array.isArray(s.missing) &&
          s.totals &&
          STATS.every(
            ({ key }) =>
              s.totals[key] === null ||
              (s.totals[key] === undefined && LEGACY_OPTIONAL_KEYS.has(key)) ||
              (Number.isSafeInteger(s.totals[key]) && s.totals[key] >= 0),
          ),
      )
    )
      throw new Error("Invalid snapshot file");
    return data.snapshots.map(snapshot => {
      const totals = { ...snapshot.totals };
      for (const key of LEGACY_OPTIONAL_KEYS) if (totals[key] === undefined) totals[key] = null;
      return { ...snapshot, totals, missing: STATS.filter(({key}) => totals[key] === null).map(({key}) => key) };
    });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw new Error(
      "Cannot read .data/snapshots.json. The file has been preserved; restore it from a backup before refreshing.",
    );
  }
}

export async function saveSnapshots(directory, snapshots) {
  await mkdir(directory, { recursive: true });
  const temp = join(directory, "snapshots.json.tmp");
  await writeFile(
    temp,
    JSON.stringify({ version: 1, snapshots }, null, 2) + "\n",
    "utf8",
  );
  await rename(temp, join(directory, "snapshots.json"));
}

export function createService(directory, download, cooldown = 60_000) {
  let pending,
    lastAttempt = 0;
  return {
    read: () => readSnapshots(directory),
    refresh() {
      if (pending) return pending;
      pending = (async () => {
        const snapshots = await readSnapshots(directory);
        const latest = snapshots.at(-1);
        if (
          Date.now() - lastAttempt < cooldown ||
          (latest && Date.now() - Date.parse(latest.fetchedAt) < cooldown)
        ) {
          if (latest) return { snapshots, cached: true };
          throw new Error("Please wait one minute before retrying Steam.");
        }
        lastAttempt = Date.now();
        const snapshot = await download();
        await saveSnapshots(directory, [...snapshots, snapshot]);
        return { snapshots: [...snapshots, snapshot], cached: false };
      })().finally(() => {
        pending = null;
      });
      return pending;
    },
  };
}
