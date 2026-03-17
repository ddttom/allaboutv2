---
name: example-with-includes
version: "1.0"
description: "Reference implementation demonstrating the cog includes mechanism. Includes a shared validation policy and overrides one rule."
created: 2026-03-04
modified: 2026-03-04
author: "Tom Cranstoun and Maxine"

includes:
  - source: shared-validation-policy.cog.md
    blocks: [prose]
    resolution: build

mx:
  status: active
  contentType: reference-implementation
  category: mx-core
  partOf: mx-os
  tags: [includes, composition, reference-implementation, example]
  audience: [ai-agents, developers]
  license: MIT
  deliverable: "working demonstration of cog composition via includes"

  execute:
    runtime: runbook
    command: mx example-with-includes
    policy: |
      This is a reference implementation, not a production action-doc.
      Its purpose is to demonstrate the includes mechanism defined in
      cog-unified-spec Section 3 ("Cog Composition").

      Override: This cog uses license: MIT (overriding the shared
      validation policy rule that action cogs use proprietary licence).
      All other shared validation rules remain in force.
    actions:
      - name: validate
        description: "Validate a cog using included shared policy plus local overrides."
        usage: |
          ## VALIDATE — Demonstrate Includes Resolution

          ### Step 1: Resolve Includes

          Load `shared-validation-policy.cog.md` from the relative path declared
          in the `includes` field. Since `resolution: build`, the included content
          is merged into this cog at build time. The published cog is self-contained.

          ### Step 2: Apply Override

          This cog overrides one rule from the shared policy:
          - **Rule 6 (licence):** This cog uses `license: MIT` instead of `proprietary`.

          All other rules from the shared validation policy apply without modification:
          - Required fields present
          - Two-zone YAML
          - Field dictionary compliance
          - Markdown lint clean
          - British English in prose
          - Status reflects readiness
          - Description is substantive

          ### Step 3: Report

          Output which rules were inherited from the shared policy, which were
          overridden, and whether the target cog passes all applicable rules.
---

# Includes Mechanism — Reference Implementation

This cog demonstrates the `includes` field defined in the cog-unified-spec. It includes a shared validation policy and overrides one rule.

## What This Demonstrates

### YAML `includes` Field

The frontmatter declares:

```yaml
includes:
  - source: shared-validation-policy.cog.md
    blocks: [prose]
    resolution: build
```

This means:

- **source:** The shared validation policy cog, referenced by relative path
- **blocks:** Only the prose block (the markdown body) is included
- **resolution:** Build-time — the included content is merged before publication

### Override in Action

The shared policy states: "Action cogs use proprietary licence." This cog overrides that rule by declaring `license: MIT` in its own frontmatter. The override is documented in the `policy` field of the `execute` block.

All other rules from the shared policy remain in force because this cog does not restate them.

### Inline Include (Demonstration)

An inline include inserts content at a specific point in the markdown body:

@include(shared-validation-policy.cog.md#validation-rules)

The marker above would insert the "Validation Rules" section from the shared policy at this exact position in the document. The content before and after the marker belongs to this cog.

## Relationship to Other Concepts

- **`builds-on`** says "read this for context." `includes` says "merge this content into me."
- **The uber doc** contributes SOPs via the effective doc pattern. `includes` contributes content via explicit declaration.
- **The effective doc** is the final output after all includes, SOPs, and mixins are resolved.

## Files in This Example

| File | Role |
| --- | --- |
| `shared-validation-policy.cog.md` | The included source — shared validation rules |
| `example-with-includes.cog.md` | This file — demonstrates the includes mechanism |
| `effective-doc-example.cog.md` | Shows effective doc resolution using the publication workflow |
