---
version: "1.0.0"
description: "The meta-registry — knows where every registry is, what it indexes, and how to query it."
created: 2026-02-11
modified: 2026-03-03
author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published
  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, building-action-docs]
  tags: [registry, meta-registry, catalog, index, inventory, governance, audit, self-maintaining]
  audience: agents
  readingLevel: advanced
  execute:
    runtime: runbook
    command: mx registries
    actions:
      - name: list
        description: List all known registries with their location, purpose, and query method
        usage: |
          1. Read the registry catalog below (the `## Registry Catalog` section of this cog)
          2. Present all registries as a table:
             | # | Registry | Indexes | Location | Format | Query Method | Status |
             |---|----------|---------|----------|--------|-------------|--------|
          3. For each registry, show:
             - Name
             - What it indexes (cogs, content, contacts, etc.)
             - File path(s) from repo root
             - Format (JSON, markdown, action-doc, folder structure)
             - How to query it (npm script, action-doc action, manual)
             - Status (active, deprecated)
          4. Show total count at bottom: "N registries tracked (X active, Y deprecated)"
        outputs:
          - name: registry-list
            type: array
            description: "All known registries with metadata"
      - name: lookup
        description: Find which registry manages a given type of thing
        usage: |
          1. Accept a query from the user — what are they looking for?
             Examples: "cogs", "contacts", "blog posts", "skills", "file pairs", "metadata attributes"
          2. Search the registry catalog for registries that index that type of thing
             - Match against the "indexes" field
             - Also match against tags and description
          3. Return the matching registry(ies) with:
             - Registry name
             - Location
             - How to query it
             - Example query command
          4. If no match found, suggest running the `scan` action to discover new registries
        inputs:
          - name: query
            type: string
            required: true
            description: "What type of thing are you looking for? e.g. 'cogs', 'contacts', 'blog posts'"
        outputs:
          - name: matching-registries
            type: array
            description: "Registries that index the queried type"
      - name: scan
        description: Scan the repo to discover registries not yet tracked in the catalog
        usage: |
          1. Search the repo for potential registries using these patterns:
             a. FILES named like registries:
                - **/index.json (excluding node_modules, .git)
                - **/registry*.{json,md,yaml}
                - **/catalog*.{json,md,yaml}
                - **/inventory*.{json,md,yaml}
                - **/*-index.{json,md}
                - **/*-snapshot*.{json,md}
             b. DIRECTORIES that function as registries:
                - Folders containing multiple .cog.md files (cog collections)
                - Folders containing multiple profile files
                - Folders with an index file and sibling data files
             c. FILES with registry-like frontmatter:
                - YAML frontmatter containing "registry", "catalog", or "index" in title or description
                - Action-docs with actions like "list", "search", "query"
             d. NPM SCRIPTS:
                - Read package.json for scripts containing "registry", "list", "sync", "query"
          2. For each candidate found:
             - Extract: path, format, what it appears to index
             - Check if it's already in the registry catalog
             - If new: flag as "DISCOVERED — not yet tracked"
          3. Present results:
             **Known registries:** (already tracked)
             [list with checkmarks]
             **Discovered registries:** (new, not yet tracked)
             [list with details]
             **Recommended action:** Add discovered registries to the catalog
          4. If discovered registries are found, offer to update the catalog:
             - "I found N new registries. Should I add them to the registry-of-registries catalog?"
             - If yes: update the Registry Catalog section of this cog file
        outputs:
          - name: scan-results
            type: object
            description: "Known and discovered registries with recommendations"
      - name: update
        description: Add a new registry to the catalog or update an existing one
        usage: |
          1. Accept registry details from the user or from a scan result:
             - name (required)
             - indexes (what does it catalog?)
             - location (file path from repo root)
             - format (JSON, markdown, action-doc, etc.)
             - query-method (npm script, cog action, manual)
             - status (active, deprecated)
             - npm-scripts (if any)
          2. Read this cog file (registry-of-registries.cog.md)
          3. Find the `## Registry Catalog` section
          4. Add the new registry entry following the existing format:
             ```
             ### [Registry Name]
             - **Indexes:** [what it catalogs]
             - **Location:** `[file path]`
             - **Format:** [JSON/markdown/action-doc/folder]
             - **Query method:** [how to query]
             - **npm scripts:** [if any]
             - **Status:** [active/deprecated]
             ```
          5. Update the `modified` date in this cog's YAML frontmatter to today
          6. Report: "Added [name] to the registry of registries. Total: N registries tracked."
          This is how the cog maintains itself. The scan action discovers. The update action records.
        inputs:
          - name: registry-name
            type: string
            required: true
            description: "Name of the registry to add or update"
          - name: registry-details
            type: object
            required: true
            description: "Registry metadata: indexes, location, format, query-method, status"
        outputs:
          - name: update-result
            type: string
            description: "Confirmation of update with new total count"
      - name: dashboard
        description: One-screen overview of all registries with health status
        usage: |
          1. Read the registry catalog
          2. For each active registry, check health:
             - Does the file/directory still exist at the recorded location?
             - If JSON: is it valid JSON?
             - If markdown with frontmatter: does it have valid YAML?
             - If npm scripts: do the scripts exist in package.json?
          3. Present dashboard:
             ## Registry Dashboard
             **Total:** N registries (X active, Y deprecated)
             | Registry | Indexes | Health | Last Updated | Items |
             |----------|---------|--------|-------------|-------|
             | Cog Registry | cogs | ✓ healthy | 2026-02-11 | 52 |
             | Content Registry | demos, blogs | ✓ healthy | 2026-02-06 | 4 |
             | MX Contacts | people | ✓ healthy | 2026-02-10 | 6 |
             | ...
             **Health key:**
             - ✓ healthy — file exists, valid format
             - ⚠ warning — file exists but has issues
             - ✗ missing — file not found at recorded location
          4. If any registries have health issues, list specific problems
          5. Suggest: "Run /mx-c-registries scan to discover any untracked registries"
        outputs:
          - name: dashboard
            type: object
            description: "Overview of all registries with health status"
    contentType: "action-doc"
    runbook: "mx exec registry-of-registries"
    semantic: true
    convergence: true
    accessibility: true
