# Cloudflare Worker Test Automation System

## Overview

**Intelligent test automation system** that automatically generates and updates tests when `cloudflare-worker.js` is modified.

**Key Features:**
- 🔍 Detects changes via git diff (with cache fallback)
- ✨ Auto-generates test stubs for new functions
- 🔄 Auto-updates test expectations for modified functions
- 💾 Creates timestamped backups before making changes
- 🧪 Runs complete test suite (unit + integration + browser)
- 📊 Generates comprehensive coverage report
- ⚡ Rollback capability if tests fail

## How It Works

### Workflow

```
1. Edit cloudflare-worker.js
         ↓
2. Hook detects change (PostToolUse)
         ↓
3. Analyze changes (git diff)
         ↓
4. Create backups of all test files
         ↓
5. Generate tests for new functions
         ↓
6. Update tests for modified functions
         ↓
7. Run all tests (npm test + test:local)
         ↓
8. Generate coverage report
         ↓
9. Display summary
```

### Change Detection

The system uses **git diff** to detect:

**New Functions:**
- Exported functions that didn't exist in previous commit
- Automatically inferred type (inject/remove/replace/extract/build)
- Test stub generated based on function type

**Modified Functions:**
- Exported functions with changed body/implementation
- Test expectations marked for review
- Backup created for safety

**Deleted Functions:**
- Functions removed from worker
- Tests marked as potentially obsolete

### Function Type Inference

The system infers transformation type from function names:

| Pattern | Type | Auto-Generated Test |
|---------|------|---------------------|
| `inject*`, `add*` | inject | Checks for presence in output |
| `remove*`, `delete*` | remove | Checks for absence in output |
| `replace*`, `transform*` | replace | Checks for transformation |
| `extract*`, `get*` | extract | Validates extracted data |
| `build*`, `create*` | build | Validates constructed object |
| Other | utility | No browser test (unit tests only) |

## Generated Files

### Coverage Report

**Location:** `cloudflare/test-coverage-report.md`

**Contents:**
- Summary statistics (new/modified/deleted functions)
- Quick actions checklist
- Function-by-function coverage details
- Git diff of worker changes
- Backup file locations
- Test results (npm test pass/fail)
- Error log (if any failures)

**Example:**

```markdown
# Cloudflare Worker Test Coverage Report

**Generated:** 2025-12-12T20:27:13.121Z

## Summary

- **New Functions:** 1
- **Modified Functions:** 1
- **Deleted Functions:** 0
- **Tests Generated:** 1
- **Tests Updated:** 1
- **npm test:** ✅ PASSED
- **Errors:** 0

## Quick Actions

- [ ] Implement test for `removeScriptTags` (Test stub generated - needs manual implementation)
- [ ] Review test for `injectSpeculationRules` (Function modified - test expectations may need updates)

## New Functions

### `removeScriptTags`
- **Type:** remove
- **Parameters:** `html`
- **Status:** ⚠️ Test stub generated

## Modified Functions

### `injectSpeculationRules`
- **Type:** inject
- **Status:** ⚠️ Needs test review

## Backups Created

- `test.html` → `backups/test.html.backup-2025-12-12T20-27-11`
- `test-local-html.js` → `backups/test-local-html.js.backup-2025-12-12T20-27-11`
- `cloudflare-worker.test.js` → `backups/cloudflare-worker.test.js.backup-2025-12-12T20-27-11`
```

### Backup Files

**Location:** `cloudflare/backups/` directory

**Naming:** `{filename}.backup-{ISO-timestamp}`

**Examples:**
- `cloudflare/backups/test.html.backup-2025-12-12T20-27-11`
- `cloudflare/backups/test-local-html.js.backup-2025-12-12T20-27-11`
- `cloudflare/backups/cloudflare-worker.test.js.backup-2025-12-12T20-27-11`

**Restoration:**
```bash
# If you need to rollback (from project root)
cp cloudflare/backups/test.html.backup-2025-12-12T20-27-11 cloudflare/test.html
```

**Note:** Backup files are gitignored to keep the repository clean. See `cloudflare/backups/README.md` for more details.

## Current Capabilities (MVP)

### ✅ Implemented

- [x] Git diff-based change detection
- [x] Function extraction and type inference
- [x] Automated backup creation
- [x] Test stub generation (with TODO markers)
- [x] Test update detection (flags for manual review)
- [x] Complete test suite execution (npm test + test:local)
- [x] Comprehensive coverage report
- [x] Console output with color-coded status
- [x] Error handling with partial rollback
- [x] Backup management

### 🚧 Planned Enhancements (Future)

