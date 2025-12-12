# Validate Documentation Before Push

Run pre-push validation manually to check if CLAUDE.md, README.md, and CHANGELOG.md are up to date.

## Your Task

Execute the pre-push validation script to verify documentation is current before pushing changes:

```bash
./.claude/hooks/pre-push-validation.sh
```

## What This Command Does

1. **Checks Critical Files:**
   - CLAUDE.md - AI instructions and project guide
   - README.md - Project structure and overview
   - CHANGELOG.md - Change history

2. **Validates Updates:**
   - Files must be modified after oldest unpushed commit
   - Detects uncommitted changes
   - Warns about staged but uncommitted changes

3. **Provides Guidance:**
   - Shows which files need updating
   - Explains why each file matters
   - Gives tips for fixing issues

## When to Use This Command

- **Before pushing** - Manual pre-check before `git push`
- **After multiple commits** - Verify documentation is current
- **During code review** - Ensure documentation updated
- **Before pull request** - Validate documentation completeness

## Expected Output

### ✅ All Documentation Current

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PRE-PUSH VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Commits to push: 3
🌿 Branch: main → origin/main

📝 Checking documentation files...

✓ CLAUDE.md: Updated 2025-12-10
✓ README.md: Updated 2025-12-10
✓ CHANGELOG.md: Updated 2025-12-10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ VALIDATION PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### ❌ Documentation Outdated

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PRE-PUSH VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Commits to push: 3
🌿 Branch: main → origin/main

📝 Checking documentation files...

✓ CLAUDE.md: Updated 2025-12-10
⚠️  README.md: Has uncommitted changes
❌ CHANGELOG.md: Not updated since 2025-12-09

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ VALIDATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please update the following files before pushing:
  • CHANGELOG.md

💡 Tips:
  1. Update CHANGELOG.md with your changes
  2. Update README.md if project structure changed
  3. Update CLAUDE.md if AI instructions changed
  4. Commit your documentation updates
  5. Push again
```

## Follow-Up Actions

### If Validation Fails

1. **Update the outdated files** with your changes
2. **Commit all changes (including user edits):**
   ```bash
   git add .
   git commit -m "docs: Update documentation for [your changes]"
   ```
3. **Run validation again** to verify: `/validate-docs`
4. **Push when ready:** `git push`

### If Validation Passes

You're ready to push:
```bash
git push
```

The pre-push hook will run automatically and should also pass.

## Related Commands

- `/lint-all` - Run code quality checks
- `/check-security` - Run security validation

## See Also

- **Pre-push validation skill:** `.claude/skills/pre-push-validation/SKILL.md`
- **Hook documentation:** `.claude/hooks/CONFIG.md`
- **CHANGELOG format:** See existing entries in `CHANGELOG.md`
