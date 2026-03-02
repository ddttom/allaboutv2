---
title: MX Ignore Parser Manual
description: Parse .mxignore and .gitignore files to determine which files should be excluded from MX processing.
author: Tom Cranstoun and Maxine
created: 2026-02-15T00:00:00.000Z
version: "1.0"

mx:
  name: manual-parse-mxignore
  status: active
  category: manual
  tags:
    - manual
    - mxignore
    - gitignore
    - filtering
    - parser
  partOf: mx-maxine-lives
  purpose: Document parse mxignore - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with parse mxignore or understanding its functionality
  contextProvides:
    - Parse .mxignore and .gitignore files to determine which files should be excluded from MX processing.
    - Usage guide and workflow for parse mxignore
    - Troubleshooting and best practices
  refersTo: []
---

# MX Ignore Parser

Determines which files should be excluded from MX processing by combining `.mxignore` and `.gitignore` patterns.

---

## Quick Start

```bash
# Check if a file should be ignored
node scripts/parse-mxignore.js . README.md

# Show all active patterns
node scripts/parse-mxignore.js --patterns .
```

---

## What It Does

Reads `.mxignore` patterns (which extend `.gitignore` patterns) and provides both a CLI tool and a Node.js module for checking whether files should be excluded. Supports standard gitignore syntax: `*`, `**`, `?`, `[]`, `!`.

`.gitignore` patterns load first as the base. `.mxignore` patterns layer on top, overriding and extending.

---

## CLI Usage

```bash
# Single file check
node scripts/parse-mxignore.js /path/to/repo README.md

# Multiple files
node scripts/parse-mxignore.js . README.md CHANGELOG.md docs/guide.md

# Show all patterns (combined and deduplicated)
node scripts/parse-mxignore.js --patterns .

# Skip .gitignore inheritance
node scripts/parse-mxignore.js --no-gitignore . README.md

# Verbose output
node scripts/parse-mxignore.js --verbose . README.md
```

**Exit codes:**

- `0` — file(s) should be included
- `1` — file(s) should be ignored
- `2` — error

---

## Module Usage

```javascript
const { createMxIgnoreFilter, shouldIgnore, filterFilesSync } = require('./scripts/parse-mxignore.js');

// Create a reusable filter
const filter = createMxIgnoreFilter('/path/to/repo');
filter.ignores('node_modules/foo.js'); // true

// One-shot check
const ignored = await shouldIgnore('.', 'outputs/build.html');

// Filter an array of paths
const included = filterFilesSync('.', ['README.md', 'node_modules/x.js']);
```

**Exported functions:**

| Function | Sync? | Purpose |
|----------|:-----:|---------|
| `createMxIgnoreFilter(dir, opts)` | Yes | Create reusable filter object |
| `shouldIgnore(dir, file, opts)` | Async | Check one file |
| `shouldIgnoreSync(dir, file, opts)` | Yes | Check one file (sync) |
| `filterFiles(dir, paths, opts)` | Async | Filter array of paths |
| `filterFilesSync(dir, paths, opts)` | Yes | Filter array (sync) |
| `getIgnorePatterns(dir, opts)` | Yes | Get raw pattern lists |

---

## Dependencies

- Node.js
- `ignore` npm package

---

## Files

| File | Purpose |
|------|---------|
| `scripts/parse-mxignore.js` | Parser — CLI and module |
| `.mxignore` | Project-level MX exclusion patterns |
| `.gitignore` | Base exclusion patterns (inherited) |

---

*Part of MX OS. The instructions are the program.*
