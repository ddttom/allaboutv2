-- Migration 006: AI Attribution billing + GA4 connector config
-- Adds tables for the productisation layer:
--   ai_attribution_usage — per-query counter for rate-limiting paid publishers
--   ga4_connectors       — per-hostname GA4 Measurement Protocol config
--
-- Apply with:
--   cd allaboutv2/cloudflare/files
--   npx wrangler d1 execute reginald-auth --remote --file=reginald/db/migration-006-ai-attribution-billing.sql

CREATE TABLE IF NOT EXISTS ai_attribution_usage (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    publisher_id   INTEGER,
    hostname       TEXT NOT NULL,
    queried_at     INTEGER NOT NULL,
    http_status    INTEGER,
    ip_hash        TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_attr_usage_pub_ts
    ON ai_attribution_usage(publisher_id, queried_at);

CREATE INDEX IF NOT EXISTS idx_ai_attr_usage_host_ts
    ON ai_attribution_usage(hostname, queried_at);

CREATE TABLE IF NOT EXISTS ga4_connectors (
    hostname         TEXT PRIMARY KEY,
    measurement_id   TEXT NOT NULL,
    api_secret       TEXT NOT NULL,
    enabled          INTEGER NOT NULL DEFAULT 1,
    last_run_at      INTEGER,
    last_run_status  TEXT,
    last_run_detail  TEXT,
    created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
);
