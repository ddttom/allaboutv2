---
title: Submodule Health Check Manual
description: Multi-dimensional submodule validation checking initialization, uncommitted changes, branch status, and remote sync. Provides actionable fix commands.
author: Tom Cranstoun and Maxine
created: 2026-02-19T00:00:00.000Z
version: "1.0"

mx:
  name: manual-submodule-health
  status: active
  category: manual
  tags:
    - manual
    - submodules
    - validation
    - git
    - health
    - automation
  partOf: mx-maxine-lives
  purpose: Document submodule health - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with submodule health or understanding its functionality
  contextProvides:
    - Multi-dimensional submodule validation checking initialization, uncommitted changes, branch status, and remote sync. Provides actionable fix commands.
    - Usage guide and workflow for submodule health
    - Troubleshooting and best practices
  refersTo: []
---

# Submodule Health Check

Verifies submodule health across 4 dimensions: initialized, clean working tree, branch status, and remote synchronization. Surfaces issues before they cause problems.

---

## Quick Start

```bash
npm run submodules:check   # Full health report with details
npm run submodules:quick   # Quick status summary
./scripts/check-submodules.sh --full    # Direct execution
./scripts/check-submodules.sh --quick   # Quick mode
```

---

## What It Checks

### 1. Initialization Status

**Check:** Is the submodule `.git` directory present?

```bash
✓ Initialized
✗ Not initialized
   Run: git submodule update --init mx-crm
```

### 2. Working Tree Cleanliness

**Check:** Any uncommitted changes?

```bash
✓ Clean (no uncommitted changes)
⚠ Has uncommitted changes
   Run: cd mx-crm && git status
```

### 3. Branch Status

**Check:** On a branch or detached HEAD?

```bash
✓ On branch: main
⚠ Detached HEAD state
   Run: cd mx-crm && git checkout main
```

### 4. Remote Synchronization

**Check:** Ahead/behind remote tracking branch?

```bash
✓ Up-to-date with origin
⚠ Ahead of origin by 2 commit(s)
   Run: cd mx-crm && git push

⚠ Behind origin by 3 commit(s)
   Run: cd mx-crm && git pull

⚠ Diverged from origin (ahead 2, behind 1)
   May need: cd mx-crm && git rebase origin/main

ℹ No remote tracking branch
ℹ Cannot check ahead/behind (detached HEAD)
```

---

## Output Modes

### Full Report (default)

```bash
npm run submodules:check
```

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Submodule Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking: mx-crm
✓ Initialized
✓ Clean (no uncommitted changes)
✓ On branch: main
✓ Up-to-date with origin

Checking: mx-outputs
✓ Initialized
⚠ Has uncommitted changes
   Run: cd mx-outputs && git status
✓ On branch: main
⚠ Ahead of origin by 1 commit(s)
   Run: cd mx-outputs && git push

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total submodules: 7
Initialized: 7
Clean: 6
Warnings: 2
Errors: 0

✓ All submodules healthy!
```

### Quick Status

```bash
npm run submodules:quick
```

```
✓ mx-crm
✓ mx-outputs
⚠ allaboutv2: has changes
✓ mx-audit
✗ mx-crm/business-docs: not initialized
✓ MX-Gathering (standalone)
✓ mx-crm
```

---

## Color Coding

- 🟢 **Green (✓)** — Healthy, no action needed
- 🟡 **Yellow (⚠)** — Warning, should be addressed
- 🔴 **Red (✗)** — Error, blocks normal operation
- 🔵 **Blue (ℹ)** — Informational, context only

---

## Use Cases

### Before Starting Work

```bash
npm run submodules:quick
# Verify all submodules clean
# Pull latest if behind
# Commit changes if ahead
```

### After Pulling Main Repo

```bash
git pull origin main
npm run submodules:check
# Check if submodule pointers updated
# Initialize any new submodules
# Verify sync status
```

### Before Creating PR

```bash
npm run submodules:check
# Ensure all submodules committed
# Verify no detached HEAD states
# Push any unpushed changes
# Update submodule pointers in main repo
```

### Debugging Submodule Issues

```bash
npm run submodules:check
# Identify which submodule has problems
# Get specific fix commands
# Apply fixes systematically
# Re-run to verify
```

---

## Exit Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 0 | All submodules healthy | CI pipeline continues |
| 1 | Issues detected | CI pipeline may warn or fail |

**Note:** Exit code 1 only in full mode. Quick mode always exits 0 (informational only).

---

## Integration

### CI Pipeline

```yaml
# .github/workflows/submodule-check.yml
- name: Check submodule health
  run: npm run submodules:check
  # Non-blocking warning in CI
