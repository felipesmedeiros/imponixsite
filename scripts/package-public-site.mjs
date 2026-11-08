import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve, relative } from "node:path";
import { verifyPublicSite, walk } from "./verify-public-site.mjs";

verifyPublicSite();
const commit = process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw Error("A full source commit is required.");
const staging = resolve("work", `public-release-${commit}-${Date.now()}`);
const site = resolve(staging, "site");
mkdirSync(staging, { recursive: true });
cpSync(resolve("dist/client"), site, { recursive: true, filter: path => !/[\\/]\.vite(?:[\\/]|$)/.test(path) });
writeFileSync(resolve(site, "version.json"), JSON.stringify({ commit }) + "\n");
const files = Object.fromEntries(walk(site).map(path => {
  const bytes = readFileSync(path);
  return [relative(site, path).replaceAll("\\", "/"), { size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") }];
}));
writeFileSync(resolve(staging, "release.json"), JSON.stringify({ version: 1, commit, files }) + "\n");
const archive = resolve("work", "imponix-public.tgz");
if (existsSync(archive)) throw Error("Release archive already exists; preserve or remove it explicitly before packaging again.");
execFileSync("tar", ["-czf", archive, "-C", staging, "site", "release.json"], { stdio: "inherit" });
writeFileSync(archive + ".sha256", createHash("sha256").update(readFileSync(archive)).digest("hex") + "\n");
console.log(`Packaged public release ${commit} (${Object.keys(files).length} files).`);
