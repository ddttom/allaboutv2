---
name: cog-query
version: "2.1"
description: Unified COG registry management — scan, list, show, find, filter, count, validate, graph, sync, and snapshot the cog registry

created: 2026-02-09T22:00:00Z
modified: 2026-02-23

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: active

category: mx-core
partOf: mx-os
builds-on: [what-is-a-cog, cog-registry]
refersTo: [what-is-mx-os]
tags: [registry, query, index, scan, tools, validation, graph]

mx:
  contentType: "action-doc"
  runbook: "mx exec cog-query"

execute:
  runtime: node
  command: node scripts/cog-tools.js
  actions:
    - name: list
      description: List all cogs found across the repository (including submodules)
      usage: node scripts/cog-tools.js list [--sort name|date|category|type] [--json] [--verbose]

    - name: show
      description: Display full details of a specific COG
      usage: node scripts/cog-tools.js show <name> [--json]

    - name: find
      description: Search cogs by name, tag, description, or category
      usage: node scripts/cog-tools.js find <query> [--json]

    - name: filter
      description: Multi-criteria filtering with --status, --category, --type, --tag, --author, --missing, --has
      usage: node scripts/cog-tools.js filter [--status x] [--category y] [--type z] [--json]

    - name: count
      description: Count COGs matching filter criteria
      usage: node scripts/cog-tools.js count [--status x] [--category y] [--type z] [--json]

    - name: recent
      description: Show COGs modified in last N days
      usage: node scripts/cog-tools.js recent [days] [--json]

    - name: incomplete
      description: List COGs missing recommended fields
      usage: node scripts/cog-tools.js incomplete [--json]

    - name: summarise
      description: Registry statistics — totals by type, category, status, runtime
      usage: node scripts/cog-tools.js summarise [--json]

    - name: discover
      description: Find new, moved, or deleted COGs compared to registry
      usage: node scripts/cog-tools.js discover [--json]

    - name: validate
      description: Schema validation + dependency checks
      usage: node scripts/cog-tools.js validate [--json]

    - name: graph
      description: Query dependency relationships
      usage: node scripts/cog-tools.js graph <subcommand> [target]
      subcommands:
        - depends-on <name> — What does this COG depend on?
        - dependents-of <name> — What COGs depend on this one?
        - circular — Find circular dependencies
        - orphans — Find broken dependency references
        - roots — COGs with no dependencies
        - leaves — COGs nothing depends on

    - name: sync
      description: Update mx-reginald/index.json from scanned files
      usage: node scripts/cog-tools.js sync [--json]

    - name: snapshot
      description: Generate cog-snapshot.cog.md + index.json
      usage: node scripts/cog-tools.js snapshot [--json]

requires:
  bins: [node]
  packages: []
---

# COG Tools

Unified COG registry management tool. Single entry point for all COG operations in the MX ecosystem.

## What It Does

Recursively finds every `.cog.md` file in the repository (including submodules), parses YAML frontmatter, and provides comprehensive registry operations:

**Registry Commands:**

- **list** — Table of all cogs with name, type, category, status, and builds-on
- **show** — Display full details of a specific COG
- **find** — Search by name, tag, description keyword, or category
- **summarise** — Registry statistics grouped by type, category, status, runtime

**Query Commands:**

- **filter** — Multi-criteria filtering (--status, --category, --type, --tag, --author, --missing, --has)
- **count** — Count COGs matching filter criteria
- **recent** — Show COGs modified in last N days
- **incomplete** — List COGs missing recommended fields

**Discovery & Validation:**

- **discover** — Find new, moved, or deleted COGs compared to registry
- **validate** — Schema validation + dependency checks

**Graph Commands:**

- **graph** — Query dependency relationships (depends-on, dependents-of, circular, orphans, roots, leaves)

**Sync Commands:**

- **sync** — Update `mx-reginald/index.json` from scanned files
- **snapshot** — Generate `cog-snapshot.cog.md` + index.json

## Usage

### npm commands

```bash
# Registry
npm run cog:list                     # List all cogs
npm run cog:list -- --sort type      # Sort by type
npm run cog:list -- --verbose        # Show paths
npm run cog:show -- mx-messaging     # Display full details
npm run cog:find -- companion        # Search for "companion"
npm run cog:stats                    # Registry summary

# Query
npm run cog:filter -- --category contact   # Multi-criteria filtering
npm run cog:count -- --type action-doc     # Count matching COGs
npm run cog:recent                         # Recently modified COGs
npm run cog:incomplete                     # COGs missing fields

# Discovery & Validation
npm run cog:discover                 # Find new/moved/deleted
npm run cog:validate                 # Validate all cogs

# Graph
npm run cog:graph                    # Show help for graph commands
npm run cog:graph:circular           # Find circular dependencies
npm run cog:graph:orphans            # Find broken dependencies

# Sync
npm run cog:sync                     # Update index.json
npm run cog:snapshot                 # Generate snapshot
npm run cog:full-sync                # Validate + snapshot
```

### Direct Node.js

```bash
node scripts/cog-tools.js list --sort date
node scripts/cog-tools.js show mx-messaging
node scripts/cog-tools.js find mx-concepts
node scripts/cog-tools.js filter --category contact --status active
node scripts/cog-tools.js count --type action-doc
node scripts/cog-tools.js graph depends-on mx-messaging
node scripts/cog-tools.js validate --json
```

## Key Improvements (v2.1)

- **show** — Display full details of any COG
- **filter** — Multi-criteria filtering with 7 filter options
- **count** — Quick counts matching filter criteria
- **recent** — Track recently modified COGs
- **incomplete** — Find COGs needing metadata enrichment

## Key Improvements (v2.0)

- **Single entry point** — consolidates validate-cogs.js and query.js
- **Scans submodules** — submodule directories are no longer skipped
- **No external dependencies** — uses custom YAML parser (no js-yaml required)
- **Enhanced graph queries** — depends-on, dependents-of, circular detection
- **Discovery** — detects new, moved, and deleted COGs

## Migration

The legacy tools are deprecated but still functional:

| Old | New |
|-----|-----|
| `mx-reginald/scripts/cog-registry/query.js` | `scripts/cog-tools.js` |
| `mx-reginald/scripts/validate-cogs.js` | `scripts/cog-tools.js validate` |

## Why This Matters

The cog registry grows as MX OS grows. Without a programmatic query tool, the only way to understand the registry is to read markdown files manually. This action-doc makes the registry machine-queryable and validates the entire knowledge graph.
