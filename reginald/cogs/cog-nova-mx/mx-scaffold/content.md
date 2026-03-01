---
name: mx-scaffold
version: "1.0"
description: Create new MX-OS shell scripts with correct structure, metadata, and alias registration. The canonical pattern for extending mx-os.

created: 2026-02-25
modified: 2026-02-25

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [script-helper, cog-unified-spec]
builds-on: [what-is-mx-os, script-helper]
tags: [scaffold, template, generator, create, mx-os, shell, bash]

audience: developers
reading-level: technical
purpose: Enable AI agents and humans to create new mx.* scripts that conform to the MX-OS pattern — correct metadata frontmatter, colour module, help flag, header, and alias registration

execute:
  runtime: runbook
  command: mx exec mx-scaffold
  actions:
    - name: create
      description: Create a new mx.* script from the canonical template
      usage: >
        To create a new mx.* script:
        1. Ask the human for: script name (e.g. "myutil"), one-line description, category (mx-core/mx-dev/mx-network/mx-ai/mx-utils), tags, dependencies
        2. Read the canonical template: mx-canon/mx-os/deliverables/mx-script-template.sh
        3. Substitute all {{PLACEHOLDER}} markers with the provided values:
           - {{TITLE}} → "mx.<name> — <description>" (e.g. "mx.myutil — Short description")
           - {{TODAY}} → current date in YYYY-MM-DD format
           - {{DESCRIPTION}} → one-line description
           - {{CATEGORY}} → chosen category
           - {{TAGS}} → comma-separated tags
           - {{DEPS}} → comma-separated dependencies (empty if none)
           - {{SCRIPT_NAME}} → "mx.<name>" (e.g. "mx.myutil")
           - {{SHORT_DESC}} → description text after the dash in title
           - {{UPPER_NAME}} → capitalised short name (e.g. "Myutil")
        4. Write the result to: $MX_BIN_DIR/mx.<name>.sh (default: scripts/bin/)
        5. Make it executable: chmod +x
        6. Add alias to ~/.zsh/config/aliases.zsh:
           alias mx.<name>="$MX_BIN_DIR/mx.<name>.sh"
        7. Report the full absolute path of every file created or modified
      inputs:
        - name: name
          type: string
          required: true
          description: Short script name without mx. prefix (e.g. "myutil" → creates mx.myutil.sh)
        - name: description
          type: string
          required: true
          description: One-line description of what the script does
        - name: category
          type: string
          required: false
          description: "mx-core | mx-dev | mx-network | mx-ai | mx-utils (default: mx-utils)"
        - name: tags
          type: string
          required: false
          description: Comma-separated tags relevant to the script's function
        - name: dependencies
          type: string
          required: false
          description: Comma-separated tool dependencies (e.g. "fzf, bat, jq")
      outputs:
        - name: script-path
          type: string
          description: Full absolute path to the created script
        - name: alias-added
          type: string
          description: The alias line added to aliases.zsh

    - name: list
      description: List all existing mx.* scripts with their metadata
      usage: >
        List all mx.* scripts in the bin directory:
        1. Find all files matching scripts/bin/mx.*.sh
        2. For each file, extract from the # --- frontmatter block:
           - title (# title: "...")
           - description (# description: "...")
           - category (# category: ...)
           - version (# version: "...")
           - status (# status: ...)
        3. Present as a formatted table with columns: name, category, description
        4. Group by category
        5. Include total count
      outputs:
        - name: script-table
          type: string
          description: Formatted table of all mx.* scripts with metadata

    - name: explain
      description: Explain the MX-OS script pattern and conventions
      usage: >
        Provide a clear explanation of:
        1. What mx.* scripts are — the active layer of MX-OS, personal shell toolkit
        2. The naming convention: mx.<name>.sh, alias mx.<name>
        3. The metadata frontmatter pattern (# --- block with YAML)
        4. Required fields: title, version, created, modified, author, description, category, status, partOf
        5. The colour module: source mx.colours.sh for BOLD, BLUE, GREEN etc.
        6. The help pattern: case "${1:-}" in help|--help|-h)
        7. The header pattern: decorative box with script name
        8. Where scripts live: scripts/bin/ (under version control in MX-hub)
        9. Where aliases live: ~/.zsh/config/aliases.zsh using $MX_BIN_DIR
        10. Reference the template: mx-canon/mx-os/deliverables/mx-script-template.sh

mx:
  contentType: "action-doc"
  runbook: "mx exec mx-scaffold"
  semantic: true
---

# MX Scaffold

The pattern for extending MX-OS with new shell tools.

---

## What MX-OS Scripts Are

MX-OS scripts are the active, executable layer of MX-OS — personal shell tools prefixed with `mx.` that handle tasks from system status to git dashboards, file finding to JSON exploration. They are:

- Stored under version control in `scripts/bin/` (not floating in `~/bin/`)
- Aliased from `~/.zsh/config/aliases.zsh` using `$MX_BIN_DIR`
- Self-describing through YAML frontmatter in comment blocks
- Colour-coded using the shared `mx.colours.sh` WCAG module
- Consistently structured: metadata → help → header → main logic

As of 2026-02-25 there are 33 active mx.* scripts covering: status, git, find, kill, timer, environment, notes, health, scaffold, inspect, metadata, tools, workspace, backup, sync, ports, IP, display, changelog, collaboration, dependencies, colours, AI setup, cleanup, update, environment, JSON browser, man pages, shell manual, run, and more.

---

## The Canonical Template

The single source of truth for new script structure:

```
mx-canon/mx-os/deliverables/mx-script-template.sh
```

This template uses `{{PLACEHOLDER}}` markers. The `mx.scaffold.sh` script reads this file and substitutes values via `sed`. AI agents creating scripts should do the same.

**Placeholders:**

| Placeholder | Example value |
| --- | --- |
| `{{TITLE}}` | `mx.myutil — Short description` |
| `{{TODAY}}` | `2026-02-25` |
| `{{DESCRIPTION}}` | `One-line description of the script` |
| `{{CATEGORY}}` | `mx-dev` |
| `{{TAGS}}` | `tag1, tag2, tag3` |
| `{{DEPS}}` | `fzf, bat` |
| `{{SCRIPT_NAME}}` | `mx.myutil` |
| `{{SHORT_DESC}}` | `Short description` |
| `{{UPPER_NAME}}` | `Myutil` |

---

## The Script Pattern

Every mx.* script follows this structure:

```bash
#!/bin/bash
# --- YAML metadata frontmatter ---

source "$(dirname "${BASH_SOURCE[0]}")/mx.colours.sh"

# ── Help ──
case "${1:-}" in
    help|--help|-h) ... exit 0 ;;
esac

# ── Header ── (decorative box)

# ── Main ── (implementation)

exit 0
```

---

## Metadata Fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | `"mx.<name> — Short description"` |
| `version` | Yes | Start at `"1.0"` |
| `created` | Yes | Date first created |
| `modified` | Yes | Update on every change |
| `author` | Yes | Tom Cranstoun |
| `description` | Yes | One-line, max 160 chars |
| `category` | Yes | `mx-core` / `mx-dev` / `mx-network` / `mx-ai` / `mx-utils` |
| `status` | Yes | `active` |
| `partOf` | Yes | Always `mx-os` |
| `tags` | No | Array of relevant terms |
| `dependencies` | No | External tools required |
| `builds-on` | No | Related cogs for context |

---

## Alias Registration

Every mx.* script needs an alias in `~/.zsh/config/aliases.zsh`:

```zsh
alias mx.<name>="$MX_BIN_DIR/mx.<name>.sh"
```

Using `$MX_BIN_DIR` (not a hardcoded path) keeps the alias location-independent. `MX_BIN_DIR` is exported in `~/.zsh/config/exports.zsh`.

---

## The Interactive Shell Tool

For humans creating scripts interactively:

```bash
mx.scaffold <name>
```

This reads the canonical template, prompts for metadata values, substitutes placeholders, writes the script, and registers the alias. Then:

```bash
source ~/.zshrc
mx.<name>           # run it
code $MX_BIN_DIR/mx.<name>.sh  # edit it
```

---

*The template is the contract. Scripts that follow it are discoverable, consistent, and self-describing.*
