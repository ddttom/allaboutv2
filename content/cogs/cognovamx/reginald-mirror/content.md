---
version: "1.0.0"
description: "Sync source cogs to the Reginald web mirror, keeping mx-outputs/reginald/ up to date with scripts/cogs/ and mx-canon/."
created: 2026-03-09
modified: 2026-03-09
author: Tom Cranstoun and Maxine

mx:
  maintainer: info@cognovamx.com
  license: proprietary
  status: published
  category: mx-core
  partOf: mx-os
  refersTo: [registry-sync, cog-query]
  buildsOn: [what-is-a-cog, registry-sync]
  tags: [reginald, mirror, sync, registry, automation, cogs]
  audience: both
  readingLevel: intermediate
  contentType: action-doc
  runbook: "mx exec reginald-mirror"
  execute:
    runtime: runbook
    command: mx reginald-mirror
    policy: |
      Source cogs in scripts/cogs/ and mx-canon/ are authoritative.
      The Reginald mirror at mx-outputs/reginald/ must reflect source state.
      Run this after any cog modification to keep the mirror current.
      The sync pipeline is: source cogs → mx-reginald/index.json → mx-outputs/reginald/
    actions:
      - name: sync
        description: "Full mirror sync — update registry index then regenerate Reginald mirror."
        usage: |
          ## SYNC — Full Mirror Pipeline

          Runs the complete sync pipeline to bring the Reginald web mirror
          up to date with all source cogs.

          ### When to Run

          Run after any of these events:
          - A source cog in `scripts/cogs/` is created, modified, or deleted
          - A canon cog in `mx-canon/` is created, modified, or deleted
          - The pdf-generator cog is updated (new actions, version bumps)
          - Any cog metadata changes (version, description, tags)

          ### Execution

          ```bash
          npm run reginald:mirror
          # or directly:
          bash scripts/reginald-mirror.sh
          ```

          ### Pipeline Steps

          1. **Update registry** — `npm run cog:sync` scans all `.cog.md` files
             and regenerates `mx-reginald/index.json`
          2. **Regenerate mirror** — `npm run reginald:generate` reads the registry
             and writes static files to `mx-outputs/reginald/`:
             - `cogs/cognovamx/{name}/latest.json` — extracted metadata
             - `cogs/cognovamx/{name}/content.md` — full cog content
             - `api/v1/cogs.json` — API endpoint
             - `api/v1/stats.json` — statistics
             - `llms.txt` — machine-readable index for AI agents
          3. **Report** — counts of synced cogs and output paths

          ### Output

          Mirror files at `mx-outputs/reginald/`

          ### Post-Sync

          After syncing, commit changes in the mx-outputs submodule:
          ```bash
          git -C mx-outputs add reginald/ content/ .well-known/
          git -C mx-outputs commit -m "chore: sync Reginald output"
          git -C mx-outputs push
          git add mx-outputs
          git commit -m "chore: update mx-outputs submodule with Reginald sync"
          ```
        outputs:
          - name: mirror
            type: file
            description: "Updated mirror at mx-outputs/reginald/"
          - name: registry
            type: file
            description: "Updated registry at mx-reginald/index.json"
      - name: verify
        description: "Check source and mirror parity without modifying files."
        usage: |
          ## VERIFY — Mirror Parity Check

          Compares source cogs against the Reginald mirror to find
          discrepancies without making changes.

          ### Execution

          ```bash
          # Count source cogs vs mirror entries
          echo "Source cogs: $(find scripts/cogs mx-canon -name '*.cog.md' | wc -l)"
          echo "Mirror entries: $(find mx-outputs/reginald/cogs -name 'latest.json' | wc -l)"
          ```

          ### What to Check

          1. **Missing mirrors** — source cogs with no mirror entry
          2. **Stale mirrors** — mirror content older than source
          3. **Orphan mirrors** — mirror entries with no source cog

          If discrepancies found, run the `sync` action to resolve.
        outputs:
          - name: report
            type: text
            description: "Parity report showing any discrepancies"
---

# Reginald Mirror Sync

Keeps the Reginald web mirror at `mx-outputs/reginald/` synchronised with source cogs across the repository.

## What This Does

The Reginald output is the published version of all MX cogs, served via `reginald.allabout.network` (registry API) and `content.allabout.network` (COG content). Generated files are deployed to Cloudflare Pages from the mx-outputs repository. This cog automates the two-step sync pipeline:

1. **Registry update** — scans all `.cog.md` files and rebuilds `mx-reginald/index.json`
2. **Mirror generation** — transforms the registry into static web files (JSON metadata, markdown content, API endpoints, llms.txt)

## Why This Exists

Without automated mirroring, source cogs and their published versions drift apart. When the pdf-generator gets a new action or any cog is updated, the mirror must reflect those changes. This cog documents and automates that process.

## For AI Agents

1. Run `npm run reginald:mirror` after modifying any cog
2. The script handles both registry sync and mirror generation
3. Report the total cog count from the output
4. Commit mx-outputs submodule changes separately (submodule-first workflow)

## Dependencies

| Tool | Required | Install |
| ---- | -------- | ------- |
| node | Yes | `brew install node` |
| npm | Yes | Comes with node |

## Related

- `scripts/reginald-mirror.sh` — the sync script
- `scripts/reginald-static-gen.js` — the mirror generator
- `scripts/cog-tools.js` — the registry sync tool
- `scripts/cogs/registry-sync.cog.md` — registry operations cog
