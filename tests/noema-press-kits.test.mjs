import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { strFromU8, unzipSync } from "fflate";
import { buildNoemaLocalizedKits, kitDirectory, mediaFiles, renderDocuments } from "../scripts/build-noema-localized-kits.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const locales = JSON.parse(readFileSync(resolve(root, "content/noema/press-kit-locales.json"), "utf8"));
const expectedCodes = ["en", "fr-CA", "pt-BR", "de", "es-419", "zh-Hans", "ja", "it", "ru", "uk", "ko"];
buildNoemaLocalizedKits();

test("all NOEMA languages have complete, unique copy", () => {
  assert.deepEqual(locales.map(({ code }) => code), expectedCodes);
  assert.equal(new Set(locales.map(({ core }) => core)).size, 11);
  for (const locale of locales) {
    for (const value of Object.values(locale).flat()) {
      assert.equal(typeof value, "string");
      assert.ok(value.trim());
      assert.ok(!value.includes("\uFFFD"));
    }
    assert.equal(locale.labels.length, 9);
    assert.equal(locale.values.length, 4);
    assert.equal(locale.headings.length, 6);
    assert.equal(locale.links.length, 4);
  }
});

for (const locale of locales) {
  test(`${locale.code}: complete ZIP, exact UTF-8 copy and identical original images`, () => {
    const zip = readFileSync(resolve(kitDirectory, `noema-press-kit-${locale.code}.zip`));
    assert.ok(zip.length < 25 * 1024 * 1024);
    const contents = unzipSync(zip);
    assert.equal(Object.keys(contents).length, 11);
    for (const [name, copy] of Object.entries(renderDocuments(locale))) assert.equal(strFromU8(contents[name]), copy);
    for (const path of mediaFiles) {
      const name = path.split("/").at(-1);
      assert.deepEqual(Buffer.from(contents[name]), readFileSync(resolve(root, "public/games/noema", path)));
    }
  });
}
