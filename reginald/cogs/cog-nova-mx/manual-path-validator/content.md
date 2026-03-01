---
name: manual-path-validator
title: Path Validation Manual
description: Repository path reference scanner detecting old patterns after restructures. Prevents regression to outdated paths with non-blocking warnings.
author: Tom Cranstoun and Maxine
created: 2026-02-19T00:00:00.000Z
version: "1.0"
status: active
category: manual
tags:
  - manual
  - validation
  - paths
  - regression
  - automation
  - quality
partOf: mx-maxine-lives
mx:
  purpose: Document path validator - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with path validator or understanding its functionality
  ai:
    contextProvides:
      - Repository path reference scanner detecting old patterns after restructures. Prevents regression to outdated paths with non-blocking warnings.
      - Usage guide and workflow for path validator
      - Troubleshooting and best practices
refersTo: []
---

# Path Validation

Scans repository for old path patterns that should be updated to new structure. Helps prevent regression after repository restructuring.

---

## Quick Start

```bash
npm run validate:paths         # Scan and report (non-blocking)
npm run validate:paths:strict  # Exit with error if issues found (for CI)
node scripts/validate-paths.cjs # Direct execution
```

---

## What It Detects

**3 old path patterns:**

| Old Pattern | Correct Pattern | Description |
|-------------|----------------|-------------|
| `ingest/` | `datalake/pipeline/ingest/` | Old flat ingest folder |
| `outputs/` | `mx-outputs/` | Old flat outputs folder |
| `content-lifecycle/` | `datalake/pipeline/content-lifecycle/` | Old lifecycle staging |

---

## Features

### Smart Exclusions

**Automatically skips:**

- `CHANGELOG.md` — Historical records intentionally reference old paths
- `LEARNINGS.md` — Historical lessons may mention old patterns
- `mx-outputs/md/reports/directors/` — Session reports document what happened
- `validation-reports/` — Generated reports (may reference old paths in findings)
- Lock files (`.lock`, `package-lock.json`)
- Binary directories (`node_modules/`, `.git/`, `dist/`, `build/`)

**Why:** Historical documents should preserve original context. Only flag active operational references.

### Grouped Reporting

Groups issues by file for clarity:

```
allaboutv2/README.md
  Line 42: Old ingest/ path should be datalake/pipeline/ingest/
    Found:    See ingest/README.md for details
    Use:      datalake/pipeline/ingest/

  Line 58: Old outputs/ path should be mx-outputs/
    Found:    Build outputs appear in outputs/codex/
    Use:      mx-outputs/
```

### Non-Blocking by Default

**Default mode:** Warns but doesn't fail (exit code 0)

- Use for local development
- Allows intentional historical references
- Requires human judgment

**Strict mode (`--strict`):** Fails with error (exit code 1)

- Use in CI pipelines
- Prevents merging with path issues
- Forces fix before deployment

---

## Files Checked

**Extensions scanned:**

- `.md` — Markdown documentation
- `.js` — JavaScript code
- `.json` — Configuration files
- `.yml`, `.yaml` — YAML configs
- `.sh`, `.bash` — Shell scripts
- `.html` — Web pages
- `.css` — Stylesheets
- `.ts`, `.tsx` — TypeScript code

**Total:** ~3,000 files scanned in typical hub repo

---

## Output

### Clean Repository

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Path Validation Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scanning repository...
Found 3247 files to check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ No path issues found!
Scanned 3247 files in 2.34s
```

### Issues Found

```
⚠  Found 15 path issue(s) in 8 file(s)

scripts/generate-blog.sh
  Line 23: Old outputs/ path should be mx-outputs/
    Found:    OUTPUT_DIR="outputs/blogs"
    Use:      mx-outputs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issues by type:
  ingest-path: 6
  outputs-path: 5
  mx-config-path: 3
  content-lifecycle-path: 1

Total: 15 issues in 8 files
Duration: 2.87s

Next steps:
  1. Review the issues above
  2. Update paths to new structure
  3. Run this check again to verify
```

---

## Usage Patterns

### Local Development

```bash
npm run validate:paths
# Review warnings
# Fix active code references
# Ignore historical document references
```

### Pre-Commit Check

Add to `.claude/git-hooks/pre-commit`:

```bash
echo "Checking for old path references..."
npm run validate:paths
# Non-blocking — warns but allows commit
```

### CI Pipeline

```yaml
# .github/workflows/path-validation.yml
- name: Validate paths
  run: npm run validate:paths:strict
  # Fails build if old paths detected
```

### Post-Restructure Audit

```bash
npm run validate:paths > path-audit-2026-02-19.txt
# Save report
# Review systematically
# Fix operational references
```

---

## Test Results (2026-02-19)

**Scan after morning restructure:**

- Files scanned: 3,247
- Issues found: 909 references in 203 files
- Duration: 2.87s

**Analysis:**

- ~850 intentional (CHANGELOG, reports, historical docs)
- ~45 operational (scripts, workflows, active docs)
- ~14 edge cases (vocabulary manifest, ADRs)

**Action:** Fixed 13 operational files, committed, re-ran validator. Remaining issues documented as intentional.

---

## How It Works

### Pattern Detection

Uses regex with negative lookahead:

```javascript
{
  pattern: /\bingest\//g,
  skipIf: /packages\/mx-ingest\//,  // Don't flag if already correct
  correct: 'datalake/pipeline/ingest/'
}
```

### File Walking

Recursive directory traversal:

1. Read directory entries
2. Skip excluded patterns (node_modules, .git)
3. Filter by extension
4. Read file contents
5. Apply pattern checks
6. Group results by file

### Performance

- **Streaming:** Processes files as found (no full load)
- **Early exit:** Skips binary directories immediately
- **Caching:** None needed (fast enough without)
- **Typical speed:** 1,000-1,500 files/second

---

## Configuration

### Exclude Patterns (in code)

```javascript
const EXCLUDE_PATTERNS = [
  /CHANGELOG\.md$/,        // Historical records
  /LEARNINGS\.md$/,        // Historical records
  /management\/reports\//, // Session reports
  /validation-reports\//,  // Generated reports
  /\.lock$/,               // Lock files
];
```

### Check Extensions

```javascript
const CHECK_EXTENSIONS = new Set([
  '.md', '.js', '.json', '.yml', '.yaml',
  '.sh', '.bash', '.html', '.css', '.ts', '.tsx',
]);
```

---

## Integration

### npm Scripts

```json
{
  "scripts": {
    "validate:paths": "node scripts/validate-paths.cjs",
    "validate:paths:strict": "node scripts/validate-paths.cjs --strict"
  }
}
```

### Command Line Options

```bash
--strict     # Exit with error code 1 if issues found
--verbose    # Show detailed scanning progress
--help       # Display usage information
```

---

## Maintenance

### When to Update

**Add new patterns** when repository structure changes:

```javascript
PATH_PATTERNS.push({
  name: 'new-folder-path',
  pattern: /\bold-folder\//g,
  correct: 'new-structure/folder/',
  description: 'Old folder/ path should be new-structure/folder/',
  skipIf: /new-structure\/folder\//,
});
```

**Update exclusions** if new historical document types added.

---

## Related Tools

- `scripts/check-submodules.sh` — Submodule health checking
- `npm run validate:cogs` — YAML frontmatter validation
- `npm run lint:md` — Markdown linting

---

*Part of MX OS. The instructions are the program.*
