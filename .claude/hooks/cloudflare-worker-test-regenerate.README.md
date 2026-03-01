# Cloudflare Worker Test Regeneration Hook

## Purpose

Automatically regenerates `cloudflare/test-rendered.html` whenever `cloudflare/files/cloudflare-worker.js` is edited.

## How It Works

1. **Trigger:** PostToolUse hook fires after Edit, MultiEdit, or Write operations
2. **Target Detection:** Checks if modified file is `cloudflare/files/cloudflare-worker.js`
3. **Test Execution:** Runs `npm run test:local` in `cloudflare/files/` directory
4. **Output:** Generates fresh `test-rendered.html` with all worker transformations applied

## Benefits

### Immediate Validation

- Validates worker changes immediately after editing
- Catches errors early in development workflow
- No need to manually run test script

### Synchronized Output

- `test-rendered.html` always reflects current worker code
- Easy to visually inspect transformations
- Accurate reference for debugging

### Development Efficiency

- Automatic workflow - no manual steps required
- Fast feedback loop for iterative development
- Consistent test output across sessions

## What Gets Tested

The hook runs the complete local HTML test suite, which validates:

1. **Picture Placeholder Replacement** - "Picture Here" → author image
2. **JSON-LD Injection** - Structured data generation from metadata
3. **Speculation Rules** - Near-instant navigation script injection
4. **Metadata Cleanup** - Removal of non-social meta tags
5. **HTML Comments** - Complete removal
6. **Structure Integrity** - DOCTYPE, HTML tags, head/body sections

## Output

### Console Output

When the hook runs successfully:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 CLOUDFLARE WORKER TEST REGENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detected change to: cloudflare-worker.js
Regenerating test-rendered.html...

✓ test-rendered.html regenerated successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### File Output

**Generated:** `cloudflare/test-rendered.html` - Processed HTML with all transformations

**Validation:** Run `npm test` in `cloudflare/files/` to verify all 23 tests pass

## Hook Configuration

**Location:** `.claude/hooks/cloudflare-worker-test-regenerate.sh`

**Registration:** `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/cloudflare-worker-test-regenerate.sh"
          }
        ]
      }
    ]
  }
}
```

## Dependencies

- **npm:** Package manager for running test script
- **Node.js:** v18+ required for ES modules
- **test-local-html.js:** Local test script in `cloudflare/files/`

## Error Handling

### Hook Execution Errors

If the hook fails:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 CLOUDFLARE WORKER TEST REGENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detected change to: cloudflare-worker.js
Regenerating test-rendered.html...

✗ Error regenerating test-rendered.html
Run manually: cd cloudflare/files && npm run test:local
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Manual Recovery:**

```bash
cd cloudflare/files
npm run test:local
```

### Common Issues

**Issue:** "Could not find cloudflare/files directory"
**Solution:** Hook expects to be run from project root with `$CLAUDE_PROJECT_DIR` set

**Issue:** Hook doesn't fire after edits
**Solution:** Verify hook is registered in `.claude/settings.json` and has execute permissions

**Issue:** Tests fail during regeneration
**Solution:** Check worker code for syntax errors, run `npm test` for detailed output

## Manual Override

To temporarily disable the hook:

```bash
# Edit .claude/settings.json and remove the hook entry
# Or rename the hook file
mv .claude/hooks/cloudflare-worker-test-regenerate.sh \
   .claude/hooks/cloudflare-worker-test-regenerate.sh.disabled
```

## Related Files

- **Worker:** `cloudflare/files/cloudflare-worker.js` - Production worker code
- **Test Script:** `cloudflare/files/test-local-html.js` - Local HTML processing test
- **Test Input:** `cloudflare/test.html` - HTML fixture with test cases
- **Test Output:** `cloudflare/test-rendered.html` - Generated output (auto-updated by hook)
- **Automated Tests:** `cloudflare/files/cloudflare-worker.test.js` - 83 unit/integration tests

## Performance

- **Execution Time:** ~200ms (23 tests)
- **Overhead:** Minimal - only runs when worker file is edited
- **Impact:** Non-blocking - runs asynchronously after edit completes

## See Also

- **Hook Configuration:** `.claude/hooks/CONFIG.md`
- **Worker Documentation:** `cloudflare/files/README.md`
- **Testing Guide:** `cloudflare/files/TESTING.md`
- **Two-File Testing System:** Critical principle for Cloudflare worker development
