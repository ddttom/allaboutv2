---
name: manuals-registry
title: Manuals Registry
description: Index of all MX system manuals. One brain, one registry. Every manual is a cog.
author: Tom Cranstoun and Maxine
created: 2026-02-13T00:00:00.000Z
version: "1.0"
status: active
license: proprietary
category: registry
tags:
  - registry
  - manuals
  - index
  - brain
partOf: mx-maxine-lives
manuals:
  - name: manual-mx-os
    file: mx-os-manual.cog.md
    covers: MX OS — cogs, SOULs, registry, runtime, companion web
    status: active
  - name: manual-mx-contacts
    file: mx-contacts-manual.cog.md
    covers: Contact management — adding, messaging, archiving, naming conventions
    status: active
  - name: manual-mx-reginald
    file: mx-reginald-manual.cog.md
    covers: MX Reginald engine — cog listing, execution, categories, building
    status: active
  - name: manual-maxine-lives
    file: manual-maxine-lives.cog.md
    covers: The brain — decisions, assumptions, doubts, risks, plans, routing
    status: active
  - name: manual-prompt-enhancer
    file: manual-prompt-enhancer.cog.md
    covers: Route-decorator hook — spell checking, route matching, concept injection
    status: active
  - name: manual-spell-checker
    file: manual-spell-checker.cog.md
    covers: MX spell checker — dual-dialect, vocabulary-aware markdown checking
    status: active
  - name: manual-mx-show
    file: mx-show-manual.cog.md
    covers: Window finder — pinned favourites, keyboard-driven, dual-display
    status: active
  - name: manual-cog-id
    file: manual-cog-id.cog.md
    covers: Cog ID system — generating, registering, decoding, stamping obfuscated cog identifiers
    status: active
  - name: manual-mx-pdf
    file: manual-mx-pdf.cog.md
    covers: PDF generation — WeasyPrint pipeline, chapter compilation, cover pages
    status: active
  - name: manual-build-tools
    file: manual-build-tools.cog.md
    covers: Build tools — sitemap, content organiser, ASCII-to-SVG, context URLs, cleanup, migration
    status: active
  - name: manual-git-hooks
    file: manual-git-hooks.cog.md
    covers: Git hooks — MX Watch validation, metadata generation, inheritance, attribute indexing
    status: active
  - name: manual-mx-nav-server
    file: manual-mx-nav-server.cog.md
    covers: Navigation dashboard — multi-repo web UI, search, recent files
    status: active
  - name: manual-parse-mxignore
    file: manual-parse-mxignore.cog.md
    covers: MX ignore parser — .mxignore/.gitignore pattern matching, CLI and module
    status: active
  - name: manual-team-onboarding
    file: manual-team-onboarding.cog.md
    covers: Team member onboarding — interactive wizard, access testing, setup automation
    status: active
  - name: manual-path-validator
    file: manual-path-validator.cog.md
    covers: Path validation — detecting old path patterns, preventing regression, CI integration
    status: active
  - name: manual-submodule-health
    file: manual-submodule-health.cog.md
    covers: Submodule health — initialization, cleanliness, branch status, remote sync
    status: active
  - name: manual-enhanced-audit
    file: manual-enhanced-audit.cog.md
    covers: Enhanced Audit System — DOM/CSS/asset capture, 24h caching, pixel-perfect web replication
    status: active
  - name: manual-cogify
    file: manual-cogify.cog.md
    covers: Cogification workflow — converting content to MX-enhanced format, templates, metadata, accessibility
    status: active
  - name: manual-multilingual-sitemap
    file: manual-multilingual-sitemap.cog.md
    covers: Multilingual sitemap generator — automatic hreflang annotations, Google SEO best practices
    status: active
  - name: manual-multilingual-template
    file: manual-multilingual-template.cog.md
    covers: Multilingual template generator — single HTML to language-specific versions with proper attributes
    status: active
  - name: manual-multilingual-validator
    file: manual-multilingual-validator.cog.md
    covers: Multilingual validator — SEO compliance, lang attributes, hreflang tags, anti-patterns
    status: active
  - name: manual-asset-sync
    file: manual-asset-sync.cog.md
    covers: Asset synchronizer — CSS/JS/images/fonts sync across language directories
    status: active
  - name: manual-parity-checker
    file: manual-parity-checker.cog.md
    covers: Content parity checker — translation gaps, structural differences, outdated versions
    status: active
  - name: manual-deployment-helper
    file: manual-deployment-helper.cog.md
    covers: Deployment helper — orchestrates validation/parity/sitemap, deployment checklist, Search Console setup
    status: active
execute:
  runtime: runbook
  actions:
    - name: list
      description: List all manuals with status and coverage summary
    - name: find
      description: Find the manual for a given topic or tool
    - name: register
      description: Add a new manual to the registry
