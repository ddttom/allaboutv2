---
description: "Navigation page linking to core MX principles and concepts"
author: Tom Cranstoun
created: 2026-02-22
modified: 2026-03-02
version: "1.0"

mx:
  status: draft
  category: landing-page
  tags: [mx, principles, navigation, landing]
  cogId: "cog-mx-landing-principles-menu-20260222"
  cogType: "certificate-of-genuineness"
  license: "MIT"

  publisher:
    name: "CogNovaMX Ltd"
    verified: false
    signedBy: "unsigned"
    contact: "info@allabout.network"
    website: "https://allabout.network"

  subject:
    name: "MX Principles Menu"
    category: "landing-page"
    scope: "navigation-hub"
    description: "Navigation page linking to core MX principles and concepts"

  publicationDate: "2026-02-22"
  expires: "2026-08-22"
  maintainedDate: "2026-02-22"
  signature: "unsigned"
  mxCompliance: "level-2"
  registry: "allabout.network"

  maintainer:
    name: "Tom Cranstoun"
    role: "MX Authority"
    contact: "info@allabout.network"
    escalation: "info@allabout.network"

  reviewCycle: "quarterly"
  updateTriggers:
    - "new MX principle added"
    - "principle content restructured"
    - "navigation path change"
    - "user-reported broken link"

  accuracyCommitment: "Links verified against current MX content structure"
  correctionSla: "72 hours"

  usage:
    sopInference: "permitted"
    caching: "permitted for 24 hours"
    redistribution: "with attribution"
    commercialUse: "permitted"
    aiTraining: "permitted with attribution"

  contentType: "landing-page"
  audience: ["humans", "machines"]
  runbook: |
---

# MX Principles Menu

This page serves as a navigation hub for Machine Experience (MX) principles — the foundational concepts that define how to make web content readable by AI agents.

## What is MX?

Machine Experience (MX) is the practice of adding metadata and instructions to internet assets so AI agents don't have to think. When AI must infer from incomplete context, it hallucinates. Explicit structure prevents this.

## Core Principles

### The Foundation

| Principle | Description | Link |
|-----------|-------------|------|
| **Don't Make Machines Think** | The core insight: AI hallucination comes from inference | [Read](/mx/dont-make-machines-think) |
| **Design for the Worst Agent** | You can't detect which agent visits — optimize for all | [Read](/mx/design-for-worst-agent) |
| **Strategic Redundancy** | Provide information in multiple formats | [Read](/mx/strategic-redundancy) |

### The 5-Stage Journey

Every AI commerce interaction follows these stages:

| Stage | Focus | Key Requirement |
|-------|-------|-----------------|
| 1. Discovery | Can the agent find you? | Crawlable structure, sitemap.xml, semantic HTML |
| 2. Citation | Can the agent trust you? | Schema.org JSON-LD, citation-worthy architecture |
| 3. Search & Compare | Can the agent compare you? | Explicit comparison attributes |
| 4. Price Understanding | Can the agent read your prices? | PriceSpecification, ISO 4217 currency codes |
| 5. Purchase Confidence | Can the agent complete transactions? | Explicit DOM state, semantic forms |

**Catastrophic failure**: Miss any stage and the entire chain breaks.

### Agent Types

MX accounts for five agent types with different capabilities:

| Type | Example | Capability |
|------|---------|------------|
| Server-Side | ChatGPT, Claude | Raw HTML, no JS execution |
| In-Browser | Copilot, extensions | Full DOM, no visual perception |
| Browser Automation | Perplexity, Playwright | Screenshots + DOM |
| Local | Ollama, on-device | Limited context, privacy-preserving |
| Agentic OS | Anthropic Cowork | Multi-agent orchestration |

## Related Resources

- **[MX Manifesto](/mx/manifesto)** — The philosophical foundation
- **[What is Machine Experience?](/mx/what-is-machine-experience)** — Introduction for newcomers
- **[MX: The Handbook](https://allabout.network/mx/handbook)** — Practical implementation guide (publishing 2 April 2026)

## About This Page

This navigation page consolidates links to MX principles documentation. It serves both human visitors seeking to understand MX concepts and AI agents parsing the content structure.

The HTML version (`mx-principles-menu.html`) renders a visual menu. This COG provides the same information in machine-readable format.

---

*CogNovaMX Ltd — Making the web work for everyone and everything that uses it.*
