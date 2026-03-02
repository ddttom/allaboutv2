---
version: "1.0.0"
description: "Automatically sync mx-reginald registry when cogs are added, modified, or deleted — multiple trigger mechanisms with smart mode detection."

created: 2026-02-17
modified: 2026-02-17

author: Tom Cranstoun and Maxine

mx:
  name: registry-sync
  maintainer: tom.cranstoun@gmail.com
  license: proprietary
  status: published

  category: mx-core
  partOf: mx-os
  refersTo: [what-is-a-cog, what-is-mx-os]
  buildsOn: [what-is-a-cog]
  tags: [registry, automation, hooks, git, cog-management, reginald, sync]

  audience: both
  purpose: "Keep mx-reginald registry synchronized with cog files across multiple trigger points — pre-commit, VS Code save, Claude Code tools, and manual."

  execute:
    runtime: runbook
    policy: |
      Registry is the source of truth for all cogs. When cogs change, the registry
      MUST be updated to reflect those changes. Multiple triggers ensure no changes
      are missed regardless of workflow (manual editing, AI generation, git operations).

      Mode-aware: hub mode syncs all cogs including submodules; standalone mode syncs
      only main repo cogs.
    actions:
      - name: sync
        description: "Regenerate all registry artifacts from current cog files."
        usage: |
          ## SYNC — Regenerate Registry Artifacts

          This is the core action. It scans all cog files, parses metadata, and regenerates:
          - `mx-reginald/index.json` — full registry with all cog metadata
          - `mx-reginald/stats.json` — totals by type, category, status
          - `mx-reginald/README.md` — human-readable registry documentation
          - Any other registry artifacts

          ### Step 1: Scan cog directory

          Recursively scan `MX-Cog-Registry/cogs/` for all files:

          ```bash
          find mx-canon/MX-Cog-Registry/cogs -type f \
            \( -name "*.cog.md" -o -name "*.cog.svg" -o -name "*.cog.js" -o -name "*.cog.*" \)
          ```

          Also scan submodule cog directories if they exist.

          ### Step 2: Parse cog metadata

          For each cog file:
          1. Extract YAML frontmatter (for `.md` files) or equivalent metadata
          2. Parse fields: name, version, description, category, status, tags, etc.
          3. Extract technical specs (for `.svg`, parse viewBox, colors, fonts from native SVG)
          4. Build cog entry object

          **Critical**: Use existing `npm run cog:sync` infrastructure if available.
          Don't reimplement the parser — invoke the existing tool.

          ### Step 3: Compare with previous state

          If `mx-reginald/index.json` exists, load it and compare:
          - **Added**: Cogs in new scan but not in previous registry
          - **Modified**: Cogs where version or modified timestamp changed
          - **Deleted**: Cogs in previous registry but not in new scan
          - **Unchanged**: Cogs that are identical

          Track counts for detailed notification.

          ### Step 4: Generate registry artifacts

          Write updated files:

          **index.json**:
          ```json
          {
            "version": "1.0",
            "generated": "2026-02-17T15:30:00Z",
            "cogs": [
              {
                "name": "pdf-generator",
                "version": "1.2.0",
                "category": "mx-core",
                "status": "published",
                "path": "mx-canon/MX-Cog-Registry/cogs/pdf-generator.cog.md"
              }
            ]
          }
          ```

          **stats.json**:
          ```json
          {
            "total": 47,
            "byCategory": {
              "mx-core": 12,
              "illustration": 8
            },
            "byStatus": {
              "published": 45,
              "draft": 2
            }
          }
          ```

          **README.md**: Generate human-readable list of all cogs with descriptions.

          ### Step 5: Return change summary

          Return object with:
          ```javascript
          {
            added: 2,
            modified: 3,
            deleted: 0,
            unchanged: 42,
            total: 47
          }
          ```

          This summary is used for notifications.

        inputs:
        outputs:
          - name: summary
            type: object
            description: "Change summary with added/modified/deleted/total counts"
          - name: index-json
            type: file
            description: "mx-reginald/index.json"
          - name: stats-json
            type: file
            description: "mx-reginald/stats.json"
          - name: readme
            type: file
            description: "mx-reginald/README.md"

      - name: hook-precommit
        description: "Pre-commit hook integration — add registry changes to current commit."
        usage: |
          ## HOOK-PRECOMMIT — Pre-Commit Git Hook

          This action is invoked by `.git/hooks/pre-commit` before a commit completes.

          ### Step 1: Check if cogs are being committed

          ```bash
          git diff --cached --name-only | grep -q "^mx-canon/MX-Cog-Registry/cogs/"
          ```

          If no cog files are staged, exit early (no sync needed).

          ### Step 2: Run sync action

          Invoke the `sync` action to regenerate registry artifacts.

          ### Step 3: Stage registry changes

          ```bash
          git add mx-reginald/index.json
          git add mx-reginald/stats.json
          git add mx-reginald/README.md
          ```

          These changes are now part of the commit being made.

          ### Step 4: Silent execution

          Pre-commit hooks should be fast and quiet. Don't show detailed notifications.
          Only output errors if sync fails.

          ### Installation

          Create `.git/hooks/pre-commit`:
          ```bash
          #!/bin/bash
          # MX Registry Sync — Pre-commit Hook

          # Check if cogs are being committed
          if git diff --cached --name-only | grep -q "^mx-canon/MX-Cog-Registry/cogs/"; then
            echo "🔄 Syncing registry..."
            npm run cog:sync || exit 1
            git add mx-reginald/
          fi
          ```

          Make executable:
          ```bash
          chmod +x .git/hooks/pre-commit
          ```

        inputs:
          - name: staged-files
            type: array
            required: false
            description: "List of staged files (from git diff --cached --name-only)"
        outputs:
          - name: staged
            type: boolean
            description: "Whether registry files were staged for commit"

      - name: hook-vscode
        description: "VS Code save hook — auto-commit registry changes."
        usage: |
          ## HOOK-VSCODE — VS Code Save Integration

          This action is invoked when a `.cog.*` file in `MX-Cog-Registry/cogs/` is saved.

          ### Step 1: Detect cog file save

          VS Code file watcher pattern:
          ```
          mx-canon/MX-Cog-Registry/cogs/**/*.cog.*
          ```

          ### Step 2: Run sync action

          Invoke the `sync` action to regenerate registry artifacts.

          ### Step 3: Auto-commit registry changes

          ```bash
          git add mx-reginald/
          git commit -m "chore: sync registry after cog update

          Registry updated following changes to cog files.
          Auto-committed by MX registry-sync hook.

          Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
          ```

          ### Step 4: Show detailed notification

          Display notification with change summary:
          ```
          Registry synced
          Added: 1 cog
          Modified: 2 cogs
          Total: 47 cogs
          ```

          ### Installation

          **Option A**: VS Code extension settings.json:
          ```json
          {
            "files.watcherExclude": {},
            "emeraldwalk.runonsave": {
              "commands": [
                {
                  "match": "mx-canon/MX-Cog-Registry/cogs/.*\\.cog\\..*$",
                  "cmd": "npm run registry:sync-and-commit"
                }
              ]
            }
          }
          ```

          **Option B**: File watcher script (requires separate tool).

        inputs:
          - name: saved-file
            type: file
            required: true
            description: "Path to the cog file that was saved"
        outputs:
          - name: committed
            type: boolean
            description: "Whether registry changes were committed"
          - name: commit-sha
            type: string
            description: "SHA of the auto-commit if created"

      - name: hook-claude
        description: "Claude Code Write/Edit hook — stage registry for next commit."
        usage: |
          ## HOOK-CLAUDE — Claude Code Tool Integration

          This action is invoked after Claude Code's Write or Edit tool modifies a cog file.

          ### Step 1: Detect cog file modification

          Hook triggers when Write/Edit tool operates on files matching:
          ```
          mx-canon/MX-Cog-Registry/cogs/**/*.cog.*
          ```

          ### Step 2: Run sync action

          Invoke the `sync` action to regenerate registry artifacts.

          ### Step 3: Stage registry changes

          ```bash
          git add mx-reginald/index.json
          git add mx-reginald/stats.json
          git add mx-reginald/README.md
          ```

          Changes are staged but not committed. They'll be included in the next
          `/step-commit` or manual commit.

          ### Step 4: Notify Claude in tool result

          Append to tool result:
          ```
          ✓ Registry synced: 1 cog modified, 47 total
          ```

          Claude sees this in the function result and knows registry is current.

          ### Installation

          Create `.claude/hooks/post-tool.sh`:
          ```bash
          #!/bin/bash
          # MX Registry Sync — Post-Tool Hook

          TOOL_NAME="$1"
          TOOL_FILE="$2"

          if [[ "$TOOL_NAME" =~ ^(Write|Edit)$ ]] && [[ "$TOOL_FILE" =~ ^mx-canon/MX-Cog-Registry/cogs/.*\.cog\. ]]; then
            npm run cog:sync
            git add mx-reginald/
            echo "✓ Registry synced and staged"
          fi
          ```

          Make executable:
          ```bash
          chmod +x .claude/hooks/post-tool.sh
          ```

        inputs:
          - name: tool-name
            type: string
            required: true
            description: "Name of tool that triggered hook (Write or Edit)"
          - name: modified-file
            type: file
            required: true
            description: "Path to file that was modified"
        outputs:
          - name: staged
            type: boolean
            description: "Whether registry files were staged"
          - name: notification
            type: string
            description: "Message to include in tool result"

      - name: manual
        description: "Manual trigger — sync and commit with detailed report."
        usage: |
          ## MANUAL — Manual Registry Sync

          This action is invoked manually via `/sync-registry` skill or `npm run registry:sync`.

          ### Step 1: Run sync action

          Invoke the `sync` action to regenerate registry artifacts.

          ### Step 2: Auto-commit registry changes

          ```bash
          git add mx-reginald/
          git commit -m "chore: manual registry sync

          Registry synchronized via manual trigger.

          Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
          ```

          ### Step 3: Display detailed report

          Show comprehensive change summary:
          ```
          📊 Registry Sync Report

          Mode: hub
          Scan: mx-canon/MX-Cog-Registry/cogs/

          Changes:
          ✓ Added: 1 cog
            - registry-sync.cog.md (v1.0.0)

          ✓ Modified: 2 cogs
            - pdf-generator.cog.md (v1.1.0 → v1.2.0)
            - what-is-a-cog.cog.md (updated 2026-02-17)

          ✓ Deleted: 0 cogs

          Total: 47 cogs in registry

          Registry artifacts updated:
          - mx-reginald/index.json
          - mx-reginald/stats.json
          - mx-reginald/README.md

          Committed as: a1b2c3d
          ```

          ### Step 4: Verify registry integrity

          Optionally run validation checks:
          - All cog names are unique
          - All versions are valid semver
          - All references in `builds-on` exist
          - No orphaned registry entries

          Report any warnings or errors.

        inputs:
          - name: verify
            type: boolean
            required: false
            description: "Run integrity checks after sync (default: true)"
        outputs:
          - name: report
            type: string
            description: "Detailed change report for display"
          - name: commit-sha
            type: string
            description: "SHA of the commit created"
          - name: errors
            type: array
            description: "List of validation errors if any"

  contentType: action-doc
  runbook: "mx exec registry-sync"
