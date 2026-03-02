---
name: manual-team-onboarding
title: Team Member Onboarding Manual
description: Interactive onboarding wizard for non-technical team members joining MX-ingest. Automated setup, access testing, and guided workflow introduction.
author: Tom Cranstoun and Maxine
created: 2026-02-19T00:00:00.000Z
version: "1.0"
status: active
category: manual
tags:
  - manual
  - onboarding
  - team
  - mx-ingest
  - automation
  - submodules
partOf: mx-maxine-lives
purpose: Document team onboarding - usage, workflow, and best practices
audience: human
stability: stable
runbook: Read when working with team onboarding or understanding its functionality
contextProvides:
  - Interactive onboarding wizard for non-technical team members joining MX-ingest. Automated setup, access testing, and guided workflow introduction.
  - Usage guide and workflow for team onboarding
  - Troubleshooting and best practices
refersTo: []
---

# Team Member Onboarding

Interactive wizard that enables non-technical team members (Eleanor, Scott) to independently set up their environment and contribute to MX-ingest business documents.

---

## Quick Start

```bash
npm run onboard                # Run interactive onboarding wizard
./scripts/onboard-team-member.sh   # Direct script execution
```

---

## What It Does

**Automated setup flow:**

1. **Prerequisites check** — Verifies Git installation, version, user.name, user.email, optional GitHub CLI
2. **Repository setup** — Detects existing MX-hub or offers to clone to user-specified location
3. **Submodule initialization** — Initializes only MX-ingest submodule, verifies expected folder structure
4. **Access testing** — Creates test file, commits, pushes, cleans up automatically (validates write access)
5. **Documentation** — Opens onboarding guide in browser
6. **Summary** — Displays quick start commands and next steps

**Duration:** 5-10 minutes (was 30+ minutes manual)

---

## Features

### Safety Checks

- Validates Git installation and configuration before proceeding
- Detects if already in correct repository location
- Checks submodule structure matches expectations
- Fails gracefully with clear error messages

### Automatic Access Testing

Creates a timestamped test file, commits it, pushes to origin, then removes it and updates the submodule pointer. If any step fails, provides specific remediation instructions (e.g., "Ask Tom to grant you write access").

### Color-Coded Output

- 🟢 Green checkmarks for success
- 🟡 Yellow warnings for optional items
- 🔴 Red errors for blocking issues
- 🔵 Blue info for context

### Interactive Prompts

- "Would you like to clone MX-hub now?"
- "Where should I clone MX-hub?" (default: ~/Documents/MX)
- "Would you like to open the guide in your browser?"
- "Push submodule pointer update to main repo?"

---

## Files

| File | Purpose |
|------|---------|
| `scripts/onboard-team-member.sh` | 450-line interactive wizard (executable) |
| `docs/guides/for-humans/working-with-mx-ingest.md` | 650-line onboarding guide (opened by wizard) |
| `package.json` → `npm run onboard` | Easy access via npm |

---

## Output Example

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Checking Prerequisites
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Git installed (version 2.39.2)
✓ GitHub CLI installed
✓ Git user name configured: Eleanor Cranstoun
✓ Git user email configured: eleanor@example.com

✓ All prerequisites met!
```

---

## Use Cases

### New Team Member Onboarding

Eleanor joins the team. Runs `npm run onboard`, answers prompts, has full access in 10 minutes. No manual configuration required.

### Re-setup After Machine Wipe

Scott gets new laptop. Runs onboarding script, selects existing clone location detection, verifies access still works.

### Testing Repository Access

Advisory board member needs temporary access. Onboarding script validates their permissions work end-to-end.

---

## Integration

### Workflow Guide

Opens `docs/guides/for-humans/working-with-mx-ingest.md` in browser:

- 5-step workflow: Clone → Edit → Commit → Push → Verify
- Folder reference (where to put meeting notes, proposals, frameworks)
- Common questions (conflicts, multiple files, mistakes)
- Keyboard shortcuts
- Command reference

### Submodule Focus

Only initializes `mx-crm/` (not all submodules). Business team doesn't need mx-outputs, allaboutv2, etc.

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Git is not installed" | Missing Git | Install from <https://git-scm.com/downloads> |
| "Git user name not configured" | Missing config | Run `git config --global user.name "Your Name"` |
| "Failed to clone repository" | No GitHub access | Ask Tom to add to MX-Technologies org |
| "Push failed - you may not have write access" | No repo permissions | Ask Tom to grant write access to MX-ingest |
| "Failed to initialize submodule" | No submodule access | Ask Tom to grant access to MX-ingest repo |

---

## Technical Details

### Functions

```bash
check_prerequisites()    # Validates Git, config, GitHub CLI
setup_repository()       # Clones or detects existing repo
setup_submodule()        # Initializes MX-ingest only
test_access()           # Creates, commits, pushes, removes test file
open_documentation()    # Opens guide in system browser
print_summary()         # Final instructions and next steps
```

### Safety Features

- Never runs destructive commands without confirmation
- Updates submodule pointer after test cleanup (keeps main repo sync)
- Provides undo instructions for reversible operations
- Fails fast with clear error messages

---

## Maintenance

### When to Update

- Repository structure changes (folder reorganization)
- Workflow changes (new steps in commit process)
- Permission model changes (new access control requirements)
- Documentation location changes

### Testing

Run through full flow on fresh machine or fresh directory:

1. No existing clone
2. Existing clone (detection path)
3. Missing permissions (error handling)

---

*Part of MX OS. The instructions are the program.*
