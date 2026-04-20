-- Migration 007: seed the ga4_connectors row for mx.allabout.network
-- Creates the row in a disabled state with placeholder credentials so
-- the hourly AI-attribution → GA4 forwarder has something to find.
-- Once Tom provisions the GA4 property and hands over the real
-- measurement_id + API secret, enable the connector with:
--
--   npx wrangler d1 execute reginald-auth --remote --command "\
--     UPDATE ga4_connectors \
--     SET measurement_id = 'G-XXXXXXX', \
--         api_secret = '<real-secret>', \
--         enabled = 1, \
--         last_run_status = NULL, \
--         last_run_detail = NULL \
--     WHERE hostname = 'mx.allabout.network';"
--
-- The NOT NULL constraints on migration 006 force us to ship placeholder
-- values at seed time; `enabled = 0` keeps the hourly forwarder from
-- trying to POST to a non-existent GA4 endpoint until the real creds
-- are in place.
--
-- Apply with:
--   cd allaboutv2/cloudflare/files
--   npx wrangler d1 execute reginald-auth --remote \
--     --file=reginald/db/migration-007-ga4-connector-mx.sql

INSERT INTO ga4_connectors
    (hostname, measurement_id, api_secret, enabled)
VALUES
    ('mx.allabout.network', 'PENDING', 'PENDING', 0)
ON CONFLICT(hostname) DO NOTHING;