---

# Registry Sync

Automatically keep mx-reginald registry synchronized with cog files. Multiple trigger mechanisms ensure the registry is always current regardless of workflow.

## What This Does

The registry is the single source of truth for all cogs in the MX ecosystem. When cogs are added, modified, or deleted, the registry must be updated to reflect those changes. This cog provides four trigger mechanisms:

1. **Pre-commit hook** — Registry changes are added to the commit being made
2. **VS Code save** — Registry auto-commits when you save a cog file
3. **Claude Code tools** — Registry stages when Claude modifies cog files
4. **Manual trigger** — Explicit sync via `/sync-registry` or `npm run`

All triggers use the same core sync operation but differ in git behavior and notification style.

## Why This Exists

Before this cog, registry sync was manual (`npm run cog:sync`). Forgetting to run it after cog changes meant the registry was stale, causing:

- Discovery tools showing outdated cog lists
- Stats reports showing incorrect totals
- README documentation out of sync with actual cogs

Multiple triggers mean no workflow is left without registry sync. Edit manually? Pre-commit hook. Save in VS Code? Auto-commit. Claude generates cogs? Staged for next commit. Need explicit control? Manual trigger.

## For AI Agents

1. Read this cog's `execute.actions` block for full procedures
2. Invoke the appropriate action based on context:
   - Inside git commit workflow? Use `hook-precommit`
   - After Write/Edit tool use? Use `hook-claude`
   - User requests manual sync? Use `manual`
