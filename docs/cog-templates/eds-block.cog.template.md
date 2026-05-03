---
description: '{One-sentence description of what this block does}'
author: '{Author Name}'
created: '{YYYY-MM-DD}'
version: '1.0'
title: '{block-name}'
mx:
  status: draft
  x-mx-category: eds-block
  tags:
  - eds
  - block
  - '{block-category}'
  x-mx-cogId: cog-eds-block-{block-name}-{YYYYMMDD}
  x-mx-cogType: certificate-of-genuineness
  license: MIT
  publisher:
    verified: false
    attestedBy: unattested
    contact: '{email@example.com}'
  publicationDate: '{YYYY-MM-DDTHH:MM:SSZ}'
  expires: '{YYYY-MM-DDTHH:MM:SSZ}'
  modified: '{YYYY-MM-DDTHH:MM:SSZ}'
  attestation: unattested
  mxCompliance: level-2
  registry: allabout.network
  maintainer:
    contact: '{email@example.com}'
    escalation: '{escalation-email@example.com}'
  reviewCycle: quarterly
  updateTriggers:
  - EDS core update
  - accessibility requirement change
  - content model change
  - bug report
  accuracyCommitment: Verified against current EDS block implementation
  correctionSla: 72 hours
  usage:
    sopInference: permitted
    caching: permitted for 24 hours
    redistribution: with attribution
    commercialUse: permitted
  block:
    version: '1.0'
    contentModel:
      description: '{Describe the expected content structure in the Word/Google Doc.
  canonicalUri: https://raw.githubusercontent.com/ddttom/allaboutv2/main/docs/cog-templates/eds-block.cog.template.md

        What rows/columns does the author create?}

        '
      rows:
      - purpose: '{What this row contains}'
        required: true
      - purpose: '{What this row contains}'
        required: false
    decoration:
      approach: decorate()
      transforms:
      - '{DOM transformation 1}'
      - '{DOM transformation 2}'
    responsive:
      mobileBehavior: '{How block adapts below 900px}'
      breakpoints:
      - 900
  contentType: eds-block
  audience:
  - developers
  - machines
  runbook: ''
---

# {Block Name} Block

{One paragraph describing what this block does and when to use it.}

## Content Model

{Describe how authors create content for this block in Word/Google Docs.}

### Structure

```
| {Block Name} |           |
|--------------|-----------|
| {Row 1}      | {Value}   |
| {Row 2}      | {Value}   |
```

### Fields

| Row | Content | Required | Notes |
|-----|---------|----------|-------|
| 1 | {Description} | Yes | {Additional notes} |
| 2 | {Description} | No | {Additional notes} |

## Decoration

The `decorate(block)` function transforms the authored content:

```javascript
export default async function decorate(block) {
  // {Describe transformation logic}
}
```

### Transformations

1. **{Transformation 1}** — {What it does}
2. **{Transformation 2}** — {What it does}

## Styling

Key CSS classes:

| Class | Purpose |
|-------|---------|
| `.{block-name}` | Container styles |
| `.{block-name}-{element}` | {Element description} |

## Accessibility

- **ARIA:** {Roles and attributes used}
- **Keyboard:** {Keyboard interactions supported}
- **Screen readers:** {How content is announced}

## Responsive Behavior

- **Desktop (≥900px):** {Desktop layout}
- **Mobile (<900px):** {Mobile adaptations}

## Examples

### Basic Usage

{Show a basic content example and resulting HTML.}

### Advanced Usage

{Show a more complex example if applicable.}

## Related Blocks

- **{Related block 1}** — {Relationship}
- **{Related block 2}** — {Relationship}

---

*Block maintained by {Maintainer Name}*
