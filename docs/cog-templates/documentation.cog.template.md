---
cog:
  version: "1.0"
  id: "cog-docs-{subject-slug}-{YYYYMMDD}"
  type: "certificate-of-genuineness"
  status: "draft"  # draft | signed | registered | active

  publisher:
    name: "{Publisher Name}"
    verified: false
    signedBy: "unsigned"
    contact: "{email@example.com}"
    website: "{https://example.com}"

  subject:
    name: "{Document Title}"
    category: "documentation"
    scope: "{doc-scope}"  # e.g., specification, tutorial, reference, guide, api
    description: "{One-sentence description of what this document covers}"

  publicationDate: "{YYYY-MM-DDTHH:MM:SSZ}"
  expires: "{YYYY-MM-DDTHH:MM:SSZ}"
  lastVerified: "{YYYY-MM-DDTHH:MM:SSZ}"

  signature: "unsigned"
  mxCompliance: "level-2"
  registry: "allabout.network"

governance:
  maintainer:
    name: "{Maintainer Name}"
    role: "{Role/Title}"
    contact: "{email@example.com}"
    escalation: "{escalation-email@example.com}"

  reviewCycle: "monthly"  # monthly | quarterly | annually
  updateTriggers:
    - "feature release"
    - "API change"
    - "user-reported inaccuracy"
    - "dependency update"

  accuracyCommitment: "{What accuracy standard this doc commits to}"
  correctionSla: "72 hours"

  usage:
    sopInference: "permitted"
    caching: "permitted for 24 hours"
    redistribution: "with attribution"
    commercialUse: "permitted"
    aiTraining: "permitted with attribution"

  licence: "MIT"
  licenceUrl: "https://opensource.org/licenses/MIT"

documentation:
  type: "{specification|tutorial|reference|guide|api|troubleshooting}"
  audience:
    primary: "{developers|content-authors|administrators|end-users}"
    secondary: "{optional secondary audience}"
    expertise_level: "{beginner|intermediate|advanced}"

  prerequisites:
    - "{Prerequisite 1}"
    - "{Prerequisite 2}"

  related_documents:
    - title: "{Related Doc Title}"
      path: "{relative/path/to/doc.md}"
      relationship: "{extends|requires|see-also}"

  version_applicability:
    product: "{Product Name}"
    versions: "{1.0+|2.x|specific version}"

contentType: "documentation"
audience: ["humans", "machines"]
runbook: |
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
*Last verified: {YYYY-MM-DD}*