3. Use existing `npm run cog:sync` infrastructure — don't reimplement the parser
4. Return detailed change summary for notifications

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ Registry synced successfully

Outputs:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-reginald/index.json (47 cogs)
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-reginald/stats.json (updated)
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-reginald/README.md (regenerated)
```

Not just "Registry updated" or "mx-reginald/index.json created" — the full absolute path from root.

## Installation Status

| Trigger | Installed | Location | Status |
|---------|-----------|----------|--------|
| Pre-commit hook | ❌ Not yet | `.git/hooks/pre-commit` | Ready to install |
| VS Code hook | ❌ Not yet | `.vscode/settings.json` | Ready to install |
| Claude hook | ❌ Not yet | `.claude/hooks/post-tool.sh` | Ready to install |
| Manual trigger | ✓ Exists | `npm run cog:sync` | Already available |

**Next step**: Run installation script to set up hooks (script to be created).

## Dependencies

| Tool | Required | Install |
| ---- | -------- | ------- |
| node | Yes | `brew install node` |
| npm | Yes | Comes with Node |
| git | Yes | Pre-installed on macOS |

## Related

- `mx-reginald/index.json` — the registry this cog maintains
- `npm run cog:sync` — existing sync command this cog wraps
- `npm run cog:list` — query tool that reads the registry
- `npm run cog:stats` — statistics tool that reads the registry
- `.claude/skills/mx-c-registry-sync/skill.md` — skill entry point (to be created)

---

*"The registry is the memory. The hooks are the synapses. Always in sync."*
