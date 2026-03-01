---
title: "Test Automation Backups"
description: "Directory for timestamped backups created by the Cloudflare Worker test automation system"
author: Tom Cranstoun
created: 2025-12-12
modified: 2026-02-09
version: "1.0"
status: active
---

# Test Automation Backups

This directory contains timestamped backups created by the Cloudflare Worker test automation system.

## What Gets Backed Up

When `cloudflare-worker.js` is edited, the automation system creates backups of:

- `test.html` - Browser-based test page
- `test-local-html.js` - Local HTML processing test script
- `cloudflare-worker.test.js` - Unit/integration test suite

## Backup Naming

Backups follow this naming pattern:

```
{original-filename}.backup-{ISO-timestamp}
```

**Examples:**

```
test.html.backup-2025-12-12T20-27-11
test-local-html.js.backup-2025-12-12T20-27-11
cloudflare-worker.test.js.backup-2025-12-12T20-27-11
```

## Restoration

To restore from a backup:

```bash
# Find the backup you want to restore
ls -ltr cloudflare/backups/

# Copy back to original location
cp cloudflare/backups/test.html.backup-2025-12-12T20-27-11 cloudflare/test.html
```

## Cleanup

Backups are **not automatically deleted**. Clean up old backups periodically:

```bash
# Remove backups older than 7 days
find cloudflare/backups/ -name "*.backup-*" -mtime +7 -delete

# Or remove all backups
rm cloudflare/backups/*.backup-*
```

## Git Ignore

This directory is in `.gitignore` - backups are local only and not committed to the repository.

## See Also

- **Automation System:** `.claude/hooks/cloudflare-test-automation.js`
- **Documentation:** `.claude/hooks/cloudflare-test-automation.README.md`
- **Coverage Reports:** `cloudflare/test-coverage-report.md`
