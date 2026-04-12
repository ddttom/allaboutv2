-- Migration 005: AI traffic attribution
-- Captures AI crawler hits and AI-referred human clicks so we can query
-- which AI surfaces are sending traffic to our domains. Two event types:
--   crawler  — AI User-Agent matched (GPTBot, ClaudeBot, PerplexityBot, ...)
--   referral — human visit whose Referer points at an AI surface
--              (chat.openai.com, perplexity.ai, gemini.google.com, ...)
--
-- Apply with:
--   cd allaboutv2/cloudflare/files
--   npx wrangler d1 execute reginald-auth --remote --file=reginald/db/migration-005-ai-visits.sql

CREATE TABLE IF NOT EXISTS ai_visits (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER NOT NULL,
    hostname    TEXT NOT NULL,
    path        TEXT NOT NULL,
    event_type  TEXT NOT NULL CHECK (event_type IN ('crawler', 'referral')),
    agent_key   TEXT NOT NULL,
    ua          TEXT,
    referer     TEXT,
    country     TEXT,
    status      INTEGER,
    backfilled  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ai_visits_host_ts ON ai_visits(hostname, ts);
CREATE INDEX IF NOT EXISTS idx_ai_visits_agent_ts ON ai_visits(agent_key, ts);
CREATE INDEX IF NOT EXISTS idx_ai_visits_event_ts ON ai_visits(event_type, ts);
