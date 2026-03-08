---
version: "1.0.0"
description: Script metadata brings shell scripts into MX OS — comment-block frontmatter that makes every script machine-readable without changing how it runs.

created: 2026-02-10
modified: 2026-02-10

author: Tom Cranstoun and Maxine

mx:
  name: what-is-script-metadata
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, what-is-mx-os, who-is-maxine, script-helper]
  tags: [script-metadata, cut-compute, inspect, bash, shell, efficiency, mx-os]

  audience: developers
  readingLevel: accessible
  purpose: Explain why scripts need machine-readable metadata, how the system works, where we are today, and what comes next

  contentType: "action-doc"
  runbook: "mx exec what-is-script-metadata"
  execute:
    runtime: runbook
    command: mx cog script-metadata
    actions:
      - name: audit
        description: Scan a directory for scripts and report which have MX metadata and which do not
        usage: Check every .sh file in the target directory for a # --- metadata block. Report compliant vs non-compliant scripts with their current header lines.
        inputs:
          - name: directory
            type: string
            required: true
            description: The directory to scan (e.g. $MX_BIN_DIR)
        outputs:
          - name: report
            type: object
            description: List of scripts with metadata status, missing fields, and recommendations

      - name: progress
        description: Show current adoption stats across the mx.* script suite
        usage: Count mx.\* scripts in $MX_BIN_DIR. Count how many have the # --- metadata block. Report the ratio and list the gaps.
        inputs: []
        outputs:
          - name: stats
            type: object
            description: Total scripts, scripts with metadata, scripts without, percentage adopted

      - name: retrofit
        description: Add MX metadata to an existing script that lacks it
        usage: Run mx.inspect.sh on the target script. Read the inspection output to understand purpose, dependencies, and structure. Infer metadata fields. Insert the # --- block after the shebang line. Do not modify any other part of the script.
        inputs:
          - name: script-path
            type: string
            required: true
            description: Path to the script to retrofit
        outputs:
          - name: metadata-added
            type: object
            description: The metadata fields that were inferred and added
---

# What Is Script Metadata?

Every mx.* script is an MX OS program. The metadata proves it.

MX OS makes documents machine-readable. Cogs have YAML frontmatter. SOULs have structured identity. Folders have `.mx.yaml.md` metadata. But until today, shell scripts had nothing. A one-line comment at best. An AI agent encountering a script had to read every line to understand what it does.

That changes now.

---

## The Problem

An AI agent opens a shell script. It sees 200 lines of bash. It has no idea what the script does, what it depends on, whether it is safe to modify, or how it relates to anything else in the system. So it reads all 200 lines. It parses every pipeline, every variable, every case branch.

Most of that is wasted work. The agent needed 12 lines of context — the script's name, purpose, dependencies, and structure — to decide what to do. The other 188 lines were implementation detail it did not need yet.

This is the compute problem. Not the dramatic kind — not training runs or GPU clusters. The quiet kind. The kind that happens a thousand times a day, in every AI interaction with every script, across every developer's machine. Each one small. Together, enormous.

And it is not just compute. It is context. When the AI reads 200 lines of implementation, those tokens occupy the context window — pushing out the conversation, the user's intent, the broader task. The script's implementation displaces the things that actually matter.

---

## The Solution: Cut Compute, Not Context

Script metadata is a comment-block at the top of any shell script, structured as YAML behind `#` prefixes:

```bash
#!/bin/bash
# ---
# title: "mx.ls — Directory listing"
# version: "1.0"
# created: 2026-02-10
# modified: 2026-02-10
# author: Tom Cranstoun
# description: "Wraps eza with sensible defaults and named modes for MX workflows"
# category: mx-core
# status: active
# tags: [eza, ls, directory, filesystem, mx-os]
# dependencies: [eza]
# partOf: mx-os
# ---
```

Strip the `#` prefix from each line and you have valid YAML. Any tool that parses YAML can parse script metadata. The format is defined in Section 19 of the Cog Unified Specification, governed by The Gathering.

The script still runs exactly as before. Bash ignores comments. But an AI agent now has structured context before it reads a single line of implementation.

---

## The Three-Tier Read Strategy

This is how an AI agent should work with scripts in MX OS:

**Tier 1 — Metadata only.** Read the `# ---` comment block. This tells you: what the script is called, what it does, what it depends on, when it was last changed, and where it fits in the MX OS ecosystem. For most decisions — "should I modify this?", "what does this relate to?", "is this the right script?" — metadata is enough.

**Tier 2 — Skeleton.** Run `mx.inspect.sh` against the script. This extracts comments, function signatures, case branches, and control flow — the shape of the script without the implementation. The agent reads intent (comments) and structure (skeleton) without reading how things are done. For tasks like "add a new mode" or "understand the architecture" — the skeleton is enough.

**Tier 3 — Full source.** Only when the agent needs to modify specific implementation lines does it read the full script. By this point it already knows what the script does (metadata), how it is structured (skeleton), and exactly where to look.

The result: a 200-line script becomes a 12-line metadata read. If more context is needed, a 35-line skeleton. Full source only as a last resort.

---

## How It Works in Practice

