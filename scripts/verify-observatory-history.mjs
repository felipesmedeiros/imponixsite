import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('..', import.meta.url));
const latest = JSON.parse(await readFile(resolve(root, '.observatory-data/latest.json')));
const manifest = JSON.parse(await readFile(resolve(latest.directory, 'manifest.json')));
const sql = await readFile(resolve(latest.directory, 'import.sql'), 'utf8');
const sqlite = new DatabaseSync(':memory:'); sqlite.exec(sql); sqlite.exec(sql);
for (const archive of manifest.archives) {
  const original = await readFile(resolve(latest.directory, archive.name), 'utf8');
  const saved = sqlite.prepare('SELECT body FROM observatory_backups WHERE stream=? AND sha256=?').get(archive.stream, archive.sha256);
  assert.equal(saved.body, original);
  assert.equal(createHash('sha256').update(saved.body).digest('hex'), archive.sha256);
}
for (const stream of manifest.streams) {
  const row = sqlite.prepare('SELECT body FROM observatory_history WHERE stream=?').get(stream.stream);
  const history = JSON.parse(row.body);
  assert.equal(history.snapshots.length, stream.snapshots);
  assert.equal(history.reports?.length || 0, stream.reports);
}
assert.equal(sqlite.prepare('SELECT count(*) AS count FROM observatory_history').get().count, 4);
console.log(`Verified exact bytes for ${manifest.archives.length} original archives, all snapshot counts, and idempotent import. Local source files were not changed.`);
sqlite.close();
