---

mx:
  cog:
    version: "1.0"
    id: "cog-{publisher-id}-{subject-slug}-{YYYYMMDD}"
    type: "certificate-of-genuineness"
    status: "draft"  # draft | attested | registered | active

    publisher:
      name: "{Publisher Name}"
      verified: false
      attestedBy: "unattested"
      contact: "{email@example.com}"
      website: "{https://example.com}"

    subject:
      name: "{Landing Page Title}"
      category: "landing-page"
      scope: "{page-scope}"  # e.g., product-intro, coming-soon, demo
      description: "{One-sentence description of what this page communicates}"

    publicationDate: "{YYYY-MM-DDTHH:MM:SSZ}"
    expires: "{YYYY-MM-DDTHH:MM:SSZ}"  # Typically 6 months from issued
    maintainedDate: "{YYYY-MM-DDTHH:MM:SSZ}"

    attestation: "unattested"
    mxCompliance: "level-2"
    registry: "allabout.network"

  governance:
    maintainer:
      name: "{Maintainer Name}"
      role: "{Role/Title}"
      contact: "{email@example.com}"
      escalation: "{escalation-email@example.com}"

    reviewCycle: "quarterly"  # monthly | quarterly | annually
    updateTriggers:
      - "product/service changes"
      - "pricing updates"
      - "branding changes"
      - "user-reported inaccuracy"

    accuracyCommitment: "{What this page promises to accurately represent}"
    correctionSla: "72 hours"

    usage:
      sopInference: "permitted"
      caching: "permitted for 24 hours"
      redistribution: "with attribution"
      commercialUse: "permitted"
      aiTraining: "permitted with attribution"

    licence: "MIT"
    licenceUrl: "https://opensource.org/licenses/MIT"

  contentType: "landing-page"
  audience: ["humans", "machines"]
  runbook: |
---

# {Landing Page Title}

{Opening hook — one paragraph that captures attention and states the value proposition.}

## {Section 1: The Problem or Context}

{Describe the situation, problem, or context this page addresses. 2-3 paragraphs.}

## {Section 2: The Solution or Offering}

{Describe what you're offering, how it helps, key benefits. 2-3 paragraphs.}

## {Section 3: Key Details}

{Specifics — features, dates, pricing, specifications. Use tables or lists for clarity.}

| Item | Detail |
|------|--------|
| {Feature 1} | {Description} |
| {Feature 2} | {Description} |

## {Section 4: Call to Action}

{What should the reader do next? Clear next steps, contact information, links.}

- **Contact:** {email or link}
- **Learn more:** {URL}

---

*{Publisher Name} — {Tagline or mission statement}*
