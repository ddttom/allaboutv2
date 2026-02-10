# Cloudflare Worker Version Monitoring Skill

## Purpose

Monitor changes to the Cloudflare worker (`cloudflare/files/cloudflare-worker.js`) and ensure the `WORKER_VERSION` constant is incremented using semantic versioning for ALL changes.

## When to Use This Skill

This skill should be invoked automatically when:

- Any edit is made to `cloudflare/files/cloudflare-worker.js`
- A pull request includes changes to the worker file
- Before deploying the worker to production

## Version Management Rules

### Semantic Versioning Format

The `WORKER_VERSION` constant must follow semantic versioning: `MAJOR.MINOR.PATCH`

```javascript
export const WORKER_VERSION = '1.0.0';
```

### When to Increment

**MAJOR version (x.0.0):**

- Breaking changes to the worker API
- Removal of existing features
- Changes that require client updates
- Major architectural changes

**MINOR version (1.x.0):**

- New features added (backward-compatible)
- New response headers
- New metadata handling
- Enhanced functionality

**PATCH version (1.0.x):**

- Bug fixes
- Documentation updates in code comments
- Performance improvements
- Code refactoring (no behavior changes)

## Validation Process

### Step 1: Detect Changes

Check if `cloudflare/files/cloudflare-worker.js` has been modified:

```bash
git diff HEAD cloudflare/files/cloudflare-worker.js
```

### Step 2: Extract Current Version

```bash
grep "WORKER_VERSION = " cloudflare/files/cloudflare-worker.js
```

Expected format:

```javascript
export const WORKER_VERSION = '1.0.0';
```

### Step 3: Compare with Git History

```bash
git log -1 --all -S "WORKER_VERSION = " -- cloudflare/files/cloudflare-worker.js
```

Check if version was incremented in the current changes.

### Step 4: Validate Tests

Ensure version tests pass:

```bash
cd cloudflare/files && npm test
```

Tests verify:

- `WORKER_VERSION` constant exists
- Version follows semantic versioning pattern (`\d+\.\d+\.\d+`)
- `cfw` header is present in responses
- Header value matches `WORKER_VERSION`

## Error Scenarios

### Version Not Incremented

**Detection:** Current commit modifies worker but version constant unchanged.

**Action:**

1. Alert the user
2. Ask which type of change (MAJOR, MINOR, PATCH)
3. Suggest appropriate version number
4. Offer to update the version

**Example message:**

```
⚠️ Worker Version Not Incremented

The file cloudflare/files/cloudflare-worker.js has been modified, but
WORKER_VERSION is still 1.0.0.

What type of change is this?
1. MAJOR (2.0.0) - Breaking change or major feature
2. MINOR (1.1.0) - New feature, backward-compatible
3. PATCH (1.0.1) - Bug fix or refactor

Please update WORKER_VERSION in cloudflare/files/cloudflare-worker.js
```

### Invalid Version Format

**Detection:** Version doesn't match semantic versioning pattern.

**Action:**

1. Alert the user
2. Show current invalid version
3. Suggest correct format

**Example:**

```
❌ Invalid Version Format

Current: WORKER_VERSION = 'v1.0'
Expected: WORKER_VERSION = '1.0.0'

Version must follow semantic versioning: MAJOR.MINOR.PATCH
```

### Version Decremented

**Detection:** New version number is lower than previous.

**Action:**

1. Alert the user
2. Show previous and current versions
3. Ask for confirmation or correction

## Integration Points

### With Pre-Tool-Use Hook

The `pre-tool-use-version-check.sh` hook calls this skill automatically before Edit, MultiEdit, or Write operations on the worker file.

### With Slash Command

The `/increment-cfw-version` command provides interactive version increment workflow.

### With Testing

Version tests run automatically via `npm test` to validate:

- Version constant format
- Version header presence
- Header value correctness

## Example Workflow

### Scenario: Adding a new feature

1. Developer modifies `cloudflare-worker.js` to add JSON-LD caching
2. Pre-tool-use hook detects worker modification
3. Hook invokes this skill
4. Skill checks if version was incremented
5. If not, skill prompts:

   ```
   New feature detected. Increment version?
   Current: 1.0.0
   Suggested: 1.1.0 (MINOR - new feature)
   ```

6. Developer confirms
7. Skill updates `WORKER_VERSION = '1.1.0'`
8. Tests run automatically
9. All tests pass ✅

### Scenario: Fixing a bug

1. Developer fixes date parsing bug
2. Pre-tool-use hook invokes skill
3. Skill suggests PATCH increment: `1.0.0` → `1.0.1`
4. Developer confirms
5. Version updated and tests pass

## Manual Check Command

Check version status manually:

```bash
# Check current version
grep "WORKER_VERSION" cloudflare/files/cloudflare-worker.js

# Check if version changed in current commit
git diff HEAD -- cloudflare/files/cloudflare-worker.js | grep WORKER_VERSION

# Run version tests
cd cloudflare/files && npm test | grep "Worker Version"
```

## Deployment Checklist

Before deploying to Cloudflare:

- [ ] `WORKER_VERSION` incremented appropriately
- [ ] Version follows semantic versioning format
- [ ] All tests passing (45 tests)
- [ ] Documentation updated (README.md, cloudflare.md)
- [ ] CHANGELOG.md entry added
- [ ] Git commit includes version change

## Reference

- Worker file: `cloudflare/files/cloudflare-worker.js`
- Test file: `cloudflare/files/cloudflare-worker.test.js`
- Documentation: `cloudflare/files/README.md` (lines 16-37)
- Implementation guide: `cloudflare/cloudflare.md` (lines 159-163)

## Technical Implementation

This skill should be implemented as a TypeScript module that:

1. Monitors file changes via git hooks
2. Parses `WORKER_VERSION` constant from worker file
3. Compares with previous version from git history
4. Validates semantic versioning rules
5. Prompts user for version increment if needed
6. Updates version constant when confirmed
7. Runs tests to validate changes

## Success Criteria

- All worker modifications include appropriate version increments
- Version numbers always follow semantic versioning
- Tests validate version presence and format
- Documentation stays current with version changes
- Deployment tracking via `cfw` header works reliably
