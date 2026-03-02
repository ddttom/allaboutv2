---
title: "Appendix K — MX Page Pattern YAML Template"
version: "1.1"
created: 2026-02-06
modified: 2026-02-27
author: Tom Cranstoun
description: "The canonical YAML frontmatter template for Appendix K page patterns. Copy this template when creating a new MX page pattern document."

mx:
  name: appendix-k-yaml-metadata
  status: active
  license: MIT
  category: template
  partOf: mx-the-gathering
  buildsOn: [field-dictionary]
  tags: [template, appendix-k, mx-pattern, yaml, frontmatter, page-pattern]
  audience: [machines, humans]

  contentType: template
  runbook: "Copy the YAML template below into a new .cog.md file. Fill in every field. Validate against datalake/knowledge/reference/schemas/mx-page-pattern.json."
---

# Appendix K — MX Page Pattern YAML Template

The canonical YAML frontmatter template for Appendix K page patterns. Every MX page pattern document uses this structure. The schema at `datalake/knowledge/reference/schemas/mx-page-pattern.json` validates this format.

## Usage

1. Copy the template below into a new `.cog.md` file
2. Fill in every field (remove placeholder comments)
3. Validate against the JSON schema

## Template

```yaml
---
title: ""                     # Name of the pattern (e.g., "K.2.1 Home Page Pattern")
subtitle: ""                  # Short description of the pattern's purpose
patternId: ""                 # Unique identifier (e.g., "K.2.1")
documentType: "mx-page-pattern"
author: "Tom Cranstoun"
editor: ""
coOwnership:
  - "Tom Cranstoun"
  - "MX‑Gathering Community"
  - "Machine Contributors (including Microsoft Copilot)"
version: "1.0"
status: "draft"
created: "YYYY-MM-DD"
purpose: ""                   # Why this pattern exists
audience:
  - practitioners
  - designers
  - developers
  - accessibility-specialists
  - ai-agents
tags:
  - "mx-pattern"
  - "appendix-k"
  - ""
principles:
  - machines-are-first-class-citizens
  - universal-metadata
  - convergence-principle
  - semantic-clarity
  - explicit-intent
  - open-standards
rights: "MIT License"
language: "en-GB"
canonicalUrl: ""              # URL of the published pattern
refersTo:
  - "mx-constitution"
  - "mx-std-001"
  - "appendix-k"
  - ""
metadataPhilosophy: >
  This pattern includes explicit metadata to support both humans and machines.
  Metadata is treated as infrastructure, not decoration, and is required for all MX-aligned assets.
patternType: ""               # e.g., "page", "component", "layout", "structure"
patternScope: ""              # e.g., "site-wide", "marketing", "blog", "commerce"
machineIntent: ""             # What an AI agent should understand this pattern to represent
humanIntent: ""               # What a human user should understand this pattern to represent
inputs:
  - ""                        # Required inputs for the pattern (e.g., title, hero image)
outputs:
  - ""                        # Expected outputs (e.g., JSON-LD, CTA structure)
validation:
  - ""                        # Rules for validating correct implementation
---
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Name of the pattern |
| subtitle | string | no | Short description |
| patternId | string | yes | Unique ID (format: `K.N` or `K.N.N`) |
| documentType | string | yes | Always `"mx-page-pattern"` |
| author | string | yes | Primary author |
| editor | string | no | Editor or reviewer |
| coOwnership | array | yes | Co-owners of the pattern |
| version | string | yes | Semantic version |
| status | string | yes | draft, active, deprecated |
| created | date | yes | Creation date |
| purpose | string | yes | Why this pattern exists |
| audience | array | no | Target audience |
| tags | array | no | Discovery tags |
| principles | array | yes | MX principles this pattern implements |
| rights | string | no | Licence |
| language | string | no | BCP 47 language tag |
| canonicalUrl | string | no | Published URL |
| refersTo | array | no | Related documents |
| metadataPhilosophy | string | yes | Why metadata matters for this pattern |
| patternType | string | yes | page, component, layout, or structure |
| patternScope | string | yes | Where the pattern applies |
| machineIntent | string | yes | What an AI agent should understand |
| humanIntent | string | yes | What a human should understand |
| inputs | array | yes | Required inputs |
| outputs | array | yes | Expected outputs |
| validation | array | yes | Validation rules |

## Schema

Validate page pattern frontmatter with:

```bash
# Using any JSON Schema validator against:
datalake/knowledge/reference/schemas/mx-page-pattern.json
```
