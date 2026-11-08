import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist/client");
export function walk(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(folder, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Unexpected symbolic link: ${path}`);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

export function verifyPublicSite() {
  const pages = walk(resolve(root, "app")).filter(file => /[\\/]page\.tsx$/.test(file));
  for (const page of pages) {
    const route = relative(resolve(root, "app"), page).replaceAll("\\", "/").replace(/(?:^|\/)page\.tsx$/, "");
    const html = readFileSync(resolve(output, route ? `${route}.html` : "index.html"), "utf8");
    assert.match(html, /<title>[^<]+<\/title>/, `Missing title for /${route}`);
    assert.match(html, /googletagmanager\.com/, `Missing analytics for /${route}`);
    assert.doesNotMatch(html, /codex-preview|http:\/\/(?:localhost|127\.0\.0\.1)|\/_vinext\/image\?/, `Non-static output for /${route}`);
    assert.ok(existsSync(resolve(output, route ? `${route}.rsc` : "index.rsc")), `Missing navigation payload for /${route}`);
  }
  for (const slug of ["noema-photoncytosis-demo-update", "photoncytosis-demo-muchi-2026"]) {
    const html = readFileSync(resolve(output, `journal/${slug}.html`), "utf8");
    for (const name of ["og:image", "twitter:image"]) {
      assert.match(html, new RegExp(`<meta (?:property|name)="${name}" content="https://imponix\\.com/journal/${slug}-og\\.png"`));
    }
  }
  for (const path of ["404.html", "robots.txt", "sitemap.xml", "games/noema/press-kits/noema-press-kit-en.zip", "games/muchi/press-kit/muchi-press-kit-en.zip", "games/photoncytosis/press-kit/photoncytosis-press-kit-en.zip"]) {
    assert.ok(existsSync(resolve(output, path)), `Missing public file: ${path}`);
  }
  const files = walk(output);
  for (const path of files) {
    const name = relative(output, path).replaceAll("\\", "/");
    assert.doesNotMatch(name, /(?:^|\/)(?:observatory|\.env[^/]*|\.git|\.wrangler|\.observatory-data)(?:\/|$)|\.map$/i, `Private/build file in public artifact: ${name}`);
  }
  console.log(`Verified ${pages.length} exported pages, navigation payloads, analytics, social images and press kits; ${files.length} public files.`);
  return { pages: pages.length, files: files.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) verifyPublicSite();
