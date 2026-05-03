---
title: '[TITLE]'
author: '[AUTHOR]'
created: '[YYYY-MM-DD]'
mx:
  cog:
    version: '1.0'
    id: cog-docs-{subject-slug}-{YYYYMMDD}
    status: draft
    publisher:
      verified: false
      attestedBy: unattested
      contact: '{email@example.com}'
    publicationDate: '{YYYY-MM-DDTHH:MM:SSZ}'
    expires: '{YYYY-MM-DDTHH:MM:SSZ}'
    attestation: unattested
    mxCompliance: level-2
    registry: allabout.network
  governance:
    maintainer:
      contact: '{email@example.com}'
      escalation: '{escalation-email@example.com}'
    reviewCycle: monthly
    updateTriggers:
    - feature release
    - API change
    - user-reported inaccuracy
    - dependency update
    accuracyCommitment: '{What accuracy standard this doc commits to}'
    correctionSla: 72 hours
    usage:
      sopInference: permitted
      caching: permitted for 24 hours
      redistribution: with attribution
      commercialUse: permitted
    licence: MIT
    licenceUrl: https://opensource.org/licenses/MIT
  contentType: documentation
  audience:
  - humans
  - machines
  runbook: ''
  canonicalUri: https://raw.githubusercontent.com/ddttom/allaboutv2/main/docs/cog-templates/documentation.cog.template.md
---

# {Document Title}

{Opening paragraph — what this document covers, who it's for, and what the reader will learn.}

## Overview

{High-level summary of the topic. 2-3 paragraphs providing context and orientation.}

### Key Concepts

| Concept | Definition |
|---------|------------|
| {Term 1} | {Definition} |
| {Term 2} | {Definition} |

## {Section 1: Core Content}

{Main instructional or reference content. Structure depends on document type:}

- **Tutorial:** Step-by-step instructions
- **Reference:** Organized by feature/component
- **Specification:** Formal definitions
- **Guide:** Conceptual explanations

### {Subsection 1.1}

{Detailed content with examples.}

```{language}
// Code example if applicable
```

### {Subsection 1.2}

{Additional content.}

## {Section 2: Additional Details}

{Supporting information — configuration options, parameters, edge cases.}

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `{option1}` | {type} | {default} | {description} |
| `{option2}` | {type} | {default} | {description} |

## Troubleshooting

{Common issues and solutions.}

### {Problem 1}

**Symptom:** {What the user observes}

**Cause:** {Why it happens}

**Solution:** {How to fix it}

## See Also

- [{Related Document 1}]({path}) — {brief description}
- [{Related Document 2}]({path}) — {brief description}

## Changelog

| Date | Version | Change |
|------|---------|--------|
| {YYYY-MM-DD} | 1.0 | Initial release |

---

*Maintained by {Maintainer Name}, {Organization}*
*Last maintained: {YYYY-MM-DD}*