---

# The Registry of Registries

The meta-registry. One place that knows where every registry is, what it indexes, and how to query it.

---

## Why This Exists

MX OS accumulates registries. The cog registry indexes cogs. The content registry tracks demos and blogs. The contacts registry manages people. Skills live in their own folder. File pairs have a watch index. Metadata attributes had their own registry (now deprecated).

Each registry works. None of them knew about the others. If you wanted to find "where is the thing that tracks contacts?" you had to already know the answer.

This cog solves that. It's the registry that indexes registries. Ask it "what registries exist?" and it tells you. Ask it "where do I find blog post tracking?" and it points you to the content registry. Ask it to scan the repo and it finds registries you forgot to register.

The key feature: **it maintains itself.** The `scan` action discovers new registries. The `update` action adds them to the catalog. The catalog is part of this cog file. When you update the catalog, you update the cog. The instructions and the data live together.

---

## Registry Catalog

### Cog Registry

- **Indexes:** All .cog.md files — info-docs and action-docs across canon, reginald, and other locations
- **Location:** `mx-reginald/index.json` (machine-readable), `mx-reginald/cog-snapshot.cog.md` (human-readable)
- **Format:** JSON index + markdown snapshot
- **Query method:** npm scripts — `npm run cog:list`, `cog:find`, `cog:stats`, `cog:graph`, `cog:sync`, `cog:snapshot`
- **npm scripts:** cog:list, cog:find, cog:stats, cog:graph, cog:sync, cog:snapshot
- **Status:** active
- **Notes:** Auto-generated from filesystem scan of .cog.md files. Dual format: JSON for machines, snapshot cog for humans.

### Cog Registry Cog

- **Indexes:** Same cog collection, but as an executable query tool
- **Location:** `scripts/cogs/cog-registry.cog.md`
- **Format:** Action-doc (runtime: runbook)
- **Query method:** Action-doc actions — list, search, graph, validate, register
- **npm scripts:** (uses the same npm scripts as above)
- **Status:** active
- **Notes:** Executable version of the cog registry. Agents invoke this to query, validate, and register cogs.

### Content Registry

