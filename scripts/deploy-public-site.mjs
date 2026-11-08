import { createReadStream, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const repository = "felipesmedeiros/imponixsite";
if (process.env.GITHUB_REPOSITORY !== repository || process.env.GITHUB_REF !== "refs/heads/main") throw Error("Only Imponix main can publish.");
const latest = await fetch(`https://api.github.com/repos/${repository}/git/ref/heads/main`, {
  headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: "application/vnd.github+json" },
  signal: AbortSignal.timeout(15000),
});
if (!latest.ok) throw Error("Cannot verify current main.");
if ((await latest.json()).object.sha !== process.env.GITHUB_SHA) {
  console.log("A newer main revision exists; this deployment was superseded.");
  process.exit(0);
}
const digest = readFileSync("work/imponix-public.tgz.sha256", "utf8").trim();
if (!/^[a-f0-9]{64}$/.test(digest)) throw Error("Invalid artifact digest.");
const oidcUrl = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
if (oidcUrl.protocol !== "https:" || !oidcUrl.hostname.endsWith(".actions.githubusercontent.com")) throw Error("Invalid GitHub identity endpoint.");
oidcUrl.searchParams.set("audience", `imponix-public-vps:${digest}`);
const identity = await fetch(oidcUrl, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` }, signal: AbortSignal.timeout(15000) });
if (!identity.ok) throw Error("Cannot request release identity.");
const { value: token } = await identity.json();
const host = process.env.IMPONIX_VPS_HOST;
if (!/^[a-zA-Z0-9.-]+$/.test(host || "") || !token) throw Error("Deployment configuration is missing.");
const folder = mkdtempSync(join(tmpdir(), "imponix-deploy-"));
try {
  const key = join(folder, "key"), known = join(folder, "known_hosts");
  writeFileSync(key, process.env.IMPONIX_VPS_DEPLOY_KEY + "\n", { mode: 0o600 });
  writeFileSync(known, process.env.IMPONIX_VPS_KNOWN_HOSTS + "\n", { mode: 0o600 });
  const child = spawn("ssh", ["-T", "-o", "BatchMode=yes", "-o", "IdentitiesOnly=yes", "-o", "StrictHostKeyChecking=yes", "-o", "ConnectTimeout=15", "-o", `UserKnownHostsFile=${known}`, "-i", key, `imponix_deploy@${host}`, "publish"], { stdio: ["pipe", "inherit", "inherit"] });
  child.stdin.on("error", () => {});
  child.stdin.write(JSON.stringify({ commit: process.env.GITHUB_SHA, sha256: digest, token }) + "\n");
  const input = createReadStream("work/imponix-public.tgz");
  input.on("error", () => child.kill());
  input.pipe(child.stdin);
  const code = await new Promise((accept, reject) => { child.once("error", reject); child.once("close", accept); });
  if (code !== 0) throw Error(`VPS refused publication (exit ${code}).`);
} finally {
  rmSync(folder, { recursive: true, force: true });
}
