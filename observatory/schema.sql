CREATE TABLE IF NOT EXISTS observatory_history (
  stream TEXT PRIMARY KEY,
  app_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  last_attempt INTEGER NOT NULL DEFAULT 0,
  lease TEXT,
  lease_until INTEGER NOT NULL DEFAULT 0,
  job TEXT
);
CREATE TABLE IF NOT EXISTS observatory_backups (
  id TEXT PRIMARY KEY,
  stream TEXT NOT NULL,
  source TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  body TEXT NOT NULL,
  saved_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS observatory_backups_stream ON observatory_backups(stream);
CREATE TABLE IF NOT EXISTS observatory_import_parts (
  archive_id TEXT NOT NULL,
  part INTEGER NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (archive_id, part)
);