- **Indexes:** Demos, blogs, websites — tracked through the content workflow (draft → in-review → published → deployed)
- **Location:** `datalake/registries/content/content-registry.json`
- **Format:** JSON with content entries, state history, deployment paths
- **Query method:** npm scripts — `npm run registry:list`, `registry:query`, `registry:add`, `registry:validate`, `registry:stats`
- **npm scripts:** registry:list, registry:query, registry:add, registry:update, registry:validate, registry:stats
- **Status:** active
- **Notes:** Centralised to `datalake/registries/content/` on 2026-02-27.

### MX Contacts

- **Indexes:** People, relationships, messages, priorities
- **Location:** `mx-crm/contacts/` + per-contact folders
- **Format:** Action-doc + folder structure (per-contact .cog.md files with messages/ and archive/ subdirectories)
- **Query method:** Action-doc actions — list, report, priorities, next, dashboard, add-contact, archive, restructure
- **npm scripts:** none (invoked via cog actions)
- **Status:** active
- **Notes:** Hierarchical registry — the action-doc reads the folder structure as its data source.

### Skills Collection

- **Indexes:** Claude Code skills — entry points for action-docs and system commands
- **Location:** `.claude/skills/*/skill.md`
- **Format:** Markdown files in per-skill directories
- **Query method:** List `.claude/skills/` directory; each subfolder is a skill
- **npm scripts:** none (Claude Code native)
- **Status:** active
- **Notes:** Two namespaces: `mx-c-` (cog-backed commands) and `mx-` (system commands). Template at `.claude/skills/_mx-c-template/skill.md`.

### MX Watch Index

- **Indexes:** File pairs implementing the MX Watch Pattern for documentation-code synchronization
- **Location:** `datalake/registries/mx-watch/mx-watch-index.md`
- **Format:** Markdown with structured tables
- **Query method:** Manual — read the file; also referenced via `mx-watch-registry` field in watched files
- **npm scripts:** none (hook-driven)
- **Status:** active
- **Notes:** Centralised to `datalake/registries/mx-watch/` on 2026-02-27.

### MX Attributes Registry (DEPRECATED)

- **Indexes:** MX metadata attributes and patterns
- **Location:** `datalake/registries/attributes/mx-attributes-registry.md`
- **Format:** Markdown
- **Query method:** Manual — read the file
- **npm scripts:** none
- **Status:** deprecated (since 2026-02-03)
- **Notes:** Superseded by Appendix L: Proposed AI Metadata Patterns. Centralised to `datalake/registries/attributes/` on 2026-02-27.

### Content Registry Manual

- **Indexes:** Documentation for the content registry schema and operations
- **Location:** `datalake/registries/content/content-registry-manual.md`
- **Format:** Markdown documentation
- **Query method:** Manual — read the file
- **npm scripts:** none
- **Status:** active
- **Notes:** Centralised to `datalake/registries/content/` on 2026-02-27.

---

## Self-Maintenance Protocol

This cog maintains itself through two mechanisms:

1. **Scan discovers.** The `scan` action searches the repo for anything that looks like a registry — index files, catalog files, collections, npm scripts. It compares what it finds against the catalog above and flags anything new.

2. **Update records.** The `update` action adds new entries to the Registry Catalog section of this file. The cog's modified date is updated. The catalog grows as the system grows.

The rule: if a new registry is created anywhere in the repo, the next `scan` will find it. The next `update` will record it. No registry goes untracked for long.

**For AI agents:** When you create a new registry or indexing system anywhere in MX OS, run `/mx-c-registries update` to register it here. When in doubt, run `/mx-c-registries scan` to check for untracked registries.

---

## For AI Agents

When a user asks about registries, catalogs, or indexes:

1. Read this cog
2. Run the appropriate action (list for overview, lookup for specific queries, dashboard for health)
3. If the user creates a new registry, remind them to register it here

Default behaviour when invoked with no arguments: run **list** to show all known registries.

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Registry entry added successfully

Output:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-canon/MX-Registries/registry-of-registries.cog.md (updated)
```

Not just "Registry updated" or "registry-of-registries.cog.md modified" — the full absolute path from root.

---

*Every registry tracked. Every index indexed. The meta-registry that maintains itself.*
