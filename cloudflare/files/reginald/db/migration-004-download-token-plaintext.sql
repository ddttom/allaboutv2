-- Migration 004: Add download_token plaintext column to download_links.
-- Allows the post-checkout polling endpoint to retrieve the download URL
-- by stripe_session_id without needing to round-trip through Stripe Customer
-- metadata. The token_hash column remains the canonical lookup for the
-- download landing page itself; this column is purely for the success-page
-- polling flow and can be cleared once MailerLite delivery is wired up.
--
-- Apply with:
--   cd allaboutv2/cloudflare/files
--   npx wrangler d1 execute reginald-auth --remote --file=reginald/db/migration-004-download-token-plaintext.sql

ALTER TABLE download_links ADD COLUMN download_token TEXT;

CREATE INDEX IF NOT EXISTS idx_download_links_session ON download_links(stripe_session_id);
