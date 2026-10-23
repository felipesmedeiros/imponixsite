import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { buildDesktopPressKits, pressKitSlugs, readPressKit } from "../scripts/build-desktop-press-kits.mjs";

buildDesktopPressKits();

for (const slug of pressKitSlugs) {
  test(`${slug}: downloadable kit includes original media and correct release facts`, () => {
    const kit = readPressKit(slug);
    const archive = readFileSync(new URL(`../public/games/${slug}/press-kit/${slug}-press-kit-en.zip`, import.meta.url));
    assert.ok(archive.length < 25 * 1024 * 1024);
    const files = unzipSync(archive);
    assert.equal(Object.keys(files).length, kit.assets.length + kit.screenshots.length + 3);
    for (const [folder, assets] of [["branding", kit.assets], ["screenshots", kit.screenshots]]) {
      for (const asset of assets) {
        assert.deepEqual(Buffer.from(files[`${folder}/${basename(asset.src)}`]), readFileSync(new URL(`../public${asset.src}`, import.meta.url)));
      }
    }
    const factsheet = strFromU8(files["factsheet-en.txt"]);
    const expected = slug === "muchi"
      ? ["Release: Q4 2026", "Status: Pre-release", "Pricing: Free to play", "Steam App ID: 5473030"]
      : ["Release: Q1 2027", "Status: Demo available", "Pricing: To be announced", "Steam App ID: 5372120"];
    for (const fact of expected) assert.ok(factsheet.includes(fact), fact);
    assert.ok(factsheet.includes(`Website: ${kit.website}`));
    for (const name of ["factsheet-en.txt", "descriptions-en.txt", "README-en.txt"]) {
      const text = strFromU8(files[name]);
      assert.ok(text.trim());
      assert.ok(!text.includes("\uFFFD"));
      assert.equal(text, readFileSync(new URL(`../public/games/${slug}/press-kit/${name}`, import.meta.url), "utf8"));
    }
    const descriptions = strFromU8(files["descriptions-en.txt"]);
    assert.ok(descriptions.includes(kit.shortDescription));
    for (const paragraph of kit.paragraphs) assert.ok(descriptions.includes(paragraph));
  });
}