```

### Pre-Push Hook

```bash
#!/bin/bash
# .claude/git-hooks/pre-push

echo "Checking submodule health..."
npm run submodules:quick

if [ $? -ne 0 ]; then
  echo "⚠ Some submodules have issues. Review above."
  echo "Push anyway? (y/N)"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

### Status Dashboard

```bash
# Custom status script
npm run submodules:quick
npm run validate:paths
npm run validate:cogs
# Combined health dashboard
```

---

## How It Works

### Submodule Discovery

Parses `.gitmodules` file:

```bash
git config --file .gitmodules --get-regexp path | awk '{print $2}'
```

Returns list of submodule paths.

### Health Check Functions

```bash
check_submodule_initialized()   # Test for .git presence
check_submodule_clean()          # git diff --quiet
check_submodule_branch()         # git rev-parse --abbrev-ref HEAD
check_submodule_ahead_behind()   # git rev-list --count
```

### Remote Sync Detection

```bash
# Fetch latest (silently)
git fetch origin "$branch" 2>/dev/null

# Count commits ahead/behind
ahead=$(git rev-list --count HEAD..origin/"$branch")
behind=$(git rev-list --count origin/"$branch"..HEAD)
```

---

## Common Scenarios

### Scenario: Detached HEAD

**Cause:** Checked out specific commit instead of branch

**Detection:**

```
⚠ Detached HEAD state
   Run: cd mx-crm && git checkout main
```

**Fix:**

```bash
cd mx-crm
git checkout main
cd ..
git add mx-crm
git commit -m "Updated mx-ingest submodule pointer to main branch"
```

### Scenario: Uncommitted Changes

**Cause:** Edited files in submodule without committing

**Detection:**

```
⚠ Has uncommitted changes
   Run: cd mx-crm && git status
```

**Fix:**

```bash
cd mx-crm
git status
git add .
git commit -m "Your commit message"
git push origin main
cd ..
git add mx-crm
git commit -m "Updated mx-ingest submodule pointer"
```

### Scenario: Ahead of Origin

**Cause:** Committed in submodule but didn't push

**Detection:**

```
⚠ Ahead of origin by 2 commit(s)
   Run: cd mx-crm && git push
```

**Fix:**

```bash
cd mx-crm
git push origin main
cd ..
# Submodule pointer already correct (no main repo update needed)
```

### Scenario: Behind Origin

**Cause:** Someone else pushed to submodule

**Detection:**

```
⚠ Behind origin by 3 commit(s)
   Run: cd mx-crm && git pull
```

**Fix:**

```bash
cd mx-crm
git pull origin main
cd ..
git add mx-crm
git commit -m "Updated mx-ingest submodule pointer to latest"
```

---

## Performance

**Typical run time:**

- Quick mode: 0.5-1.0 seconds
- Full mode: 2-4 seconds (includes remote fetch per submodule)

**Optimization:**

- Uses `git -C` to avoid `cd` commands
- Parallel-friendly (could run checks concurrently)
- Silences fetch operations (no network noise)

---

## Technical Details

### Navigation Safety

Uses `git -C <path>` instead of `cd`:

```bash
# Safe — no directory changes
git -C mx-crm status

# Risky — changes working directory
cd mx-crm && git status && cd ..
```

### Error Handling

Every check returns explicit exit codes:

```bash
check_submodule_ahead_behind() {
  # 0 = success (got ahead/behind counts)
  # 2 = detached HEAD
  # 3 = no remote branch
}
```

Caller handles each case appropriately.

---

## Limitations

### 1. Network Required

Remote sync checks require network access to fetch latest refs. Works offline but can't verify ahead/behind.

### 2. No Nested Submodules

Only checks top-level submodules. Doesn't recurse into nested submodules (none exist in MX-hub currently).

### 3. Single Remote

Assumes `origin` remote. Doesn't check alternate remotes.

### 4. Main Branch Assumption

Some fix commands assume `main` branch. Adjust if using different default branch.

---

## Related Tools

- `git submodule status` — Git's built-in status (less detailed)
- `git submodule foreach git status` — Run command in all submodules
- `npm run submodules:update` — Update all submodules to latest
- `scripts/onboard-team-member.sh` — Uses this tool during onboarding

---

## Maintenance

### When to Update

**Add new checks** if new failure modes discovered:

```bash
check_submodule_lfs() {
  # Check for uncommitted LFS files
}
```

**Update branch assumptions** if repository switches default branch:

```bash
# Change from 'main' to 'develop'
git checkout develop  # in fix commands
```

---

*Part of MX OS. The instructions are the program.*
