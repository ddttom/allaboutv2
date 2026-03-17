---
name: effective-doc-example
version: "1.0"
description: "Reference implementation showing how an effective doc is resolved from a source cog, uber doc SOPs, and included policies."
created: 2026-03-04
modified: 2026-03-04
author: "Tom Cranstoun and Maxine"

mx:
  status: active
  contentType: reference-implementation
  category: mx-core
  partOf: mx-os
  tags: [effective-doc, resolution, inheritance, sop, reference-implementation, example]
  audience: [ai-agents, developers]
  license: proprietary
  deliverable: "worked example of effective doc resolution chain"
---

# Effective Doc Resolution — Reference Implementation

This document walks through the complete resolution chain that produces an effective doc. The scenario uses the cog publication workflow — an action-doc that includes a shared validation policy and operates under an uber doc's SOP governance.

## The Three Inputs

An effective doc is produced from three inputs:

1. **The source cog** — the cog being read
2. **The uber doc** — the reader's governance configuration
3. **Included cogs** — content merged via the `includes` mechanism

### Input 1: Source Cog

The `cog-publication-workflow` action-doc at `scripts/cogs/cog-publication-workflow.cog.md`:

```yaml
---
version: "1.0"
description: "Cog publication workflow — author, validate, register, and publish."
created: 2026-03-03
modified: 2026-03-03
author: "Tom Cranstoun and Maxine"

includes:
  - source: mx-canon/mx-the-gathering/reference-implementations/shared-validation-policy.cog.md
    blocks: [prose]
    resolution: build

mx:
  license: proprietary
  status: published
  category: mx-tools
  tags: [cog, publication, registry, reginald, workflow, sop, validation]
  deliverable: "validated cog registered in REGINALD"

  execute:
    runtime: runbook
    command: mx cog-publication-workflow
    policy: |
      Every cog must pass validation before entering the registry.
    actions:
      - name: publish
        description: "Full pipeline — author, validate, register, publish."
        usage: |
          [Detailed publication steps...]
---
```

### Input 2: Uber Doc

The reader's `UBER.cog.md` contributes SOP policy that governs how all cogs are processed:

```yaml
blocks:
  - sop:
      validation-policy:
        scope: "all action-docs in scripts/"
        rules:
          - "Run markdownlint-cli2 before registration"
          - "Verify two-zone YAML compliance"
          - "Check field dictionary for unknown fields"
        enforcement: strict

      effective-doc-policy:
        cache-location: "local"
        default-ttl: "1h"
        invalidation:
          - source-cog-change
          - uber-doc-change
          - mixin-config-change
          - ttl-expiry
        governance-period: "advisory"

      naming-policy:
        scope: "all cogs"
        rules:
          - "British English in prose"
          - "kebab-case for identifiers"
          - "camelCase for YAML field names"
```

### Input 3: Included Cog

The `shared-validation-policy.cog.md` provides reusable validation rules (see the companion file in this directory).

## The Resolution Chain

Resolution follows a defined order. Each step builds on the previous:

```text
Step 1: Load source cog
         ↓
Step 2: Resolve includes (build-time)
         ↓
Step 3: Merge uber doc SOPs
         ↓
Step 4: Apply overrides (child wins)
         ↓
Step 5: Cache as effective doc
```

### Step 1: Load Source Cog

The reader loads `cog-publication-workflow.cog.md` from disk. All frontmatter fields are parsed. The markdown body is loaded.

### Step 2: Resolve Includes

The source cog declares `includes`. Since `resolution: build`, the included content was already merged at publication time. The published cog contains the shared validation rules inline — no network fetch required at read time.

If the resolution were `read`, the reader would fetch `shared-validation-policy.cog.md` at this point and merge its prose block into the source cog.

### Step 3: Merge Uber Doc SOPs

The reader's uber doc contributes three SOP blocks:

- **validation-policy** — adds rules that must pass before registration
- **effective-doc-policy** — configures caching behaviour
- **naming-policy** — enforces naming conventions

These SOPs are merged into the cog's operational context. They do not modify the source cog's frontmatter — they add governance rules that the reader applies during processing.

### Step 4: Apply Overrides

The source cog's own fields take precedence over included and inherited content:

| Field | Included Value | Source Cog Value | Effective Value | Winner |
| --- | --- | --- | --- | --- |
| `license` | `proprietary` (shared policy rule 6) | `proprietary` | `proprietary` | No conflict |
| `status` | Must be `published` (shared policy rule 7) | `published` | `published` | No conflict |
| `deliverable` | (not in shared policy) | `validated cog registered in REGINALD` | `validated cog registered in REGINALD` | Source cog |

If the source cog had declared `license: MIT`, that would override the shared policy's rule 6. The source cog always wins.

### Step 5: Cache as Effective Doc

The fully resolved cog is cached locally with a 1-hour TTL (from the uber doc's `effective-doc-policy`). The cache is invalidated if:

- The source cog file changes on disk
- The uber doc is modified
- The included cog changes (for read-time includes)
- The TTL expires

The effective doc is never published or shared. It is a private artefact of this reader's processing. A different reader with a different uber doc produces a different effective doc from the same source cog.

## The Result

After resolution, the effective doc contains:

- All source cog frontmatter (unchanged)
- Shared validation rules (merged from include)
- Uber doc SOPs (applied as governance context)
- Override decisions (source cog wins over included content)
- Cache metadata (TTL, invalidation triggers)

The reader works with this effective doc for all subsequent operations during the cache period. The source cog, uber doc, and included cog are not re-read until the cache is invalidated.

"Cut compute, not context."

## Files in This Example

| File | Role |
| --- | --- |
| `shared-validation-policy.cog.md` | Included source — shared validation rules |
| `example-with-includes.cog.md` | Demonstrates the includes mechanism |
| `effective-doc-example.cog.md` | This file — effective doc resolution walkthrough |
