---
title: MX Reginald — Manual
description: How to use the Machine eXperience Engine including cog listing, execution, categories, and building guidance.
author: Tom Cranstoun and Maxine
created: 2026-02-06
modified: 2026-02-23
version: "1.3"

mx:
  status: active
  license: proprietary
  category: manual
  tags:
    - manual
    - reginald
    - engine
    - cog-query
  partOf: mx-maxine-lives
  audience: humans
  stability: stable
  runbook: "mx exec manual-mx-reginald"
  contextProvides:
    - How to use the Machine eXperience Engine including cog listing, execution, categories, and building guidance.
    - Usage guide and workflow for mx reginald
    - Troubleshooting and best practices
  refersTo: []
---

# MX Manual

How to use the Machine eXperience Engine.

---

## What is MX?

MX is an engine that runs on cogs. Each cog is a self-describing module that does one thing well. Together, they power the Robot-First Web.

**Engine:** MX (Machine eXperience Engine)  
**Cogs:** Modular capabilities  
**Fuel:** Content, data, user intent  
**Output:** Robot-First experiences  

---

## Using Cogs

### Current Commands (Available Today)

All COG operations are consolidated in `scripts/cog-tools.js`. These npm commands work in the MX-Hub repository right now:

```bash
# Registry commands
npm run cog:list                  # List all cogs with name, type, category, builds-on
npm run cog:list -- --sort date   # Sort by modification date
npm run cog:list -- --verbose     # Show file paths
npm run cog:find -- <term>        # Search cogs by name, tag, or description
npm run cog:show -- <name>        # Display full details of a specific COG
npm run cog:stats                 # Show totals by type, category, status, runtime

# Query commands
npm run cog:filter                # Multi-criteria filtering (see filter options below)
npm run cog:count                 # Count COGs matching filter criteria
npm run cog:recent                # Show COGs modified in last 7 days
npm run cog:recent -- 14          # Show COGs modified in last 14 days
npm run cog:incomplete            # List COGs missing recommended fields

# Discovery & validation
npm run cog:discover              # Find new, moved, or deleted COGs
npm run cog:validate              # Schema + dependency validation

# Graph commands
npm run cog:graph                 # Help for graph commands
npm run cog:graph:circular        # Find circular dependencies
npm run cog:graph:orphans         # Find broken dependency references
npm run cog:graph:roots           # COGs with no dependencies
npm run cog:graph:leaves          # COGs nothing depends on

# Sync commands
npm run cog:sync                  # Update mx-reginald/index.json
npm run cog:sync-and-commit       # Sync + auto-commit with standard message
npm run cog:snapshot              # Generate cog-snapshot.cog.md + index.json
npm run cog:full-sync             # Validate + snapshot

# Execute cogs
npm run cog:run                   # Execute a cog's action block
```

**Filter options (for filter/count commands):**

```bash
--status <value>     # Filter by status (active, draft, published, etc.)
--category <value>   # Filter by category
--type <value>       # Filter by type (info-doc, action-doc)
--tag <value>        # Filter by tag
--author <value>     # Filter by author (partial match)
--missing <field>    # Find COGs missing a field
--has <field>        # Find COGs that have a field
```

**Direct node.js usage:**

```bash
node scripts/cog-tools.js list --sort date
node scripts/cog-tools.js find mx-concepts
node scripts/cog-tools.js graph depends-on mx-messaging
node scripts/cog-tools.js graph dependents-of what-is-a-cog
node scripts/cog-tools.js validate --json
```

**Examples:**

```bash
# Find all cogs related to blogs
npm run cog:find -- blog

# Show full details of a specific COG
npm run cog:show -- mx-messaging

# Show registry statistics
npm run cog:stats

# Validate all cogs in the registry
npm run cog:validate

# Find what depends on a specific cog
node scripts/cog-tools.js graph dependents-of mx-messaging

# Regenerate the registry index after adding/editing cogs
npm run cog:sync

# Filter COGs by category and status
npm run cog:filter -- --category contact --status active

# Count action-docs
npm run cog:count -- --type action-doc

# Find recently modified COGs
npm run cog:recent -- 14

# Find COGs missing author field
npm run cog:filter -- --missing author
```

### Future Interface (Planned)

The ultimate MX CLI will provide a unified `mx cog` interface:

```bash
# Future commands (not yet implemented)
mx cog list
mx cog list --category core
mx cog list --tag validation
mx cog <name> --help
mx cog <name> --info
mx cog <name> <action> [arguments]
```

**Aspirational examples:**

```bash
# Generate llms.txt for a website
mx cog llms-txt generate https://example.com

# Validate Schema.org markup
mx cog schema validate https://example.com

# Test documentation clarity
mx cog clarity test ./README.md

# Check pricing for errors
mx cog pricing validate https://shop.example.com
```

This interface will be implemented as MX OS matures. For now, use the `npm run cog:*` commands above.

---

## Cog Categories

### Core (`mx-core`)

Cogs focused on Robot-First Web principles:

- llms-txt — AI guidance files
- schema — Structured data
- clarity — Documentation quality
- pricing — Data validation

### Capability

General capabilities:

- email — Send/receive email
- calendar — Calendar management
- browser — Web automation
- (more to come)

### Integration

External service integrations:

- (future cogs)

---

## Cog Anatomy

Every cog is a `.md` file with:

1. **YAML frontmatter** — Machine-readable metadata
2. **Markdown body** — Human-readable documentation

```markdown
---
name: example
version: 0.1.0
description: What this cog does
created: 2026-02-06T12:00:00Z
modified: 2026-02-06T12:00:00Z
author: MX

execute:
  command: mx cog example
  actions:
    - name: action-name
      description: What this action does
      usage: mx cog example action-name [args]
---

# example

Human-readable documentation here.
```

---

## The MX Section

Cogs declare their alignment with MX principles:

```yaml
mx:
  convergence: true    # Benefits humans and machines
  accessibility: true  # Improves accessibility
  semantic: true       # Uses semantic structures
```

---

## Building Cogs

See [Cog Specification](../spec/cog-spec.md) for the full spec.

See [Cog Guide](cog-guide.md) for a tutorial.

---

## Getting Help

```bash
mx --help
mx cog --help
mx cog <name> --help
```

---

**"Design for machines. Benefit humans. Advance both."** ⚡
