import { readFile, writeFile, mkdir, readdir, copyFile, rm } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sources = JSON.parse(await readFile(resolve(root, 'observatory/sources.json')));
const selected = process.argv[2] || 'all';
if (selected !== 'all' && !sources[selected]) throw new Error('Choose all, gsc, noema or photoncytosis.');
const provenance = JSON.parse(await readFile(resolve(root, 'observatory/provenance.json'), 'utf8').catch(() => '{}'));
async function files(folder) {
  const result = [];
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, item.name);
    if (item.isDirectory()) result.push(...await files(path));
    else if (item.isFile()) result.push(path);
  }
  return result;
}
for (const [slug, config] of Object.entries(sources)) {
  if (selected !== 'all' && slug !== selected) continue;
  const appRoot = resolve(process.env[`OBSERVATORY_${slug.toUpperCase()}_ROOT`] || config.root);
  const pkg = JSON.parse(await readFile(resolve(appRoot, 'package.json')));
  if (pkg.name !== config.package) throw new Error(`Wrong source for ${slug}.`);
  const parent = resolve(root, 'observatory/vendor');
  const target = resolve(parent, slug);
  if (!target.startsWith(parent + sep)) throw new Error('Unsafe vendor path.');
  // Only the generated source copy is replaced. Never traverse or copy .data.
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  const inputs = ['index.html', 'server/steam.mjs', 'server/store.mjs'];
  for (const folder of ['src', 'shared']) {
    inputs.push(...(await files(resolve(appRoot, folder))).map(path => relative(appRoot, path)));
  }
  const hashes = {};
  for (const input of inputs) {
    const bytes = await readFile(resolve(appRoot, input));
    hashes[input.replaceAll('\\', '/')] = createHash('sha256').update(bytes).digest('hex');
    let content = bytes;
    if (/\.(mjs|jsx|css|html|json)$/.test(input)) {
      let source = bytes.toString('utf8');
      for (const [external, local] of Object.entries(config.dependencies)) source = source.replaceAll(external, `../external/${local}`);
      if (input.replaceAll('\\', '/') === 'src/main.jsx') {
        source = source.replaceAll('/api/', `/observatory/${slug}/api/`);
        source = source.replaceAll('Save local report', 'Save report');
        source = source.replaceAll('Save report locally', 'Save report');
        source = source.replaceAll('Report saved locally with its source', 'Report saved with its source');
        source = source.replaceAll('LOCAL RESEARCH TOOL', 'PRIVATE RESEARCH TOOL');
        source = source.replaceAll('LOCAL DASHBOARD', 'PRIVATE DASHBOARD');
        source = source.replaceAll('History saved on this computer', 'History saved in the private database');
        source = source.replaceAll('Stored on this computer', 'Stored in the private database');
        source = source.replaceAll('Local history, manual downloads', 'Private history, manual downloads');
        source = source.replaceAll('Tracking and reporting are ready locally.', 'Tracking and reporting are ready.');
      }
      // Reuse the source validators without changing the source game's files.
      if (slug === 'gsc' && input.replaceAll('\\', '/') === 'server/store.mjs') source += '\nexport { validSnapshot, normalizeLegacySnapshot };\n';
      content = source;
    }
    await mkdir(dirname(resolve(target, input)), { recursive: true });
    await writeFile(resolve(target, input), content);
  }
  for (const [external, local] of Object.entries(config.dependencies)) {
    const bytes = await readFile(resolve(appRoot, 'shared', external));
    hashes[external] = createHash('sha256').update(bytes).digest('hex');
    await mkdir(resolve(target, 'external'), { recursive: true });
    await copyFile(resolve(appRoot, 'shared', external), resolve(target, 'external', local));
  }
  provenance[slug] = { package: pkg.name, files: hashes };
  console.log(`Synchronized ${slug}: ${Object.keys(hashes).length} source files; history excluded.`);
}
await writeFile(resolve(root, 'observatory/provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
