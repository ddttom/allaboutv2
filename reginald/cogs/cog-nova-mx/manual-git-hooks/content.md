---
title: Git Hooks & MX Metadata Tools Manual
description: Installation, validation, metadata generation, inheritance resolution, and attribute indexing for MX .mx.yaml.md files.
author: Tom Cranstoun and Maxine
created: 2026-02-15
modified: 2026-03-02
version: "1.0"

mx:
  status: active
  category: manual
  tags:
    - manual
    - git
    - hooks
    - metadata
    - yaml
    - validation
    - generation
    - inheritance
  partOf: mx-maxine-lives
  audience: humans
  stability: stable
  runbook: Read when working with git hooks or understanding its functionality
  contextProvides:
    - Installation, validation, metadata generation, inheritance resolution, and attribute indexing for MX .mx.yaml.md files.
    - Usage guide and workflow for git hooks
    - Troubleshooting and best practices
  refersTo: []
---

# Git Hooks & MX Metadata Tools

Pre-commit validation, metadata generation, inheritance resolution, and attribute indexing for the MX ecosystem.

---

## Quick Start

Install the git hooks, then commit normally. MX validation runs automatically.

```bash
# Install MX Watch Pattern hooks (recommended)
bash scripts/git-hooks/install-hooks.sh

# Or install the simpler MX validation hook
bash scripts/git-hooks/install-mx-hooks.sh
```

---

## Hook Installers

### install-hooks.sh

Installs the full MX Watch Pattern pre-commit hook. Backs up any existing hook before replacing. Verifies that `mx-watch-lib.sh` is accessible.

```bash
bash scripts/git-hooks/install-hooks.sh
```

After installation, every commit will:

- Auto-update `mx-last-modified` dates
- Convert relative paths to absolute
- Sync documentation `last-sync` dates
- Validate MX metadata completeness
- Warn on stale documentation
- Block commits missing required MX fields

### install-mx-hooks.sh

Lighter installer focused on `.mx.yaml.md` validation only. Offers three options when a pre-commit hook already exists: replace, append, or skip.

```bash
bash scripts/git-hooks/install-mx-hooks.sh
```

To uninstall either hook:

```bash
rm .git/hooks/pre-commit
```

---

## Helper Library

### mx-watch-lib.sh

Shared function library sourced by git hooks. Not run directly.

**Functions:**

| Function | Purpose |
|----------|---------|
| `has_mx_metadata` | Check if a file contains MX metadata |
| `get_mx_field` | Extract a named field from MX metadata |
| `validate_mx_metadata` | Validate required fields are present |
| `convert_relative_to_absolute` | Resolve `../` paths to repo-root-relative |
| `update_mx_last_modified` | Set `mx-last-modified` to today and stage |
| `update_doc_last_sync` | Update `last-sync` in documentation for a code file |
| `detect_stale_docs` | Compare `mx-last-modified` with `last-sync` dates |
| `create_stale_doc_todo` | Append stale documentation warnings to a TODO file |

Usage from another script:

```bash
source scripts/git-hooks/mx-watch-lib.sh
if has_mx_metadata "$file"; then
  validate_mx_metadata "$file"
fi
```

---

## Metadata Generation Tools

All tools live in `scripts/git-hooks/mx/`.

### mx-yaml-generator.js

Generates `.mx.yaml.md` metadata files for all directories. Establishes inheritance chains within each repository boundary. Respects submodule boundaries.

```bash
node scripts/git-hooks/mx/mx-yaml-generator.js [options]
```

| Flag | Effect |
|------|--------|
| `--dry-run` | Show what would be created |
| `--force` | Overwrite existing files |
| `--validate` | Validate existing files only |
| `--dir <path>` | Process a specific directory |
| `--main-only` | Skip submodules |
| `--interactive` | Prompt on ambiguous folders |

**Phases:**

1. **Discovery** — walks directory tree, detects repo boundaries
2. **Generation** — builds YAML frontmatter + markdown narrative per folder

### migrate-mx-yaml.js

One-time migration from old `.mx.yaml` format to `.mx.yaml.md`. Extracts git provenance (creation date, author) and generates markdown narratives.

```bash
node scripts/git-hooks/mx/migrate-mx-yaml.js [--dry-run] [--force]
```

### enhance-from-readme.js

Enriches `.mx.yaml.md` files with information extracted from sibling `README.md` files. Uses safe text replacement — only modifies `description`, `purpose`, and `tags` fields.

```bash
node scripts/git-hooks/mx/enhance-from-readme.js [--dry-run] [--dir <path>]
```

### mx-effective.js

Computes inheritance-resolved metadata. Walks parent-to-child chains and generates `.mx.effective.yaml` files with fully-resolved values. Stops at submodule boundaries.

```bash
node scripts/git-hooks/mx/mx-effective.js [--dry-run] [--dir <path>]
```

**Merge rules:**

- Scalar fields: child overrides parent
- Arrays: merged and deduplicated
- `mx` section: child replaces parent entirely

### index-yaml-attributes.js

Scans all `.mx.yaml.md` and `.mx.effective.yaml` files (including submodules). Produces a comprehensive attribute index with usage counts, inferred types, and example values.

```bash
node scripts/git-hooks/mx/index-yaml-attributes.js
```

Output: `datalake/knowledge/specifications/index-of-yaml-attributes-used.md`

---

## Dependencies

| Tool | Requires |
|------|----------|
| Hook installers | git, bash |
| mx-watch-lib.sh | git, bash |
| mx-yaml-generator.js | Node.js, js-yaml |
| migrate-mx-yaml.js | Node.js, js-yaml |
| enhance-from-readme.js | Node.js |
| mx-effective.js | Node.js |
| index-yaml-attributes.js | Node.js |

---

## Files

| Script | Category | Purpose |
|--------|----------|---------|
| `scripts/git-hooks/install-hooks.sh` | Installation | Full MX Watch Pattern hook |
| `scripts/git-hooks/install-mx-hooks.sh` | Installation | Simple validation hook |
| `scripts/git-hooks/mx-watch-lib.sh` | Library | Shared validation functions |
| `scripts/git-hooks/mx/mx-yaml-generator.js` | Generation | Create .mx.yaml.md files |
| `scripts/git-hooks/mx/migrate-mx-yaml.js` | Migration | .mx.yaml to .mx.yaml.md |
| `scripts/git-hooks/mx/enhance-from-readme.js` | Enhancement | README data into metadata |
| `scripts/git-hooks/mx/mx-effective.js` | Resolution | Inheritance chain computation |
| `scripts/git-hooks/mx/index-yaml-attributes.js` | Audit | Attribute usage index |

---

*Part of MX OS. The instructions are the program.*
