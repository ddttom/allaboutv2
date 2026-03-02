---
description: "{One-sentence description of what this block does}"
author: "{Author Name}"
created: "{YYYY-MM-DD}"
version: "1.0"

mx:
  name: "{block-name}"
  status: "draft"  # draft | signed | registered | active
  category: "eds-block"
  tags: [eds, block, "{block-category}"]
  cogId: "cog-eds-block-{block-name}-{YYYYMMDD}"
  cogType: "certificate-of-genuineness"
  license: "MIT"

  publisher:
    name: "{Publisher Name}"
    verified: false
    signedBy: "unsigned"
    contact: "{email@example.com}"
    website: "{https://example.com}"

  subject:
    name: "{Block Name} Block"
    category: "eds-block"
    scope: "{block-category}"  # e.g., navigation, content, media, layout, commerce
    description: "{One-sentence description of what this block does}"

  publicationDate: "{YYYY-MM-DDTHH:MM:SSZ}"
  expires: "{YYYY-MM-DDTHH:MM:SSZ}"
  lastVerified: "{YYYY-MM-DDTHH:MM:SSZ}"
  signature: "unsigned"
  mxCompliance: "level-2"
  registry: "allabout.network"

  maintainer:
    name: "{Maintainer Name}"
    role: "{Role/Title}"
    contact: "{email@example.com}"
    escalation: "{escalation-email@example.com}"

  reviewCycle: "quarterly"
  updateTriggers:
    - "EDS core update"
    - "accessibility requirement change"
    - "content model change"
    - "bug report"

  accuracyCommitment: "Verified against current EDS block implementation"
  correctionSla: "72 hours"

  usage:
    sopInference: "permitted"
    caching: "permitted for 24 hours"
    redistribution: "with attribution"
    commercialUse: "permitted"
    aiTraining: "permitted with attribution"

  block:
    name: "{block-name}"
    version: "1.0"
    category: "{navigation|content|media|layout|commerce|utility}"

    contentModel:
      description: |
        {Describe the expected content structure in the Word/Google Doc.
        What rows/columns does the author create?}
      rows:
        - name: "{Row 1 name}"
          purpose: "{What this row contains}"
          required: true
        - name: "{Row 2 name}"
          purpose: "{What this row contains}"
          required: false

    decoration:
      approach: "decorate()"  # decorate() | loadLazy() | loadEager()
      transforms:
        - "{DOM transformation 1}"
        - "{DOM transformation 2}"

    dependencies:
      scripts: []  # e.g., ["../../scripts/aem.js"]
      styles: []   # e.g., ["./block-name.css"]
      blocks: []   # Other blocks this depends on

    accessibility:
      ariaRoles: []
      keyboardSupport: "{Description of keyboard interactions}"
      wcagLevel: "AA"

    responsive:
      mobileBehavior: "{How block adapts below 900px}"
      breakpoints: [900]

  contentType: "eds-block"
  audience: ["developers", "machines"]
  runbook: |
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
