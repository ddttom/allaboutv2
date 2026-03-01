---
name: validate-cog
version: 0.1.0
description: Validate cogs against the MX Cog Specification

created: 2026-02-06T13:11:00Z
modified: 2026-02-06T13:11:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [cog-spec]
tags: [validation, cog, spec, meta]

execute:
  runtime: runbook
  command: mx cog validate-cog
  actions:
    - name: check
      description: Validate a cog file against the spec
      usage: mx cog validate-cog check <path>
      inputs:
        - name: path
          type: string
          required: true
          description: Path to cog .md file
      outputs:
        - name: report
          type: object
          description: Validation results with errors/warnings
    
    - name: all
      description: Validate all cogs in a directory
      usage: "mx cog validate-cog all <dir>"
      inputs:
        - name: dir
          type: string
          required: false
          description: "Directory to scan (default: MX/cogs)"
      outputs:
        - name: report
          type: object
          description: Summary of all validations
    
    - name: fix
      description: Auto-fix common issues
      usage: mx cog validate-cog fix <path>
      inputs:
        - name: path
          type: string
          required: true
          description: Path to cog .md file
      outputs:
        - name: changes
          type: array
          description: List of fixes applied

requires:
  bins: []
  cogs: []

mx:
  contentType: "action-doc"
  runbook: "mx exec validate-cog"
  convergence: true
  accessibility: true
  semantic: true
---

# validate-cog

Validate cogs against the MX Cog Specification.

## Purpose

MX eats its own dogfood. This cog validates other cogs to ensure they follow the spec.

## Usage

### Check Single Cog

```bash
mx cog validate-cog check MX/cogs/core/llms-txt.md
```

**Output:**

```json
{
  "valid": true,
  "path": "MX/cogs/core/llms-txt.md",
  "errors": [],
  "warnings": [
    "Consider adding more tags"
  ],
  "score": 95
}
```

### Check All Cogs

```bash
mx cog validate-cog all MX/cogs
```

**Output:**

```json
{
  "total": 12,
  "valid": 12,
  "invalid": 0,
  "cogs": [...]
}
```

### Auto-Fix

```bash
mx cog validate-cog fix MX/cogs/core/my-cog.md
```

## What It Checks

### Must Pass (Errors)

- [ ] Frontmatter present and valid YAML
- [ ] `name` matches filename
- [ ] All required fields present
- [ ] Valid ISO 8601 timestamps
- [ ] At least one action in `execute.actions`
- [ ] Valid semver version

### Should Pass (Warnings)

- [ ] `mx` alignment declared
- [ ] Description under 160 characters
- [ ] At least one tag
- [ ] `refersTo` populated
- [ ] Examples in documentation

## Validation Score

| Criteria | Points |
|----------|--------|
| Required fields | 40 |
| Valid structure | 20 |
| MX alignment | 15 |
| Documentation | 15 |
| Relationships | 10 |

## Related

- [Cog Specification](../../spec/cog-spec.md)

---

**"Design for Both."** ⚡
