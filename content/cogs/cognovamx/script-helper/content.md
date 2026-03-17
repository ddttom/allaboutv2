---
version: "1.0.0"
description: Help AI agents create, amend, and inspect shell scripts with MX metadata — cut compute, not context.

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-mx-os, what-is-a-cog]
  tags: [scripts, metadata, inspect, bash, shell, compute, efficiency]

  audience: tech
  readingLevel: advanced

  contentType: "action-doc"
  runbook: "mx exec script-helper"
  execute:
    runtime: runbook
    command: mx cog script-helper
    actions:
      - name: inspect
        description: Extract comments and structural skeleton from an existing script
        usage: Run mx.inspect.sh against the target script. Read the output file instead of the full script.
        inputs:
          - name: script-path
            type: string
            required: true
            description: Path to the shell script to inspect
        outputs:
          - name: inspection-file
            type: string
            description: Path to /tmp/<scriptname>.inspect.txt containing comments + skeleton

      - name: create
        description: Create a new shell script with full MX metadata frontmatter
        usage: Generate a new script file with the standard metadata block, shebang, and initial structure based on the user's requirements
        inputs:
          - name: script-name
            type: string
            required: true
            description: Name of the script to create (e.g. mx.example.sh)
          - name: purpose
            type: string
            required: true
            description: What the script should do (one sentence)
          - name: output-path
            type: string
            required: false
            description: Where to write the script (defaults to $MX_BIN_DIR — scripts/bin/)
        outputs:
          - name: script-path
            type: string
            description: Path to the created script

      - name: amend
        description: Modify an existing script using its inspection output for context
        usage: First run the inspect action. Read the inspection file to understand the script. Then make targeted changes without reading the full implementation unless necessary.
        inputs:
          - name: script-path
            type: string
            required: true
            description: Path to the script to amend
          - name: change-description
            type: string
            required: true
            description: What change is needed
        outputs:
          - name: changes-made
            type: string
            description: Summary of changes applied

      - name: add-metadata
        description: Add MX metadata frontmatter to an existing script that lacks it
        usage: Read the script (or its inspection output). Infer title, description, category, dependencies, and tags. Insert the metadata block after the shebang line.
        inputs:
          - name: script-path
            type: string
            required: true
            description: Path to the script to add metadata to
        outputs:
          - name: metadata-added
            type: object
            description: The metadata fields that were added
---

# Script Helper

You are an AI agent working with shell scripts. This action-doc tells you how.

---

## The Problem

Shell scripts are black boxes. When you encounter one, you have two choices: read every line (expensive), or guess what it does (unreliable). Neither is acceptable.

A 200-line script might take 200 tokens to read. But you only need 30 tokens of context to understand what it does and decide your next move. The rest is implementation detail.

---

## The Cut Compute Principle

Read the minimum needed to make a good decision. For scripts, that means:

1. **Metadata first** — the comment-block frontmatter (12 lines) tells you what the script is, what it depends on, and its status
2. **Skeleton second** — the inspection output (comments + structure, no implementation) tells you the shape and intent
3. **Full source last** — only if you need to modify specific implementation lines

This is not laziness. This is efficiency. Every token you do not read is compute you do not spend. At scale, this matters.

---

## How to Use This Action-Cog

### When asked to create a new script

1. Ask the user: what should it do? what should it be called?
2. Generate the script with full MX metadata frontmatter (see Section 19 of the cog-unified-spec)
3. Include the standard fields: title, version, created, modified, author, description, category, status, tags, dependencies
4. Make it executable
5. If it is an mx.* script, place it in `$MX_BIN_DIR` (scripts/bin/). Prefer using the `mx-scaffold` action-cog which automates this entire workflow.

### When asked to modify an existing script

1. **Run inspect first:** `mx.inspect.sh <script-path>`
2. **Read the inspection file** at `/tmp/<scriptname>.inspect.txt`
3. From the inspection, determine:
   - Does the script have MX metadata? (Look for `# ---` block)
   - What functions exist? (Function signatures in skeleton)
   - What is the control flow? (Case/if/for structure)
   - What is the intent? (Comments explain why)
4. **Only read the full script** if you need to modify specific implementation lines
5. Make targeted changes. Update the `# modified:` date in metadata.

### When asked to add metadata to an existing script

1. Run inspect to understand the script
2. Read the inspection output
3. Infer: title (from filename + first comment), description (from purpose comments), category, dependencies (from command usage), tags
4. Insert the `# ---` metadata block after the shebang line
5. Do not modify any other part of the script

---

## The Inspection Script

The companion tool `mx.inspect.sh` (in `scripts/bin/` and `mx-canon/mx-os/deliverables/`) extracts:

- All `#` comment lines
- Shebang line
- Function signatures
- Case/esac branch labels
- Control flow headers (if/elif/else/fi, for/while/do/done)
- Top-level variable assignments
- Blank lines (preserves visual grouping)

It strips everything else. The output is a structural skeleton — enough for an AI agent to understand the script without reading the implementation.

**Usage:**

```bash
mx.inspect.sh path/to/script.sh
# → /tmp/script.sh.inspect.txt
```

---

## Metadata Format Reference

```bash
#!/bin/bash
# ---
# title: "Script display name"
# version: "1.0"
# created: 2026-02-10
# modified: 2026-02-10
# author: Tom Cranstoun
# description: "One-line purpose (max 160 chars)"
# category: mx-tools
# status: active
# tags: [tag1, tag2]
# dependencies: [tool1, tool2]
# builds-on: [cog-name]
# ---
```

**Required:** title, version, created, modified, author, description

**Optional:** category, status, tags, dependencies, builds-on

**Parsing:** Strip `#` and one space from each line between `# ---` delimiters. The result is valid YAML.

---

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Script created successfully

Output:
  /Users/tomcranstoun/Documents/MX-hub/scripts/bin/mx.example.sh (executable, 45 lines)
```

Not just "Script created" or "mx.example.sh written" — the full absolute path from root.

---

*Cut compute, not context. Give the machine what it needs to decide — nothing more.*
