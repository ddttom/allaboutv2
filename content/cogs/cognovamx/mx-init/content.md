---
version: "1.0.0"
description: "The action action-doc that initializes any repository with MX OS conventions — SOUL.md, CLAUDE.md, INSTALLME.md, frontmatter, directory structure."

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os, what-is-mx-environment, what-is-installme]
  tags: [init, onboarding, setup, mx-os, soul, claude, installme, frontmatter, conventions, action]

  audience: agents
  readingLevel: advanced

  contentType: "action-doc"
  runbook: "mx exec mx-init"
  execute:
    runtime: runbook
    command: mx init
    actions:
      - name: audit
        description: Assess a repository's current MX readiness before making changes
        usage: |
          1. Check for existing MX files:
             - SOUL.md — identity document
             - CLAUDE.md — AI agent guidance
             - INSTALLME.md — machine-readable install instructions
             - CHANGELOG.md — change history
             - CONTRIBUTING.md — contribution workflow
             - .gitignore — standard exclusions

          2. Check directory structure:
             - Does the repo have a clear folder structure?
             - Are there files with spaces or special characters in names?

          3. Check frontmatter:
             - For each .md file, check if it has YAML frontmatter (--- delimiters)
             - Report: files WITH frontmatter and files WITHOUT

          4. Check file naming:
             - Are filenames kebab-case?
             - Are there spaces, uppercase, or special characters?

          5. Present audit summary:
             - MX Files: [present] / [missing]
             - Frontmatter: [count with] / [count without]
             - Naming: [compliant count] / [non-compliant count]
             - Overall: READY / PARTIAL / NOT INITIALIZED
             - Recommendations: list what needs to be done
        inputs:
          - name: repo-path
            type: string
            required: false
            description: "Path to repository root (defaults to current directory)"
        outputs:
          - name: audit-report
            type: object
            description: "MX readiness assessment with per-file status"

      - name: init
        description: Initialize a repository with full MX OS conventions
        usage: |
          1. Run the audit action first to understand current state.

          2. Create SOUL.md if missing:
             - Ask the user: What is this repository? What is its purpose?
             - Write SOUL.md with sections: What This Is, Voice, Scope, Constraints
             - Voice should match the repo's purpose (practical for tools, editorial for content, systematic for infrastructure)
             - End with an appropriate MX saying from the phrasebook

          3. Create or update CLAUDE.md if missing or placeholder:
             - Include: First Steps (read SOUL.md, read CONTRIBUTING.md)
             - Include: Repository Purpose (from SOUL.md)
             - Include: Directory structure diagram
             - Include: MX Conventions (frontmatter requirements, file naming, workflow)
             - Include: For AI Agents section (check pwd, follow conventions, add frontmatter)
             - If the repo has coding standards or architecture notes, absorb them into CLAUDE.md

          4. Create INSTALLME.md if missing:
             - Detect prerequisites by scanning package.json, Makefile, Dockerfile, etc.
             - List required tools with check commands and minimum versions
             - List install steps in order
             - Add verify section with test commands
             - Add mx-environment detection block

          5. Create CHANGELOG.md if missing:
             - Add frontmatter (title, description, author, dates, version, status)
             - Add initial entry documenting the MX init

          6. Create .gitignore if missing:
             - Standard exclusions: node_modules/, .env, .DS_Store, *.log, dist/, build/
             - Add IDE exclusions: .idea/, .vscode/, *.swp

          7. Create directory structure if needed:
             - For collaboration repos: incoming/, proposals/, accepted/, published/, chats/
             - For code repos: src/, tests/, docs/
             - Add .gitkeep to empty directories

          8. Rename files if needed:
             - Convert filenames with spaces to kebab-case
             - Remove special characters (!, @, #)
             - Use git mv for tracked files to preserve history
             - Update any internal links that reference old filenames

          9. Audit frontmatter on all .md files:
             - For each file without frontmatter, add:
               title, description, author, created, modified, version, status
             - For files being migrated, add source: field for provenance
             - Use ISO date format (YYYY-MM-DD)

          10. Present summary:
              - Files created: [list]
              - Files renamed: [list with old → new]
              - Frontmatter added: [count]
              - Directories created: [list]
              - Ready for commit: yes/no

          Rules:
          - Never delete existing content — only add, rename, or restructure
          - Preserve git history — use git mv for renames
          - Ask before making destructive changes
          - If a file already has frontmatter, validate it but do not overwrite
          - All dates in ISO format (YYYY-MM-DD)
        inputs:
          - name: repo-path
            type: string
            required: false
            description: "Path to repository root (defaults to current directory)"
          - name: repo-type
            type: string
            required: false
            description: "Type of repo: collaboration, code, documentation, mixed (defaults to auto-detect)"
        outputs:
          - name: init-report
            type: object
            description: "Summary of all changes made during initialization"

      - name: migrate
        description: Copy and triage content from one repo into an MX-initialized repo
        usage: |
          1. Scan the source directory for all .md files.

          2. For each file:
             - Read the content
             - Assess maturity: raw (incoming), structured (proposals), or meta (skip)
             - Meta files to skip: CLAUDE.md, CHANGELOG.md, README.md, markdown-lint guides

          3. Rename to kebab-case:
             - Remove special characters (!, @, #, etc.)
             - Replace spaces with hyphens
             - Convert to lowercase
             - Example: "! More book.md" → "more-book.md"
             - Example: "Vibe coding backend.md" → "vibe-coding-backend.md"

          4. Add or update frontmatter:
             - Ensure title, description, author, created, modified, version, status
             - Add source: field with the original file path
             - Set status to "draft" for incoming, "proposal" for proposals

          5. Copy to destination:
             - Raw/brainstorm files → incoming/
             - Structured/actionable files → proposals/
             - Present triage decisions to user for confirmation

          6. Update CHANGELOG.md in the destination repo with migration details.

          7. Present summary:
             - Files migrated: [count]
             - To incoming/: [count and list]
             - To proposals/: [count and list]
             - Skipped: [count and list with reasons]
             - Renamed: [list with old → new]
        inputs:
          - name: source-path
            type: string
            required: true
            description: "Path to the source directory containing files to migrate"
          - name: dest-path
            type: string
            required: false
            description: "Path to the destination MX repo (defaults to current directory)"
        outputs:
          - name: migration-report
            type: object
            description: "Summary of migrated files with source → destination mapping"

      - name: verify
        description: Verify an MX-initialized repo meets all conventions
        usage: |
          1. Check required files exist:
             - SOUL.md (REQUIRED)
             - CLAUDE.md (REQUIRED)
             - INSTALLME.md (RECOMMENDED)
             - CHANGELOG.md (RECOMMENDED)
             - .gitignore (REQUIRED)

          2. Check all .md files have YAML frontmatter:
             - Minimum fields: title, description, author, created, modified, version, status
             - Report any files missing frontmatter or missing required fields

          3. Check file naming conventions:
             - All files should be kebab-case
             - No spaces or special characters
             - Report violations

          4. Check SOUL.md quality:
             - Has sections: What This Is, Voice, Scope, Constraints
             - Ends with an MX saying

          5. Check CLAUDE.md quality:
             - References SOUL.md in first steps
             - Includes directory structure
             - Includes For AI Agents section

          6. Present verification:
             - Required files: [pass/fail count]
             - Frontmatter: [pass/fail count]
             - Naming: [pass/fail count]
             - SOUL.md: COMPLETE / PARTIAL / MISSING
             - CLAUDE.md: COMPLETE / PARTIAL / MISSING
             - Overall: PASS / NEEDS ATTENTION / FAIL
        inputs:
          - name: repo-path
            type: string
            required: false
            description: "Path to repository to verify (defaults to current directory)"
        outputs:
          - name: verification
            type: object
            description: "Full verification results with per-check pass/fail"
---

# MX Init

This is the tool that turns any repository into an MX-aware workspace. It captures the pattern we use every time a new repo joins the MX ecosystem.

---

## What This Does

When you have a bare repository — or an existing repo that predates MX conventions — this action-doc gives an AI agent the procedure to bring it up to standard. Four actions, one workflow:

1. **Audit** — Assess what exists. What MX files are present? What is missing? What files need frontmatter? What names need fixing? The audit tells you the gap between where the repo is and where it needs to be.

2. **Init** — Close the gap. Create SOUL.md, CLAUDE.md, INSTALLME.md, CHANGELOG.md. Set up the directory structure. Rename files to kebab-case. Add frontmatter to every markdown file. This is the full MX setup.

3. **Migrate** — Move content from another source into the initialized repo. Triage files into the right pipeline stage (incoming vs proposals). Rename to kebab-case. Add provenance tracking with `source:` fields.

4. **Verify** — Confirm the initialization meets all MX conventions. Check files, frontmatter, naming, SOUL.md quality, CLAUDE.md quality. Report pass or fail.

---

## The Pattern

This action-doc was built by doing. We onboarded `mx-collaboration` by hand — copying notes from another repo, triaging content, creating MX files, auditing structure. Then we captured what we did as a repeatable procedure.

That is how MX OS works. Build it. Then describe it. The description becomes the program.

---

## Standards Checklist

Every MX-initialized repo should have:

| File | Purpose | Required |
|------|---------|----------|
| SOUL.md | Identity, voice, scope, constraints | Yes |
| CLAUDE.md | AI agent guidance, conventions, structure | Yes |
| INSTALLME.md | Machine-readable prerequisites and setup | Recommended |
| CHANGELOG.md | Change history | Recommended |
| CONTRIBUTING.md | Contribution workflow | Recommended |
| .gitignore | Standard exclusions | Yes |

Every markdown file should have:

| Field | Example | Required |
|-------|---------|----------|
| title | "Backend Architecture" | Yes |
| description | "Core principles for..." | Yes |
| author | Tom Cranstoun | Yes |
| created | 2026-02-10 | Yes |
| modified | 2026-02-10 | Yes |
| version | "1.0" | Yes |
| status | draft / published / active | Yes |
| source | datalake/knowledge/reference/Starter.md | When migrated |

---

## File Naming Convention

MX repos use kebab-case for all filenames:

- `backend-architecture-guidelines.md` (correct)
- `Backend Architecture Guidelines.md` (incorrect)
- `! Urgent.md` (incorrect)
- `urgent-action-items.md` (correct)

Convention files that live at repo root use UPPERCASE: SOUL.md, CLAUDE.md, README.md, CHANGELOG.md, CONTRIBUTING.md, INSTALLME.md, principles.cog.md, LEARNINGS.md.

---

## For AI Agents

When asked to "initialize this repo with MX" or "onboard this repo":

1. Run **audit** to understand the current state
2. Run **init** to create the MX structure
3. If there is content to move, run **migrate**
4. Run **verify** to confirm everything is correct
5. Commit with a clear message describing what was done
6. **Report all created files** with full absolute paths

The actions section above contains complete instructions for each step. Follow them exactly.

**Output Reporting Principle:** When the init or migrate actions create files, always report the full absolute paths of all created or modified files. This enables traceability and makes it easy to review what was changed.

Example:

```
✓ Repository initialized with MX OS conventions

Files created:
  /Users/tom/Documents/MX/mx-collaboration/SOUL.md
  /Users/tom/Documents/MX/mx-collaboration/CLAUDE.md
  /Users/tom/Documents/MX/mx-collaboration/INSTALLME.md
  /Users/tom/Documents/MX/mx-collaboration/CHANGELOG.md
  /Users/tom/Documents/MX/mx-collaboration/.gitignore

Directories created:
  /Users/tom/Documents/MX/mx-collaboration/incoming/
  /Users/tom/Documents/MX/mx-collaboration/proposals/

Frontmatter added: 12 files
Ready for commit: yes
```

Not just "created SOUL.md" or "files created" — the full absolute paths from root.

---

## Bash Scripts

The following shell commands implement the key checks. These are the building blocks for automation.

### Check for required MX files

```bash
#!/bin/bash
# mx-init-check.sh — Check required MX files exist
REPO_PATH="${1:-.}"
REQUIRED=("SOUL.md" "CLAUDE.md" ".gitignore")
RECOMMENDED=("INSTALLME.md" "CHANGELOG.md" "CONTRIBUTING.md")

echo "=== MX Init Check: $REPO_PATH ==="
for f in "${REQUIRED[@]}"; do
  if [ -f "$REPO_PATH/$f" ]; then
    echo "  [PASS] $f"
  else
    echo "  [FAIL] $f — REQUIRED, missing"
  fi
done
for f in "${RECOMMENDED[@]}"; do
  if [ -f "$REPO_PATH/$f" ]; then
    echo "  [PASS] $f"
  else
    echo "  [WARN] $f — recommended, missing"
  fi
done
```

### Check frontmatter on all markdown files

```bash
#!/bin/bash
# mx-frontmatter-check.sh — Check YAML frontmatter on all .md files
REPO_PATH="${1:-.}"
PASS=0
FAIL=0

for f in $(find "$REPO_PATH" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"); do
  if head -1 "$f" | grep -q "^---$"; then
    PASS=$((PASS + 1))
  else
    echo "  [MISSING] $f"
    FAIL=$((FAIL + 1))
  fi
done
echo "=== Frontmatter: $PASS pass, $FAIL missing ==="
```

### Check kebab-case naming

```bash
#!/bin/bash
# mx-naming-check.sh — Check filenames are kebab-case or UPPERCASE convention
REPO_PATH="${1:-.}"
UPPERCASE_OK="SOUL|CLAUDE|README|CHANGELOG|CONTRIBUTING|INSTALLME|PRINCIPLES|LEARNINGS|TEMPLATE|BRAINSTORM|LICENSE"
VIOLATIONS=0

for f in $(find "$REPO_PATH" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"); do
  basename=$(basename "$f")
  # Skip uppercase convention files
  if echo "$basename" | grep -qE "^($UPPERCASE_OK)\.md$"; then
    continue
  fi
  # Check for spaces or uppercase
  if echo "$basename" | grep -qE '[ A-Z!@#]'; then
    echo "  [RENAME] $f"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done
echo "=== Naming: $VIOLATIONS files need renaming ==="
```

### Rename files to kebab-case

```bash
#!/bin/bash
# mx-rename-kebab.sh — Rename files to kebab-case (preview mode by default)
REPO_PATH="${1:-.}"
DRY_RUN="${2:-true}"
UPPERCASE_OK="SOUL|CLAUDE|README|CHANGELOG|CONTRIBUTING|INSTALLME|PRINCIPLES|LEARNINGS|TEMPLATE|BRAINSTORM|LICENSE"

for f in $(find "$REPO_PATH" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"); do
  basename=$(basename "$f")
  dirpath=$(dirname "$f")

  # Skip uppercase convention files
  if echo "$basename" | grep -qE "^($UPPERCASE_OK)\.md$"; then
    continue
  fi

  # Generate kebab-case name
  newname=$(echo "$basename" | sed 's/^[!@# ]*//; s/ /-/g; s/[^a-zA-Z0-9._-]//g' | tr '[:upper:]' '[:lower:]')

  if [ "$basename" != "$newname" ]; then
    if [ "$DRY_RUN" = "true" ]; then
      echo "  [PREVIEW] $basename → $newname"
    else
      git mv "$f" "$dirpath/$newname" 2>/dev/null || mv "$f" "$dirpath/$newname"
      echo "  [RENAMED] $basename → $newname"
    fi
  fi
done
```

---

*The instructions are the program. You are the runtime.*
