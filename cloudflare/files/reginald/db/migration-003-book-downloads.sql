-- Migration 003: Book download links
-- Adds the download_links table for secure, time-limited, count-limited PDF delivery.
--
-- Apply with:
--   cd allaboutv2/cloudflare/files
--   npx wrangler d1 execute reginald-auth --remote --file=reginald/db/migration-003-book-downloads.sql

CREATE TABLE IF NOT EXISTS download_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_hash TEXT NOT NULL UNIQUE,
    book_id TEXT NOT NULL DEFAULT 'handbook',
    email TEXT,
    name TEXT,
    source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'stripe')),
    stripe_session_id TEXT,
    max_downloads INTEGER NOT NULL DEFAULT 4,
    download_count INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_downloaded_at TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked'))
);

CREATE INDEX IF NOT EXISTS idx_download_links_hash ON download_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_download_links_status ON download_links(status, expires_at);
