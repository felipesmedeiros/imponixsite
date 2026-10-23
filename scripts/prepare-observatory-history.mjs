import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { allCatalogs, validateHistory } from '../observatory/catalogs.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const sources = JSON.parse(await readFile(resolve(root, 'observatory/sources.json')));
const dir = resolve(root, '.observatory-data', new Date().toISOString().replaceAll(':', '-'));
await mkdir(dir, { recursive: true });
const quote = s => "'" + String(s).replaceAll("'", "''") + "'";
const sql = [await readFile(resolve(root, 'observatory/schema.sql'), 'utf8')];
const manifest = { createdAt: new Date().toISOString(), streams: [], archives: [] };
for (const catalog of allCatalogs()) {
  const appRoot = resolve(process.env[`OBSERVATORY_${catalog.slug.toUpperCase()}_ROOT`] || sources[catalog.slug].root);
  const subdir = catalog.slug === 'photoncytosis' ? catalog.stream.endsWith('-demo') ? 'demo/' : 'full/' : '';
  const filename = catalog.slug === 'noema' ? 'snapshots.json' : 'history.json';
  const path = resolve(appRoot, '.data', subdir, filename);
  let body;
  try { body = await readFile(path, 'utf8'); }
  catch (error) {
    if (error.code !== 'ENOENT' || catalog.stream !== 'photoncytosis-full') throw error;
    body = JSON.stringify({ version: 1, appId: catalog.appId, snapshots: [], reports: [] });
  }
  const history = validateHistory(JSON.parse(body), catalog);
  manifest.streams.push({ stream: catalog.stream, appId: catalog.appId, snapshots: history.snapshots.length, reports: history.reports?.length || 0 });
  const archives = [{ name: 'current', body, path }];
  if (catalog.slug !== 'noema') {
    const backupPath = resolve(appRoot, '.data', subdir, 'history.backup.json');
    try { archives.push({ name: 'backup', body: await readFile(backupPath, 'utf8'), path: backupPath }); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  for (const archive of archives) {
    const sha256 = createHash('sha256').update(archive.body).digest('hex');
    const id = `local:${catalog.stream}:${archive.name}:${sha256}`;
    const name = `${catalog.stream}.${archive.name}.json`;
    await writeFile(resolve(dir, name), archive.body, 'utf8');
    manifest.archives.push({ stream: catalog.stream, name, source: archive.path, sha256 });
    // Keep statements small, including the larger GSC history. Assemble in D1.
    for (let i = 0; i < archive.body.length; i += 12000) sql.push(`INSERT OR IGNORE INTO observatory_import_parts (archive_id,part,body) VALUES (${quote(id)},${i / 12000},${quote(archive.body.slice(i,i+12000))});`);
    const assembled = `(SELECT group_concat(body,'') FROM (SELECT body FROM observatory_import_parts WHERE archive_id=${quote(id)} ORDER BY part))`;
    sql.push(`INSERT OR IGNORE INTO observatory_backups (id,stream,source,sha256,body,saved_at) VALUES (${quote(id)},${quote(catalog.stream)},${quote(`local-${archive.name}`)},${quote(sha256)},${assembled},${quote(manifest.createdAt)});`);
    if (archive.name === 'current') sql.push(`INSERT OR IGNORE INTO observatory_history (stream,app_id,body) VALUES (${quote(catalog.stream)},${catalog.appId},${assembled});`);
  }
}
await writeFile(resolve(dir, 'import.sql'), sql.join('\n') + '\n');
await writeFile(resolve(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(resolve(root, '.observatory-data/latest.json'), JSON.stringify({ directory: dir }) + '\n');
console.log(JSON.stringify({ directory: dir, streams: manifest.streams, preservedArchives: manifest.archives.length }, null, 2));
