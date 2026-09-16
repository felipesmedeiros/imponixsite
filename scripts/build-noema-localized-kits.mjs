import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourcePath = resolve(root, "content/noema/press-kit-locales.json");
const assetRoot = resolve(root, "public/games/noema");
export const kitDirectory = resolve(assetRoot, "press-kits");
export const mediaFiles = [
  "library-logo.png", "icon.png", "main-capsule.png",
  "press/01-record-reconciliation.png", "press/02-signal-terminal.png",
  "press/03-encoded-message.png", "press/04-package-archive.png",
  "press/05-signal-interference.png",
];

export function renderDocuments(locale) {
  const [facts, descriptions, short, full, materials, studio] = locale.headings;
  const [release, genre, players, price] = locale.values;
  const values = ["NOEMA", "Imponix Game Studio", "Imponix Game Studio", release, "Windows · Linux", genre, players, price, "5253880"];
  const links = [
    `${locale.links[0]}: https://imponix.com/games/noema/press-kit`,
    "Steam: https://store.steampowered.com/app/5253880/NOEMA/",
    `${locale.links[1]}: https://www.youtube.com/watch?v=N-IJlV005Vc`,
    `${locale.links[2]}: https://imponix.com/games/noema`,
    `${locale.links[3]}: contact@imponix.com`,
  ].join("\n");
  return {
    "NOEMA-factsheet.txt": `NOEMA — ${facts}\n${locale.name}\n\n${locale.labels.map((label, i) => `${label}: ${values[i]}`).join("\n")}\n\n${links}\n`,
    "NOEMA-descriptions.txt": `NOEMA — ${descriptions}\n${locale.name}\n\n${short}\n\n${locale.core} ${locale.short}\n\n${full}\n\n${locale.tagline}\n\n${locale.core} ${locale.system}\n\n${locale.routine}\n\n${locale.ending}\n`,
    "README.txt": `NOEMA — ${materials}\n${locale.name}\n\n${locale.contents}\n\n${mediaFiles.map((path) => basename(path)).join("\n")}\n\n${locale.usage}\n\n${studio}\n\n${locale.studio}\n\n${links}\n`,
  };
}

export function buildNoemaLocalizedKits() {
  const source = readFileSync(sourcePath);
  const locales = JSON.parse(source);
  const media = mediaFiles.map((path) => [basename(path), readFileSync(resolve(assetRoot, path))]);
  const digest = createHash("sha256").update(source).update(readFileSync(fileURLToPath(import.meta.url)));
  for (const [name, bytes] of media) digest.update(name).update(bytes);
  const hash = digest.digest("hex");
  const cacheDirectory = resolve(root, "node_modules/.cache/noema-press-kits");
  const cachePath = resolve(cacheDirectory, "source.sha256");
  const outputs = locales.map(({ code }) => resolve(kitDirectory, `noema-press-kit-${code}.zip`));
  if (existsSync(cachePath) && readFileSync(cachePath, "utf8") === hash && outputs.every(existsSync)) return;
  mkdirSync(kitDirectory, { recursive: true });
  const mtime = new Date(2026, 0, 1);
  for (const locale of locales) {
    if (!/^[a-z]{2}(?:-[A-Za-z0-9]+)?$/.test(locale.code)) throw new Error("Invalid press-kit locale");
    const documents = renderDocuments(locale);
    const entries = Object.fromEntries(media.map(([name, bytes]) => [name, [bytes, { level: 0, mtime }]]));
    for (const [name, text] of Object.entries(documents)) entries[name] = [strToU8(text), { level: 6, mtime }];
    const archive = zipSync(entries);
    if (archive.length >= 25 * 1024 * 1024) throw new Error(`${locale.code} press kit exceeds 25 MiB`);
    writeFileSync(resolve(kitDirectory, `noema-press-kit-${locale.code}.zip`), archive);
  }
  mkdirSync(cacheDirectory, { recursive: true });
  writeFileSync(cachePath, hash);
  console.log(`Prepared ${locales.length} localized NOEMA press kits.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildNoemaLocalizedKits();
