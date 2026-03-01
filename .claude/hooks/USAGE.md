# Pre-Push Validation System - Quick Reference

## What It Does

Automatically ensures **CLAUDE.md**, **README.md**, and **CHANGELOG.md** are updated before any `git push` operation.

## How It Works

### Automatic Validation

When you run `git push`, the system automatically:

1. Checks if you have unpushed commits
2. Verifies all three documentation files are newer than your oldest unpushed commit
3. Blocks the push if documentation is outdated
4. Warns (but doesn't block) if you have uncommitted changes

### Manual Validation

Check documentation status anytime:

```bash
# Via slash command
/validate-docs

# Via direct script execution
./.claude/hooks/pre-push-validation.sh
```

## Example Output

### ✅ Passing Validation

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PRE-PUSH VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ CLAUDE.md: Updated on 2025-12-10
✓ README.md: Updated on 2025-12-10
✓ CHANGELOG.md: Updated on 2025-12-10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All documentation files are up to date
```

### ❌ Failing Validation

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PRE-PUSH VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ CLAUDE.md: Not updated since 2025-12-09
✓ README.md: Updated on 2025-12-10
❌ CHANGELOG.md: Not updated since 2025-12-08
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PUSH BLOCKED: Documentation files are not current

Please update the following files before pushing:
  • CLAUDE.md
  • CHANGELOG.md
```

## When to Update Each File

### CLAUDE.md

Update when you:

- Add new features or capabilities
- Change project conventions or standards
- Add new blocks or skills
- Modify development workflows
- Update configuration patterns

### README.md

Update when you:

- Change project structure
- Add new dependencies
- Modify setup instructions
- Update deployment procedures
- Change architectural patterns

### CHANGELOG.md

**Update for EVERY change:**

- New features
- Bug fixes
- Documentation updates
- Configuration changes
- Refactoring work

## Bypassing Validation (Emergency Only)

If you absolutely must push without updating documentation:

```bash
git push --no-verify
```

**⚠️ WARNING**: Only use this for emergency hotfixes. Always update documentation as soon as possible after bypassing.

## Workflow Integration

### Normal Development Flow

1. Make code changes
2. Update documentation (CLAUDE.md, README.md, CHANGELOG.md)
3. Commit changes: `git add . && git commit -m "..."`
4. Push: `git push` (validation runs automatically)

### Claude Code Integration

The system integrates with Claude Code skills:

- Mention "git push" or "pushing changes" → Claude suggests validating first
- Use `/validate-docs` command → Manual validation
- Git push blocked → Claude provides guidance on fixing

## Troubleshooting

### "No commits to push"

This is normal - you're up to date with remote. The hook exits successfully.

### "Cannot find upstream branch"

Normal for new branches. The hook allows the push to proceed.

### "Push blocked" but files are updated

The file modification date is older than your first unpushed commit. Touch the file or make a small change to update its timestamp.

### Hook not executing

Check permissions:

```bash
chmod +x .claude/hooks/pre-push-validation.sh
chmod +x .git/hooks/pre-push
```

## File Locations

- **Validation Script**: `.claude/hooks/pre-push-validation.sh`
- **Git Hook**: `.git/hooks/pre-push`
- **Skill Definition**: `.claude/skills/pre-push-validation/SKILL.md`
- **Slash Command**: `.claude/commands/validate-docs.md`
- **Usage Guide**: `.claude/hooks/USAGE.md` (this file)

## Benefits

1. **Never forget documentation** - Automatic validation ensures docs stay current
2. **Better code reviews** - PRs include up-to-date documentation
3. **Reduced technical debt** - Documentation doesn't lag behind code
4. **Team alignment** - Everyone knows what changed and why
5. **Historical accuracy** - CHANGELOG reflects actual project evolution

---

**Created**: 2025-12-10
**Part of**: Claude Code Hooks System
**See also**: `.claude/hooks/CONFIG.md`, `.claude/skills/pre-push-validation/SKILL.md`
