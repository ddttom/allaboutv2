---
name: cog-id
version: "1.1.0"
description: "Generate, register, and decode cog IDs — obfuscated MD5 hashes that trace documents back to the cog that created them. The namespace-aware identity layer for MX OS."

created: 2026-02-14
modified: 2026-02-14

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary

category: mx-core
status: active
partOf: mx-os
builds-on: [what-is-a-cog]
tags: [cog-id, identity, hash, md5, obfuscation, namespace, x-mx-p-ref, registry, privacy]

audience: [machines, tech]
reading-level: technical
purpose: "Give any AI agent or developer a repeatable workflow for generating cog IDs, registering them in two-level registries (repo + personal), and decoding them. Includes Node.js reference implementation."

mx:
  contentType: "action-doc"
  runbook: "mx exec cog-id"

execute:
  runtime: runbook
  command: mx cog-id
  actions:
    - name: generate
      description: Generate a cog ID from a hierarchical path
      usage: |
        Generate an MD5 hash from a hierarchical path.

        Input format: company/department/cog-name
        Example: MXT/engineering/audit

        Steps:
        1. Accept the hierarchical path from the user
        2. Validate the path has at least two segments (company/cog-name minimum)
        3. Generate the MD5 hash:
           - Use Node.js: require('crypto').createHash('md5').update(path).digest('hex')
           - Or use bash: echo -n "path" | md5
        4. Display the result:
           - Path: MXT/engineering/audit
           - Cog ID: 7f3a8b2c1d4e5f6090812345abcdef67
        5. Auto-register to the repo registry (mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml)
        6. Ask if the user also wants to register it in $MX_HOME (personal registry)

        RULE: The path is case-sensitive. MXT/Engineering/Audit ≠ MXT/engineering/audit.
        RULE: The cog ID is immutable. Once generated, it never changes even if the cog evolves.
      inputs:
        - name: path
          type: string
          required: true
          description: "Hierarchical path: company/department/cog-name"
      outputs:
        - name: cog-id
          type: string
          description: "32-character MD5 hex hash"

    - name: register
      description: Register a cog ID in the repo and/or $MX_HOME decode registry
      usage: |
        Add a cog ID to one or both decode registries.

        Two-level registry system:
        - **Repo registry** (default target): mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml
          Shared with the team. Anyone with repo access can decode.
        - **Personal registry** ($MX_HOME): $MX_HOME/registries/cog-id-registry.yaml
          Personal/external cog IDs. Never committed to a public repo.

        Steps:
        1. Determine target:
           - Default: repo registry (auto-registered on generate)
           - If user says "register to $MX_HOME" or "register personal": $MX_HOME registry
           - If user says "register both": both registries
        2. Read existing registry file (or create empty one)
        3. Check for duplicate: if the cog-id already exists, warn and skip
        4. Add the new entry:
           - cog-id (the hash)
           - path (the hierarchical path that was hashed)
           - cog-name (just the last segment — the cog's name field)
           - registered (ISO 8601 date)
           - registered-by (author or "gestalt")
        5. Write the updated registry
        6. Confirm registration and which registry was updated

        Registry file format (YAML — same schema for both levels):
        ```yaml
        entries:
          - cog-id: "7f3a8b2c1d4e5f6090812345abcdef67"
            path: "MXT/engineering/audit"
            cog-name: "mx-audit"
            registered: "2026-02-14"
            registered-by: "gestalt"
        ```

        RULE: The repo registry is for company/team cog IDs. It lives in the Canon.
        RULE: The $MX_HOME registry is for personal/external cog IDs. It never enters a public repo.
        RULE: Same YAML schema for both — same code reads both.
      inputs:
        - name: cog-id
          type: string
          required: true
          description: "The 32-character MD5 hash"
        - name: path
          type: string
          required: true
          description: "The hierarchical path that was hashed"
        - name: cog-name
          type: string
          required: true
          description: "The cog's name field (last segment of path)"

    - name: decode
      description: Decode a cog ID back to its source path using two-level registry lookup
      usage: |
        Look up a cog ID in the decode registries and return the source path.

        Lookup chain (in order):
        1. **$MX_HOME first** — personal registry takes priority (personal overrides)
        2. **Repo registry second** — mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml

        Steps:
        1. Read $MX_HOME/registries/cog-id-registry.yaml (if it exists)
        2. Search entries for matching cog-id
        3. If found: display path, cog-name, registration date, and source ("personal registry")
        4. If not found in $MX_HOME: read mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml
        5. Search entries for matching cog-id
        6. If found: display path, cog-name, registration date, and source ("repo registry")
        7. If not found in either: report "Unknown cog ID — not in any available registry"

        This is the only way to resolve an x-mx-p-ref value. The hash is one-way.
        Without a registry, the value is meaningless. That's the point.
      inputs:
        - name: cog-id
          type: string
          required: true
          description: "The 32-character MD5 hash to decode"
      outputs:
        - name: path
          type: string
          description: "The hierarchical path (if found)"
        - name: cog-name
          type: string
          description: "The cog name (if found)"

    - name: stamp
      description: Add x-mx-p-ref to a document's frontmatter
      usage: |
        Stamp a document with the cog ID of the cog that created it.

        Steps:
        1. Accept the target file path and the cog ID
        2. Read the target file
        3. If the file has YAML frontmatter:
           - Add x-mx-p-ref: <cog-id> to the frontmatter
           - If x-mx-p-ref already exists, warn and ask whether to overwrite
        4. If the file is HTML:
           - Add <meta name="x-mx-p-ref" content="<cog-id>"> in the <head>
        5. Write the updated file

        This action is called by other action-docs (like mx-audit) during their
        generate-report step to stamp output documents with provenance.

        RULE: x-mx-p-ref is the namespaced attribute. Never use mx-ref (unnamespaced).
        RULE: Native metadata convention — YAML for .md, meta tags for .html.
      inputs:
        - name: file
          type: string
          required: true
          description: "Path to the document to stamp"
        - name: cog-id
          type: string
          required: true
          description: "The cog ID to stamp"

    - name: list
      description: List all registered cog IDs from both registries
      usage: |
        Display all entries from both decode registries.

        Steps:
        1. Read $MX_HOME/registries/cog-id-registry.yaml (if it exists)
        2. Read mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml
        3. Display as a table with source column:
           | Cog ID (first 12 chars) | Path | Cog Name | Registered | Source |
           Source = "personal" or "repo"
        4. If the same cog-id appears in both, show both rows but mark the personal one as "(override)"
        5. Show totals: N personal, M repo, K unique

    - name: bulk-generate
      description: Generate cog IDs for all cogs in the registry that don't have one yet
      usage: |
        Scan the cog registry and generate IDs for any cog missing an x-mx-p-ref.

        Steps:
        1. Read all .cog.md files in mx-canon/MX-Cog-Registry/cogs/
        2. For each cog:
           a. Check if x-mx-p-ref exists in frontmatter
           b. If missing:
              - Construct path: MXT/{category}/{cog-name}
                (category from the cog's category field, e.g. mx-core → core, mx-tool → tool)
              - Generate MD5 hash
              - Register in repo registry (mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml)
              - Add x-mx-p-ref to the cog's frontmatter
        3. Report: N cogs stamped, M already had IDs, K total
---

# Cog ID System

Obfuscated identity for cogs. Every cog gets a unique hash. Every document a cog creates carries that hash. Only the registry holders can decode it.

---

## Why This Exists

Cog-Nova-MX builds cogs — SOPs, audit workflows, review processes, compliance checks. When those cogs produce documents (audit reports, blog reviews, compliance certificates), the output needs to trace back to its source. But the trace must be opaque to outsiders.

`x-mx-p-ref: 7f3a8b2c1d4e5f6090812345abcdef67`

A client sees a hash. They know the document was machine-generated by a specific process. They cannot reverse-engineer which process, which department, or which company structure created it. That's the obfuscation layer.

Internally, the decode registry maps the hash back to `MXT/engineering/audit` — the mx-audit action-doc in Cog-Nova-MX' engineering department. Full provenance for the team. Zero information leakage externally.

---

## The Namespace

This is the first field under the **x-mx-p-** namespace policy (ADR 2026-02-14):

| Prefix | Meaning |
|---|---|
| `x-` | Extension — not part of The Gathering open standard |
| `mx-` | Belongs to Cog-Nova-MX |
| `p-` | Private — value is obfuscated, requires decode registry |
| `ref` | Reference — points to the source cog |

The full field name `x-mx-p-ref` tells any reader: "This is a private MX extension. Don't try to parse the value — you need the registry."

---

## How Cog IDs Work

### Generation

```
Input:  MXT/engineering/audit        (company/department/cog-name)
Hash:   MD5("MXT/engineering/audit")
Output: 7f3a8b2c1d4e5f6090812345abcdef67  (32-character hex)
```

The input is a **hierarchical path**: company, then department, then cog name. Separated by forward slashes. Case-sensitive.

### Registration

Two-level registry system:

- **Repo registry** — `mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml`. Shared with the team. Anyone with repo access can decode. This is the default target when generating a cog ID.
- **Personal registry** — `$MX_HOME/registries/cog-id-registry.yaml`. Personal or external cog IDs. This file never enters a public repository.

Lookup chain: `$MX_HOME` first (personal overrides win), then repo registry.

### Stamping

When a cog produces a document, it stamps the output:

**Markdown:**

```yaml
---
title: "Dotfusion Technical Audit"
x-mx-p-ref: 7f3a8b2c1d4e5f6090812345abcdef67
---
```

**HTML:**

```html
<meta name="x-mx-p-ref" content="7f3a8b2c1d4e5f6090812345abcdef67">
```

Native metadata convention — YAML for markdown, meta tags for HTML. No wrappers.

### Decoding

```
Input:  7f3a8b2c1d4e5f6090812345abcdef67
Lookup: $MX_HOME/registries/cog-id-registry.yaml
Output: MXT/engineering/audit → mx-audit cog → registered 2026-02-14
```

Without the registry, the hash is opaque. That's the design.

---

## Reference Implementation

### Node.js — Generate a cog ID

```javascript
const crypto = require('crypto');

function generateCogId(path) {
  if (!path || !path.includes('/')) {
    throw new Error('Path must have at least two segments: company/cog-name');
  }
  return crypto.createHash('md5').update(path).digest('hex');
}

// Example
const cogId = generateCogId('MXT/engineering/audit');
console.log(cogId); // 32-character hex hash
```

### Bash — Generate a cog ID

```bash
echo -n "MXT/engineering/audit" | md5
```

### Node.js — Registry operations

```javascript
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // or use built-in YAML if available

const MX_HOME = process.env.MX_HOME || path.join(require('os').homedir(), '.mx');
const PERSONAL_REGISTRY = path.join(MX_HOME, 'registries', 'cog-id-registry.yaml');

// Repo registry path — relative to repo root
const REPO_REGISTRY = path.join('mx-canon', 'MX-Cog-Registry', 'registries', 'cog-id-registry.yaml');

function readRegistry(registryPath) {
  if (!fs.existsSync(registryPath)) {
    return { entries: [] };
  }
  return yaml.load(fs.readFileSync(registryPath, 'utf8')) || { entries: [] };
}

function writeRegistry(registryPath, registry) {
  const dir = path.dirname(registryPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(registryPath, yaml.dump(registry, { lineWidth: -1 }));
}

function register(cogId, cogPath, cogName, target = 'repo') {
  const registryPath = target === 'personal' ? PERSONAL_REGISTRY : REPO_REGISTRY;
  const registry = readRegistry(registryPath);
  const existing = registry.entries.find(e => e['cog-id'] === cogId);
  if (existing) {
    console.warn(`Already registered in ${target}: ${cogId} → ${existing.path}`);
    return false;
  }
  registry.entries.push({
    'cog-id': cogId,
    path: cogPath,
    'cog-name': cogName,
    registered: new Date().toISOString().split('T')[0],
    'registered-by': 'gestalt'
  });
  writeRegistry(registryPath, registry);
  return true;
}

// Two-level decode: $MX_HOME first, repo second
function decode(cogId) {
  const personal = readRegistry(PERSONAL_REGISTRY);
  const found = personal.entries.find(e => e['cog-id'] === cogId);
  if (found) return { ...found, source: 'personal' };

  const repo = readRegistry(REPO_REGISTRY);
  const repoFound = repo.entries.find(e => e['cog-id'] === cogId);
  if (repoFound) return { ...repoFound, source: 'repo' };

  return null;
}

function listAll() {
  const personal = readRegistry(PERSONAL_REGISTRY).entries.map(e => ({ ...e, source: 'personal' }));
  const repo = readRegistry(REPO_REGISTRY).entries.map(e => ({ ...e, source: 'repo' }));
  return [...personal, ...repo];
}

module.exports = { generateCogId, register, decode, listAll, readRegistry };
```

---

## Security Model

MD5 is used for **obfuscation**, not cryptographic security. The threat model is:

- **Clients** see `x-mx-p-ref` in reports. They can't trace it to internal cog structure.
- **Competitors** can't reverse-engineer the cog library from published documents.
- **AI crawlers** can't map internal tooling by reading `x-mx-p-ref` values.

MD5 is sufficient because the input space is small (company/department/cog-name paths) and the goal is opacity, not collision resistance. If the obfuscation requirement strengthens, swap MD5 for SHA-256 — the interface stays the same.

---

## Rules

1. **Immutable IDs.** A cog ID is generated once. It never changes, even if the cog evolves.
2. **Two-level registry.** Repo registry (`mx-canon/MX-Cog-Registry/registries/`) for company cog IDs. `$MX_HOME` registry for personal/external cog IDs.
3. **$MX_HOME wins.** Decode checks personal registry first. Personal overrides take priority.
4. **Repo registry is the default target.** Generate auto-registers to the repo. Personal registration is opt-in.
5. **x-mx-p-ref is the canonical field name.** Not `mx-ref`. Not `cog-id`. The namespace prefix is the policy.
6. **Native metadata.** YAML frontmatter for `.md`. Meta tags for `.html`. Comments for code files.
7. **Two-segment minimum.** The path must have at least `company/cog-name`. Department is recommended but optional.
8. **Case-sensitive.** `MXT/Engineering/Audit` and `MXT/engineering/audit` produce different hashes.

---

## For AI Agents

When a user asks you to generate, register, decode, or stamp cog IDs:

1. **Read this action-doc** fresh — it is the single source of truth
2. **Use the reference implementation** for hash generation
3. **Auto-register to repo registry** on generate — it's the default target
4. **Decode checks $MX_HOME first, then repo** — personal overrides win
5. **Never store the $MX_HOME registry in a public repo** — it's the personal decode key
6. **Always use `x-mx-p-ref`** — the namespaced field name, never `mx-ref`
7. **Stamp output documents** when generating reports or other cog outputs
8. **Report registry paths** — when registering cog IDs, report the full absolute path of the updated registry file

**Output Reporting Principle:** When registering cog IDs or updating registry files, always report the full absolute path of the modified registry. This enables traceability and makes it easy to verify where the registration was recorded.

Example:

```
✓ Cog ID registered successfully

Registry updated:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-canon/MX-Cog-Registry/registries/cog-id-registry.yaml

Entry added:
  cog-id: 7f3a8b2c1d4e5f6090812345abcdef67
  path: MXT/engineering/audit
  cog-name: mx-audit
```

Not just "registered to cog-id-registry.yaml" — the full absolute path from root.

---

*The hash is the handle. The registry is the key. The prefix is the policy.*
