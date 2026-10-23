import { randomUUID } from "node:crypto";
import { APP_ID, SOURCE, STATS } from "../shared/stats.mjs";

export function normalizeResponse(body, fetchedAt = new Date().toISOString()) {
  if (
    body?.response?.result !== 1 ||
    !body.response.globalstats ||
    typeof body.response.globalstats !== "object"
  ) {
    throw new Error(
      "Steam did not return a successful global-stats response. Previous snapshots were kept.",
    );
  }
  const totals = {},
    missing = [];
  for (const { key } of STATS) {
    const raw = body.response.globalstats[key]?.total;
    const valid =
      (typeof raw === "string" && /^\d+$/.test(raw)) ||
      (typeof raw === "number" && Number.isSafeInteger(raw) && raw >= 0);
    const number = valid ? Number(raw) : NaN;
    totals[key] = Number.isSafeInteger(number) && number >= 0 ? number : null;
    if (totals[key] === null) missing.push(key);
  }
  if (missing.length === STATS.length)
    throw new Error(
      `Steam returned none of the ${STATS.length} expected stats. Check that the demo stats are published and aggregated.`,
    );
  return {
    id: randomUUID(),
    appId: APP_ID,
    fetchedAt,
    source: SOURCE,
    totals,
    missing,
  };
}

export async function downloadStats(fetchImpl = fetch) {
  const url = new URL(SOURCE);
  url.searchParams.set("appid", String(APP_ID));
  url.searchParams.set("count", String(STATS.length));
  STATS.forEach((s, i) => url.searchParams.set(`name[${i}]`, s.key));
  let response;
  try {
    response = await fetchImpl(url, {
      signal: AbortSignal.timeout(20_000),
      redirect: "error",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error(
      "Could not reach Steam within 20 seconds. Check your connection and try again. Previous snapshots were kept.",
    );
  }
  if (!response.ok)
    throw new Error(
      `Steam returned HTTP ${response.status}. Try again later; previous snapshots were kept.`,
    );
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      "Steam returned unreadable data. Previous snapshots were kept.",
    );
  }
  return normalizeResponse(body);
}
