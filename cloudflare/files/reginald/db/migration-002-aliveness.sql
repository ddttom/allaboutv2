-- REGINALD Aliveness Check Tables
-- Run AFTER schema.sql
-- wrangler d1 execute reginald-auth --remote --file=reginald/db/migration-002-aliveness.sql

CREATE TABLE IF NOT EXISTS aliveness_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publisher_id INTEGER REFERENCES publishers(id),
    cog_namespace TEXT NOT NULL,
    cog_name TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    http_status INTEGER,
    response_time_ms INTEGER,
    hash_match INTEGER,
    error_message TEXT,
    checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS aliveness_failures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cog_namespace TEXT NOT NULL,
    cog_name TEXT NOT NULL,
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    hidden_from_resolution INTEGER NOT NULL DEFAULT 0,
    last_failure_at TEXT,
    last_error TEXT,
    UNIQUE(cog_namespace, cog_name)
);

CREATE INDEX IF NOT EXISTS idx_aliveness_checks_namespace ON aliveness_checks(cog_namespace);
CREATE INDEX IF NOT EXISTS idx_aliveness_checks_checked ON aliveness_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_aliveness_failures_namespace ON aliveness_failures(cog_namespace);
CREATE INDEX IF NOT EXISTS idx_aliveness_failures_hidden ON aliveness_failures(hidden_from_resolution);