- [ ] Smart test generation (actual assertions, not just stubs)
- [ ] Automatic test expectation updates (parse and replace values)
- [ ] Template-based test generation
- [ ] HTML test section auto-generation
- [ ] JavaScript test function auto-generation
- [ ] Unit test auto-generation
- [ ] Interactive mode (ask user for confirmation)
- [ ] Incremental updates (only change what's needed)

## Configuration

### Environment Variables

**CLAUDE_PROJECT_DIR** - Project root directory
- Default: `process.cwd()`
- Set automatically by Claude Code hooks

### File Paths

All paths are relative to project root:

```javascript
{
  cloudflareDir: 'cloudflare/',
  filesDir: 'cloudflare/files/',
  workerFile: 'cloudflare/files/cloudflare-worker.js',
  testHtmlFile: 'cloudflare/test.html',
  testLocalFile: 'cloudflare/files/test-local-html.js',
  testSuiteFile: 'cloudflare/files/cloudflare-worker.test.js',
  coverageReportFile: 'cloudflare/test-coverage-report.md'
}
```

## Manual Execution

To run the automation system manually:

```bash
# From project root
node .claude/hooks/cloudflare-test-automation.js

# With custom project root
CLAUDE_PROJECT_DIR=/path/to/project node .claude/hooks/cloudflare-test-automation.js
```

## Hook Integration

The automation is triggered automatically via PostToolUse hook:

**File:** `.claude/hooks/cloudflare-worker-test-regenerate.sh`

**Trigger:** Edit, MultiEdit, or Write to `cloudflare/files/cloudflare-worker.js`

**Behavior:**
1. Detects file change
2. Calls `cloudflare-test-automation.js`
3. Displays results
4. Exits with appropriate status code

## Output Example

```
============================================================
🤖 CLOUDFLARE WORKER TEST AUTOMATION
============================================================

📊 Step 1: Analyzing worker changes...
✓ Found 1 new function(s):
  - removeScriptTags (remove)
✓ Found 1 modified function(s):
  - injectSpeculationRules

💾 Step 2: Creating backups...
✓ Backed up: test.html
✓ Backed up: test-local-html.js
✓ Backed up: cloudflare-worker.test.js

✨ Step 3: Generating tests for new functions...
  Generating tests for: removeScriptTags
  ⚠️  Test stub created (needs manual implementation)

🔄 Step 4: Updating tests for modified functions...
  Updating tests for: injectSpeculationRules
  ⚠️  Tests marked for review

🧪 Step 5: Running all tests...
  Running npm test...
✓ All tests passed
  Running local HTML test...
✓ Local HTML test passed

📝 Step 6: Generating coverage report...
✓ Coverage report saved: cloudflare/test-coverage-report.md

============================================================
📊 SUMMARY
============================================================
New Functions: 1
Modified Functions: 1
Tests Generated: 1
Tests Updated: 1
npm test: ✅ PASSED
Errors: 0

✓ Coverage report: cloudflare/test-coverage-report.md
============================================================
```

## Error Handling

### Partial Rollback

If test generation or updates fail:
- Failed operations are reverted from backup
- Successful operations are kept
- Error details added to coverage report
- System continues with what worked

### Common Errors

**Git diff unavailable:**
- Fallback: Cache-based comparison (future enhancement)
- Impact: May not detect all changes accurately

**npm test fails:**
- Tests still run and report generated
- Coverage report shows failure details
- Backups preserved for rollback

**File permissions:**
- Check execute permissions: `chmod +x .claude/hooks/cloudflare-test-automation.js`
- Check write permissions for coverage report directory

## Best Practices

### 1. Review Auto-Generated Tests

Always review test stubs before committing:
- Check assertions make sense
- Add edge cases
- Update test data if needed

### 2. Commit Coverage Reports

Include coverage reports in git:
```bash
git add cloudflare/test-coverage-report.md
git commit -m "feat: Add removeScriptTags with test coverage"
```

### 3. Clean Up Old Backups

Periodically remove old backup files:
```bash
# Remove backups older than 7 days
find cloudflare/backups/ -name "*.backup-*" -mtime +7 -delete
```

### 4. Manual Test Review

When tests are marked for review:
- Read the git diff to understand changes
- Update test expectations manually
- Run tests to verify they pass
- Update coverage report if needed

## Troubleshooting

### Hook Doesn't Fire

**Check:**
1. Hook is registered in `.claude/settings.json`
2. Script has execute permissions
3. You're editing the correct file (cloudflare/files/cloudflare-worker.js)

**Solution:**
```bash
# Test manually
node .claude/hooks/cloudflare-test-automation.js
```

### Tests Fail After Auto-Update

**Solution:**
```bash
# Restore from backup (from project root)
cp cloudflare/backups/test.html.backup-[timestamp] cloudflare/test.html
cp cloudflare/backups/test-local-html.js.backup-[timestamp] cloudflare/files/test-local-html.js

# Review coverage report for details
cat cloudflare/test-coverage-report.md

# Fix tests manually
```

### Coverage Report Not Generated

**Check:**
1. Write permissions in cloudflare/ directory
2. Disk space available
3. Check console output for errors

**Solution:**
```bash
# Verify directory exists and is writable
ls -la cloudflare/
touch cloudflare/test-coverage-report.md
```

## Related Files

- **Hook:** `.claude/hooks/cloudflare-worker-test-regenerate.sh`
- **Automation Script:** `.claude/hooks/cloudflare-test-automation.js`
- **Worker:** `cloudflare/files/cloudflare-worker.js`
- **Browser Tests:** `cloudflare/test.html`
- **Local Tests:** `cloudflare/files/test-local-html.js`
- **Unit Tests:** `cloudflare/files/cloudflare-worker.test.js`
- **Coverage Report:** `cloudflare/test-coverage-report.md`

## See Also

- **Hook Configuration:** `.claude/hooks/CONFIG.md`
- **Worker Documentation:** `cloudflare/files/README.md`
- **Testing Guide:** `cloudflare/files/TESTING.md`
- **Two-File Testing System:** Core principle for Cloudflare development
