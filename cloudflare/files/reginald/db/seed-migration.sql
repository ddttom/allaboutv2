-- MX-Reginald Migration: Seed existing publishers
-- Run AFTER schema.sql, BEFORE generating tokens with migrate.js
--
-- cognovamx: operator's own namespace — permanent free subscription
-- agentica: first external publisher — permanent free subscription

-- Publisher: cognovamx (CogNovaMX Ltd — operator)
INSERT OR IGNORE INTO publishers (namespace, name, domain, email, status, migrated_from)
VALUES ('cognovamx', 'CogNovaMX Ltd', 'allabout.network', 'tom.cranstoun@gmail.com', 'active', 'pre-auth-migration');

-- Publisher: agentica (first external publisher)
INSERT OR IGNORE INTO publishers (namespace, name, domain, email, status, migrated_from)
VALUES ('agentica', 'Agentica', 'agentica.co.uk', NULL, 'active', 'pre-auth-migration');

-- Subscription: cognovamx — permanent free (expires 2099-12-31)
INSERT OR IGNORE INTO subscriptions (publisher_id, stripe_customer_id, stripe_subscription_id, status, current_period_start, current_period_end)
SELECT id, 'migrated_free_permanent', 'migrated_free_permanent',
       'active', datetime('now'), '2099-12-31T23:59:59Z'
FROM publishers WHERE namespace = 'cognovamx';

-- Subscription: agentica — permanent free (expires 2099-12-31)
INSERT OR IGNORE INTO subscriptions (publisher_id, stripe_customer_id, stripe_subscription_id, status, current_period_start, current_period_end)
SELECT id, 'migrated_free_permanent', 'migrated_free_permanent',
       'active', datetime('now'), '2099-12-31T23:59:59Z'
FROM publishers WHERE namespace = 'agentica';

-- Audit log entries
INSERT INTO audit_log (publisher_id, action, detail)
SELECT id, 'migration', '{"reason":"pre-auth publisher, permanent free subscription"}'
FROM publishers WHERE namespace = 'cognovamx';

INSERT INTO audit_log (publisher_id, action, detail)
SELECT id, 'migration', '{"reason":"first external publisher, permanent free subscription"}'
FROM publishers WHERE namespace = 'agentica';
