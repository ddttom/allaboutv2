---
description: Validate Cloudflare worker test structure follows two-file rule
---

You are validating that the Cloudflare worker implementation follows the two-file testing system.

**Reference**:

- cloudflare/files/TESTING.md (two-file rule documentation)
- cloudflare/files/README.md (testing requirements)
- CLAUDE.md (Cloudflare Worker Two-File Testing System section)

## The Two-File Rule

**File 1:** `cloudflare/files/cloudflare-worker.js` - Production worker code
**File 2:** `cloudflare/files/cloudflare-worker.test.js` - Single unified test file

**NO other test files are allowed.**

## Validation Checklist

Run the following checks and report status for each:

### 1. File Structure Check

```bash
# Check that only two files exist (worker + test)
ls cloudflare/files/*.test.js
```

**Expected**: Only `cloudflare-worker.test.js` should exist

**Red Flags**:

- ❌ Multiple test files (unit.test.js, integration.test.js, etc.)
- ❌ Test files with different naming patterns

### 2. Pure Function Check

Search the worker code for runtime-specific APIs that should NOT be used for core logic:

```bash
# Search for HTMLRewriter element handler patterns
grep -n "element.ontext" cloudflare/files/cloudflare-worker.js
grep -n "element.onendtag" cloudflare/files/cloudflare-worker.js
grep -n "element.replace" cloudflare/files/cloudflare-worker.js
```

**Expected**: No matches (these methods should only be in HTMLRewriter handler functions, not core logic)

**Red Flags**:

- ❌ `element.ontext()` in exported functions
- ❌ `element.onendtag()` in exported functions
- ❌ Core transformation logic using element handlers

### 3. Export Check

Verify all transformation functions are exported for testing:

```bash
# List all exports from worker
grep -n "^export " cloudflare/files/cloudflare-worker.js
```

**Expected**: See exports like:

- `export const replacePicturePlaceholder`
- `export const handleJsonLdMeta`
- `export const WORKER_VERSION`
- `export const PICTURE_PLACEHOLDER_CONFIG`

**Red Flags**:

- ❌ Transformation functions not exported
- ❌ No pure function exports

### 4. Test Coverage Check

Run tests and verify they pass:

```bash
cd cloudflare/files && npm test
```

**Expected**: All tests pass with good coverage

**Red Flags**:

- ❌ Tests failing
- ❌ Tests skipped
- ❌ Low coverage (<90%)

### 5. Test Structure Check

Verify test file has proper structure:

```bash
# Check for unit test sections
grep -n "describe.*Unit" cloudflare/files/cloudflare-worker.test.js
grep -n "describe.*Integration" cloudflare/files/cloudflare-worker.test.js
```

**Expected**: Both unit and integration test sections exist

### 6. Pure Function Test Pattern Check

Verify pure functions are tested with string input/output:

```bash
# Search for string-based tests
grep -A 5 "test.*replaces" cloudflare/files/cloudflare-worker.test.js | head -20
```

**Expected**: Tests should use string literals and `expect(result).toContain()`

**Red Flags**:

- ❌ Tests mocking HTMLRewriter elements
- ❌ Tests requiring Cloudflare runtime

## Report Format

Generate a report with the following structure:

```
# Cloudflare Worker Test Validation Report

## ✅ PASS / ❌ FAIL

### File Structure
[Status and details]

### Pure Function Pattern
[Status and details]

### Export Pattern
[Status and details]

### Test Coverage
[Status and details]

### Test Structure
[Status and details]

### Pure Function Tests
[Status and details]

## Summary

- Total checks: 6
- Passed: X
- Failed: X

## Issues Found

[List any violations of the two-file rule]

## Recommendations

[Specific actions to fix any issues]
```

## Common Issues and Fixes

### Issue: Multiple test files exist

**Fix**: Consolidate all tests into `cloudflare-worker.test.js`

```bash
# Remove extra test files
rm cloudflare/files/*.unit.test.js
rm cloudflare/files/*.integration.test.js
```

### Issue: Core logic uses element handlers

**Fix**: Refactor to pure string functions

```javascript
// Before (WRONG)
export const handleTransform = (element) => {
  element.ontext((text) => { ... });
};

// After (CORRECT)
export const applyTransform = (html) => {
  return html.replace(/pattern/g, replacement);
};
```

### Issue: Functions not exported

**Fix**: Add exports to worker file

```javascript
// Add to cloudflare-worker.js
export const myPureFunction = (html) => { ... };
```

### Issue: Tests don't use pure patterns

**Fix**: Refactor tests to use string input/output

```javascript
// Before (WRONG)
test('transforms content', () => {
  const mockElement = { ontext: vi.fn() };
  handleTransform(mockElement);
});

// After (CORRECT)
test('transforms content', () => {
  const html = '<div>input</div>';
  const result = applyTransform(html);
  expect(result).toContain('output');
});
```

## After Validation

If all checks pass:

- ✅ Worker follows two-file rule
- ✅ Ready for deployment

If any checks fail:

- ❌ Fix issues before committing
- ❌ Run `/check-cloudflare-tests` again after fixes

**See also**:

- `cloudflare/files/TESTING.md` - Complete testing guide
- `cloudflare/files/README.md` - Implementation patterns
- `CLAUDE.md` - Project-wide testing standards
