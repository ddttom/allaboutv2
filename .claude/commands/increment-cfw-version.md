# Increment Cloudflare Worker Version

## Command Purpose

Interactively increment the `WORKER_VERSION` constant in `cloudflare/files/cloudflare-worker.js` following semantic versioning rules.

## Usage

```bash
/increment-cfw-version [MAJOR|MINOR|PATCH]
```

**Examples:**
- `/increment-cfw-version PATCH` - Bug fix: 1.0.0 → 1.0.1
- `/increment-cfw-version MINOR` - New feature: 1.0.0 → 1.1.0
- `/increment-cfw-version MAJOR` - Breaking change: 1.0.0 → 2.0.0
- `/increment-cfw-version` - Interactive mode (asks which type)

## What This Command Does

1. **Read current version** from `cloudflare/files/cloudflare-worker.js`
2. **Determine increment type** (from argument or interactive prompt)
3. **Calculate new version** based on semantic versioning
4. **Show changes** (before → after)
5. **Update version constant** in worker file
6. **Run tests** to validate changes
7. **Update documentation** if needed
8. **Show deployment command** for next steps

## Interactive Workflow

### Step 1: Show Current Version

```
Current Cloudflare Worker Version: 1.0.0

What type of change are you making?

1. PATCH (1.0.1) - Bug fixes, performance improvements, refactoring
2. MINOR (1.1.0) - New features, backward-compatible changes
3. MAJOR (2.0.0) - Breaking changes, major features

Enter choice (1-3):
```

### Step 2: Confirm Change

```
Version Increment Confirmation

Current version: 1.0.0
New version:     1.1.0
Increment type:  MINOR

This will:
✓ Update WORKER_VERSION in cloudflare/files/cloudflare-worker.js
✓ Run test suite (45 tests)
✓ Check documentation references

Proceed? (y/n):
```

### Step 3: Apply Changes

```
Updating version...

✓ Updated WORKER_VERSION = '1.1.0' in cloudflare-worker.js
✓ Running tests... 45 tests passing
✓ Version tests validated

Next steps:
1. Review changes: git diff cloudflare/files/cloudflare-worker.js
2. Update CHANGELOG.md with changes
3. Commit: git add cloudflare/files/cloudflare-worker.js
4. Deploy: Follow cloudflare/files/README.md deployment steps
```

## Version Increment Rules

### PATCH (1.0.x)

Use for:
- Bug fixes that don't change behavior
- Performance improvements
- Code refactoring (internal changes only)
- Documentation updates in code comments
- Typo fixes

**Example:**
```javascript
// Before: 1.0.0
export const WORKER_VERSION = '1.0.1';
```

### MINOR (1.x.0)

Use for:
- New features (backward-compatible)
- New response headers
- New metadata handling
- Enhanced existing functionality
- New optional parameters

**Example:**
```javascript
// Before: 1.0.1
export const WORKER_VERSION = '1.1.0';
```

### MAJOR (x.0.0)

Use for:
- Breaking changes to API
- Removal of features
- Changes requiring client updates
- Major architectural changes
- Changes to required parameters

**Example:**
```javascript
// Before: 1.1.0
export const WORKER_VERSION = '2.0.0';
```

## Error Handling

### File Not Found

```
❌ Error: cloudflare/files/cloudflare-worker.js not found

Make sure you're in the project root directory.
```

### Invalid Version Format

```
❌ Error: Current version '1.0' is not valid semantic versioning

Expected format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
Please manually fix WORKER_VERSION constant.
```

### Test Failures

```
❌ Error: Tests failed after version update

Failed tests:
- Worker Version › WORKER_VERSION constant exists

Please review test output and fix issues before committing.
```

## Pre-Deployment Checklist

After incrementing version, verify:

- [ ] `WORKER_VERSION` updated in `cloudflare-worker.js`
- [ ] All tests passing (npm test)
- [ ] README.md current version updated (line 21)
- [ ] cloudflare.md current version updated (line 160)
- [ ] CHANGELOG.md entry added with changes
- [ ] Git commit includes version change
- [ ] Ready to deploy to Cloudflare Dashboard

## Integration with Other Tools

### With Pre-Tool-Use Hook

The hook calls this command automatically if worker modifications detected without version increment.

### With Skill

The `cfw-version-monitor` skill provides the validation logic used by this command.

### With Tests

Version tests automatically run after increment to ensure:
- Format is correct (`\d+\.\d+\.\d+`)
- `cfw` header includes new version
- Tests still pass with changes

## Manual Version Update

If you need to update version manually:

1. Open `cloudflare/files/cloudflare-worker.js`
2. Find line ~19: `export const WORKER_VERSION = '1.0.0';`
3. Update to new version following semantic versioning
4. Run tests: `cd cloudflare/files && npm test`
5. Update documentation references

## Examples

### Example 1: Fixing a date parsing bug

```bash
$ /increment-cfw-version PATCH

Current version: 1.0.0
New version:     1.0.1
Increment type:  PATCH

✓ Updated WORKER_VERSION = '1.0.1'
✓ 45 tests passing
✓ Ready to commit
```

### Example 2: Adding JSON-LD caching feature

```bash
$ /increment-cfw-version MINOR

Current version: 1.0.1
New version:     1.1.0
Increment type:  MINOR

✓ Updated WORKER_VERSION = '1.1.0'
✓ 45 tests passing
✓ Ready to commit
```

### Example 3: Removing legacy metadata support

```bash
$ /increment-cfw-version MAJOR

⚠️  MAJOR version increment is a breaking change!

Current version: 1.1.0
New version:     2.0.0
Increment type:  MAJOR

This will require clients to update. Are you sure? (y/n): y

✓ Updated WORKER_VERSION = '2.0.0'
✓ 45 tests passing
✓ Update CHANGELOG.md with breaking changes
✓ Ready to commit
```

## Technical Notes

### Implementation

This command should:
1. Use regex to find and extract `WORKER_VERSION = '(\d+\.\d+\.\d+)'`
2. Parse version into [major, minor, patch] components
3. Increment appropriate component based on type
4. Reset lower components (e.g., MINOR increment: 1.2.3 → 1.3.0)
5. Update file using string replacement
6. Run test suite via `npm test`
7. Report success or errors

### File Modification

The command modifies line ~19 of `cloudflare-worker.js`:

```javascript
// Before
export const WORKER_VERSION = '1.0.0';

// After (MINOR increment)
export const WORKER_VERSION = '1.1.0';
```

### Validation

After update, command runs:
```bash
cd cloudflare/files && npm test
```

Expected output:
```
✓ cloudflare-worker.test.js (45 tests)
  ✓ Worker Version
    ✓ WORKER_VERSION constant exists and follows semantic versioning
    ✓ WORKER_VERSION starts at v1.0.0
  ✓ [... other tests ...]
```

## Reference Documentation

- Worker file: `cloudflare/files/cloudflare-worker.js` (line 19)
- Version documentation: `cloudflare/files/README.md` (lines 16-37)
- Test file: `cloudflare/files/cloudflare-worker.test.js` (lines 23-39, 513-556)
- Implementation guide: `cloudflare/cloudflare.md` (lines 159-163)

## Related Commands

- `/validate-docs` - Validate documentation is current before push
- `/test-block` - Run tests for specific blocks
- `/lint-all` - Run all linting checks

## Success Criteria

Command succeeds when:
- Version number correctly incremented
- Semantic versioning rules followed
- All 45 tests pass
- File syntax remains valid
- Version constant properly exported
