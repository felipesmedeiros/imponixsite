import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

const root = fileURLToPath(new URL("../", import.meta.url));
export const pressKitSlugs = ["muchi", "photoncytosis"];

export function readPressKit(slug) {
  return JSON.parse(readFileSync(resolve(root, `content/${slug}/press-kit.json`), "utf8"));
}

export function renderPressDocuments(kit) {
  const links = [
    `Press kit: https://imponix.com/games/${kit.slug}/press-kit`,
    `Website: ${kit.website}`,
    `Steam: ${kit.steam}`,
    ...(kit.trailer ? [`Trailer: ${kit.trailer}`] : []),
    "Press contact: contact@imponix.com",
  ].join("\n");
  return {
    "factsheet-en.txt": `${kit.name} — Factsheet (English)\n\n${kit.facts.map(([term, value]) => `${term}: ${value}`).join("\n")}\n\nRelease windows refer to the planned full-game release.\n\n${links}\n`,
    "descriptions-en.txt": `${kit.name} — Descriptions (English)\n\n${kit.tagline}\n\nShort description\n\n${kit.shortDescription}\n\nFull description\n\n${kit.paragraphs.join("\n\n")}\n\nHighlights\n\n${kit.highlights.map(({ title, text }) => `${title}\n${text}`).join("\n\n")}\n`,
    "README-en.txt": `${kit.name} — Official press materials\n\nEnglish factsheet and descriptions, plus original logos, key art, and development screenshots.\n\nUse these assets for editorial coverage, videos, and creator features. Please preserve logo proportions and colors. Screenshots show development gameplay; the final game may look different.\n\nImponix is a two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil.\n\n${links}\n`,
  };
}

export function buildDesktopPressKits() {
  const mtime = new Date("2026-01-01T00:00:00Z");
  for (const slug of pressKitSlugs) {
    const kit = readPressKit(slug);
    const output = resolve(root, `public/games/${slug}/press-kit`);
    mkdirSync(output, { recursive: true });
    const entries = {};
    for (const [name, text] of Object.entries(renderPressDocuments(kit))) {
      writeFileSync(resolve(output, name), text, "utf8");
      entries[name] = [strToU8(text), { level: 6, mtime }];
    }
    for (const [folder, assets] of [["branding", kit.assets], ["screenshots", kit.screenshots]]) {
      for (const asset of assets) {
        const source = readFileSync(resolve(root, "public", asset.src.slice(1)));
        entries[`${folder}/${basename(asset.src)}`] = [source, { level: 0, mtime }];
      }
    }
    const archive = zipSync(entries);
    if (archive.length >= 25 * 1024 * 1024) throw new Error(`${slug} press kit exceeds 25 MiB`);
    writeFileSync(resolve(output, `${slug}-press-kit-en.zip`), archive);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildDesktopPressKits();
