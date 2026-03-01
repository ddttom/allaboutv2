---
name: manual-cog-id
title: Cog ID System — Manual
description: Step-by-step guide for generating, registering, decoding, and stamping cog IDs. The obfuscated identity layer for MX OS.
version: "1.1"
status: active
created: 2026-02-14T00:00:00.000Z
modified: 2026-02-14T00:00:00.000Z
author: Tom Cranstoun and Maxine
category: manual
tags:
  - manual
  - cog-id
  - identity
  - hash
  - obfuscation
  - x-mx-p-ref
  - namespace
partOf: mx-maxine-lives
audience:
  - operators
  - tech
mx:
  purpose: Document cog id - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when working with cog id or understanding its functionality
  ai:
    contextProvides:
      - Step-by-step guide for generating, registering, decoding, and stamping cog IDs. The obfuscated identity layer for MX OS.
      - Usage guide and workflow for cog id
      - Troubleshooting and best practices
refersTo: []
---

# Cog ID Manual

**How to generate, register, and decode cog IDs. For Tom, Maxine, or any AI agent.**

---

## Quick Reference

| Task | What to say |
|------|-------------|
| Generate a cog ID | "/mx-c-cog-id generate MXT/engineering/audit" |
| Register a cog ID | "/mx-c-cog-id register" (follows generate) |
| Decode a cog ID | "/mx-c-cog-id decode 7f3a8b2c..." |
| Stamp a document | "/mx-c-cog-id stamp path/to/file.md" |
| List all IDs | "/mx-c-cog-id list" |
| Bulk-generate for all cogs | "/mx-c-cog-id bulk-generate" |

---

## What Is a Cog ID?

A cog ID is an MD5 hash of a hierarchical path. It traces a document back to the cog that created it — but only if you have the decode registry.

```
MXT/engineering/audit  →  MD5  →  7f3a8b2c1d4e5f6090812345abcdef67
```

The hash appears in documents as `x-mx-p-ref` — a properly namespaced MX-private extension field.

---

## The Namespace Explained

`x-mx-p-ref` breaks down as:

| Segment | Meaning |
|---------|---------|
| `x-` | Extension — not part of The Gathering open standard |
| `mx-` | Belongs to Cog-Nova-MX |
| `p-` | Private — the value is obfuscated |
| `ref` | Reference — points to the source cog |

This is part of the three-level namespace policy (ADR 2026-02-14):

- **Standard fields** — no prefix (The Gathering owns these)
- **MX-public fields** — `x-mx-` prefix (visible to everyone, MX-specific)
- **MX-private fields** — `x-mx-p-` prefix (obfuscated, registry required)

---

## Step-by-Step: Your First Cog ID

### 1. Decide the path

The path is hierarchical: **company/department/cog-name**

| Segment | Description | Example |
|---------|-------------|---------|
| Company | Your organisation's short code | `MXT` (Cog-Nova-MX) |
| Department | The team or function | `engineering`, `sales`, `ops` |
| Cog name | The cog's `name:` field | `audit`, `blog-reviewer` |

Full path: `MXT/engineering/audit`

The department segment is recommended but optional. Minimum is `company/cog-name`.

### 2. Generate the hash

**Using the skill:**

```
/mx-c-cog-id generate MXT/engineering/audit
```

**Using Node.js:**

```javascript
const crypto = require('crypto');
const cogId = crypto.createHash('md5').update('MXT/engineering/audit').digest('hex');
```

**Using bash:**

```bash
echo -n "MXT/engineering/audit" | md5
```

### 3. Register it

Two registries, same format:

- **Repo registry** (default) — `mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml`. Shared with the team.
- **Personal registry** — `$MX_HOME/registries/cog-id-registry.yaml`. Personal/external cog IDs.

Generate auto-registers to the repo registry. To also register personally:

```
/mx-c-cog-id register --personal
```

Registry format (same for both):

```yaml
entries:
  - cog-id: "7f3a8b2c1d4e5f6090812345abcdef67"
    path: "MXT/engineering/audit"
    cog-name: "mx-audit"
    registered: "2026-02-14"
    registered-by: "gestalt"
```

### 4. Stamp a document

When a cog produces output (a report, a review, a certificate), stamp it:

```
/mx-c-cog-id stamp mx-crm/outreach/2026-02-05/dotfusion-report.md
```

This adds `x-mx-p-ref: <hash>` to the document's YAML frontmatter (or a `<meta>` tag for HTML).

### 5. Decode later

```
/mx-c-cog-id decode 7f3a8b2c1d4e5f6090812345abcdef67
```

Returns: `MXT/engineering/audit → mx-audit → registered 2026-02-14 (source: repo)`

The lookup chain checks `$MX_HOME` first (personal overrides), then the repo registry. Without either registry, the hash is meaningless. That's the design.

---

## Bulk Generation

To stamp all cogs in the registry at once:

```
/mx-c-cog-id bulk-generate
```

This scans `mx-canon/MX-Cog-Registry/cogs/`, generates IDs for any cog missing `x-mx-p-ref`, registers them, and stamps the cog files.

Path construction for bulk: `MXT/{category-short}/{cog-name}` where `mx-core` becomes `core`, `mx-tool` becomes `tool`, etc.

---

## Where Things Live

| What | Where |
|------|-------|
| Action-doc (the program) | `mx-canon/MX-Cog-Registry/cogs/cog-id.cog.md` |
| Repo registry (company/team) | `mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml` |
| Personal registry (machine) | `$MX_HOME/registries/cog-id-registry.yaml` |
| Namespace policy ADR | `mx-canon/mx-maxine-lives/thinking/decisions/2026-02-14-attribute-namespace-policy.cog.md` |
| Field dictionary entry | `mx-canon/mx-maxine-lives/registers/FDR/field-dictionary.cog.md` (field: `x-mx-p-ref`) |
| Skill entry point | `.claude/skills/mx-c-cog-id/skill.md` |
| This manual | `mx-canon/mx-maxine-lives/manuals/manual-cog-id.cog.md` |

---

## Security Notes

- **MD5 is for obfuscation, not cryptographic security.** The goal is opacity — making internal structure invisible to outsiders — not collision resistance.
- **Two registries, different visibility.** The repo registry is internal (repo access required). The `$MX_HOME` registry is personal (machine-only, never committed publicly).
- **Cog IDs are immutable.** Once generated, they don't change. Even if the cog evolves, the ID stays the same.
- **Case matters.** `MXT/Engineering/Audit` and `MXT/engineering/audit` produce different hashes.

---

## Common Scenarios

### "I generated a report — how do I stamp it?"

After the report is written, run the stamp action with the cog ID of the cog that created it:

```
/mx-c-cog-id stamp path/to/report.md 7f3a8b2c1d4e5f6090812345abcdef67
```

### "Someone sent me a document with x-mx-p-ref — what is it?"

Run decode with the hash value. If the cog is in your registry, you'll see the source. If not, the document was created by a cog you don't have access to.

### "I want to add cog IDs to all our existing cogs"

Run bulk-generate. It scans the registry, generates IDs for cogs without them, and stamps the frontmatter.

### "Should I include x-mx-p-ref in documents I send to clients?"

Yes — that's the point. The client sees the hash but can't decode it. It provides provenance without exposing internals.

---

*The hash is the handle. The registry is the key. The prefix is the policy.*