mx:
  purpose: Document manuals registry - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: "mx exec manuals-registry"
  ai:
    contextProvides:
      - Index of all MX system manuals. One brain, one registry. Every manual is a cog.
      - Usage guide and workflow for manuals registry
      - Troubleshooting and best practices
refersTo: []
---

# Manuals Registry

All MX system manuals live here. One brain, one folder, one registry.

Manuals are written for the person using the tool, not the person building it.

---

## Current Manuals

| Manual | Covers | Status |
|--------|--------|--------|
| [MX OS](mx-os-manual.cog.md) | Cogs, SOULs, registry, runtime, companion web | active |
| [MX Contacts](mx-contacts-manual.cog.md) | Adding, messaging, archiving contacts | active |
| [MX Reginald](mx-reginald-manual.cog.md) | Engine — cog listing, execution, categories | active |
| [Maxine Lives](manual-maxine-lives.cog.md) | The brain — decisions, assumptions, plans | active |
| [Prompt Enhancer](manual-prompt-enhancer.cog.md) | Route-decorator hook, zero-inference preprocessing | active |
| [Spell Checker](manual-spell-checker.cog.md) | Dual-dialect, MX-vocabulary-aware checking | active |
| [mx-show](mx-show-manual.cog.md) | Window finder for macOS, pinned favourites | active |
| [Cog ID](manual-cog-id.cog.md) | Generating, registering, decoding obfuscated cog IDs | active |
| [mx-pdf](manual-mx-pdf.cog.md) | PDF generation — WeasyPrint, chapter compilation | active |
| [Build Tools](manual-build-tools.cog.md) | Sitemap, ASCII-to-SVG, content organiser, cleanup | active |
| [Git Hooks](manual-git-hooks.cog.md) | MX Watch validation, metadata generation, inheritance | active |
| [Nav Server](manual-mx-nav-server.cog.md) | Multi-repo web dashboard, search, recent files | active |
| [MX Ignore Parser](manual-parse-mxignore.cog.md) | .mxignore/.gitignore pattern matching | active |
| [Team Onboarding](manual-team-onboarding.cog.md) | Interactive wizard, access testing, setup automation | active |
| [Path Validator](manual-path-validator.cog.md) | Detecting old paths, preventing regression, CI integration | active |
| [Submodule Health](manual-submodule-health.cog.md) | Initialization, cleanliness, branch status, remote sync | active |
| [Enhanced Audit](manual-enhanced-audit.cog.md) | DOM/CSS/asset capture, 24h caching, pixel-perfect web replication | active |
| [Cogify](manual-cogify.cog.md) | Converting content to MX-enhanced format, templates, metadata | active |
| [Multilingual Sitemap](manual-multilingual-sitemap.cog.md) | Automatic hreflang annotations, Google SEO best practices | active |
| [Multilingual Template](manual-multilingual-template.cog.md) | Single HTML to language-specific versions with proper attributes | active |
| [Multilingual Validator](manual-multilingual-validator.cog.md) | SEO compliance, lang attributes, hreflang tags, anti-patterns | active |
| [Asset Synchronizer](manual-asset-sync.cog.md) | CSS/JS/images/fonts sync across language directories | active |
| [Parity Checker](manual-parity-checker.cog.md) | Translation gaps, structural differences, outdated versions | active |
| [Deployment Helper](manual-deployment-helper.cog.md) | Orchestrates validation/parity/sitemap, deployment checklist | active |

---

## Actions

### `list`

Read this file's YAML `manuals:` array. Return a table of all manuals with name, file, covers, and status.

### `find`

Given a topic or tool name:

1. Search the `manuals:` array `covers` and `name` fields
2. Return matching manual(s) with file path
3. If no match, say so — don't guess

### `register`

When a new manual is created in this folder:

1. Add an entry to the `manuals:` array in this file's YAML frontmatter
2. Add a row to the markdown table below
3. Ensure the manual has proper `.cog.md` frontmatter with `name:`, `description:`, `status:`, `category: manual`, `partOf: mx-maxine-lives`

---

## Rules

1. **One folder.** All manuals live in `mx-canon/mx-maxine-lives/manuals/`.
2. **Every manual is a cog.** `.cog.md` with proper YAML frontmatter.
3. **This registry is the index.** If it's not listed here, it's not a manual.
4. **Manuals are for users.** Written for the person using the tool, not building it.
5. **No orphans.** Every new manual gets registered here on creation.

---

## For AI Agents

**Output Reporting Principle:** When an action-doc creates file outputs, it must report the full absolute path of every file created. This enables traceability and makes generated files easy to locate.

Note: This action-doc currently does not create file outputs, so this principle is documented for future extensibility.

---

*One brain. One registry. Stop guessing. Start reading.*