Here is `mx.ls.sh` — the first script built with full MX metadata. When inspected, the 66-line script produces a 35-line skeleton:

```
# Inspection of: /Users/tomcranstoun/Documents/MX-hub/scripts/bin/mx.ls.sh
# Lines in original: 66

#!/bin/bash
# --- (metadata block) ---

# Check eza is available
if ! command -v eza &>/dev/null; then
fi

MODE="${1:-}"

case "$MODE" in
    long)
    tree)
    git)
    all)
    recent)
    help|--help|-h)
    "")
    *)
esac

# Original lines: 66
# Extracted lines: 35
# Reduction: 47%
```

From the skeleton alone, an AI agent knows: this script wraps eza, it has seven named modes (long, tree, git, all, recent, help, default), it checks for eza availability, and it uses a case statement for routing. That is enough to add a new mode, fix a bug, or explain the script to a user — without reading 31 lines of implementation.

---

## Where We Are

**What exists today:**

- **The specification.** Section 19 of the Cog Unified Specification defines script metadata — format, required fields, optional fields, parsing rules, the cut compute principle. It is written and published.
- **The inspection tool.** `mx.inspect.sh` extracts comments and structural skeleton from any shell script. It lives in Canon (`mx-canon/mx-os/deliverables/`) and in `scripts/bin/` for daily use. It is tested and working.
- **The script-helper action-doc.** A `runtime: runbook` cog in the registry with four actions: inspect, create, amend, add-metadata. It teaches AI agents the three-tier read strategy. Published and registered.
- **The mx-scaffold action-cog.** The canonical workflow for creating new mx.* scripts — reads the template from Canon, substitutes placeholders, writes the script to `$MX_BIN_DIR`, and registers the alias. See `scripts/cogs/mx-scaffold.cog.md`.
- **The canonical template.** `mx-canon/mx-os/deliverables/mx-script-template.sh` is the single source of truth for new script structure.
- **All mx.\* scripts have full metadata.** Every script in `scripts/bin/` carries the complete `# ---` metadata block. The migration from `~/bin/` is complete — scripts are now under version control in MX-hub.
- **mx.health.sh validates metadata.** The health checker automatically validates metadata, aliases, permissions, colour module sourcing, help flags, and exit codes for every mx.* script.

**What does not exist yet:**

- **No automated audit.** The `audit` and `progress` actions in this action-doc describe what should happen, but no automated tooling exists yet.
- **No cross-language support.** `mx.inspect.sh` works for bash scripts. Python, Ruby, and other `#`-comment languages use the same comment style but the skeleton extraction patterns are bash-specific. Extension is needed.
- **No documentation in The Corpus.** The concept exists in Canon (specifications, cogs) but not yet in the practitioner-facing book.

The foundation is solid. All scripts are self-describing and under version control.

---

## Why This Matters

Script metadata is not a nice-to-have. It is MX OS being consistent.

MX OS says: every document should be machine-readable. Every folder should have identity. Every piece of knowledge should be structured for both humans and machines.

If cogs have frontmatter and SOULs have structure but scripts have nothing — then scripts are second-class citizens in MX OS. They are the black boxes in a system designed to eliminate black boxes.

Script metadata fixes that. Every mx.* script becomes a first-class MX OS program. The `partOf: mx-os` field is not decorative. It means: this script is part of the operating system. It has identity. It has metadata. It is machine-readable. An AI agent can understand it without reading every line.

This is also the Maxine mission. Maxine is the AI partner. Every token Maxine spends reading implementation she does not need is a token not spent on the actual task. Cut compute means Maxine works faster, costs less, and stays focused. Script metadata is not just good engineering. It is good economics.

---

## Next Steps

These are the things that need to happen next, in rough priority order:

1. **Build the audit action.** A bash script or node tool that scans `$MX_BIN_DIR` and reports: how many scripts, how many have metadata, which fields are missing. Wire it into this action-doc.
2. **Cross-language inspection.** Extend mx.inspect.sh to handle Python scripts (function def signatures, class declarations, decorators) and other `#`-comment languages.
3. **Document in The Corpus.** Write the practitioner-facing explanation: what script metadata is, how to add it, how to use mx.inspect.sh, the three-tier read strategy.
4. **Measure the savings.** Measure actual token reduction across a week of real Maxine sessions with all scripts carrying metadata. Prove the economics.

---

## How to Use This Action-Cog

This is an action-doc. It explains AND does.

**Actions available:**

- **audit** — Scan a directory and report which scripts have MX metadata and which do not
- **progress** — Show adoption stats for the mx.* script suite (how many have metadata vs how many need it)
- **retrofit** — Add MX metadata to a script that lacks it (inspect first, infer fields, insert block)

When `runtime: runbook`, the AI agent reading this action-doc IS the executor. The actions above are your instructions. Follow the three-tier strategy: metadata first, skeleton second, full source only if needed.

## For AI Agents

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Script metadata added

Output:
  /Users/tomcranstoun/Documents/MX-hub/scripts/bin/mx.example.sh (metadata block inserted, 12 fields)
```

Not just "Metadata added" or "mx.example.sh updated" — the full absolute path from root.

---

*Cut compute, not context.*
