---
title: Partnership Report Tone Guidelines
description: Comprehensive framework for writing Cog-Nova-MX reports with partnership tone — strengths first, opportunities framed constructively, educational not critical
version: "1.0"
created: 2026-02-21
modified: 2026-02-21
author: Tom Cranstoun and Maxine

mx:
  category: manual
  status: active
  tags: [reporting, tone, partnership, mx-analysis, geo-analysis, writing-style]
  audience: [tech, business]

  partOf: mx-maxine-lives

  refersTo:
    - mx-messaging-framework

  contentType: manual
  runbook: |
  definition:
    standards:
      - name: "MX Writing Principles"
        version: "1.0"
        authority: "Cog-Nova-MX"
        compliance: "full"
      - name: "MX Messaging Framework"
        version: "1.0"
        authority: "Cog-Nova-MX"
        compliance: "full"

  provenance:
    source:
      examples:
        - geo_antworten_Boye & Co.pdf
        - geo_analyse_4.pdf
        - crm/strategy/2026-02-05-dotfusion-audit.md (v2.1)
        - mx-crm/outreach/reports/2026-02-04/arrivefirst-report-v2-partnership.md
---

# Partnership Report Tone Guidelines

**Comprehensive framework for writing Cog-Nova-MX reports with partnership tone.**

---

## Overview

ALL Cog-Nova-MX reports — whether **MX Analysis** (metadata/compliance), **GEO Analysis** (AI search visibility), web audits, or assessments — use the **partnership tone framework**.

**Core principle:** Reports should feel like **partnership opportunities**, not vendor proposals or critical audits.

**Goal:** Open doors, build relationships, demonstrate expertise through education rather than criticism.

---

## The Problem With Traditional Reports

### Traditional Technical Report Tone (❌ Avoid)

**Characteristics:**

- Leads with problems/failures
- Critical language ("violations", "critical gaps", "fails")
- Shame-based framing ("credibility paradox", "unacceptable")
- Vendor positioning ("we can fix this for you")
- Technical jargon without business context
- No strengths acknowledged

**Example:**
> "**Critical issues undermine credibility:** 349 WCAG 2.1 AA accessibility violations (all color contrast failures). Homepage performance is concerning at 61/100. Missing llms.txt blocks efficient discovery. **The credibility paradox:** For a technology advisory firm to have 349 accessibility errors raises the question clients will ask..."

**Why this fails:**

- Recipient feels criticized/judged
- Defensive reaction ("they don't understand our constraints")
- Report goes in drawer, no action taken
- No partnership conversation initiated

---

## The Partnership Report Framework

### Partnership Tone (✅ Use This)

**Characteristics:**

- **Leads with strengths** — what's working well
- **Opportunity framing** — gaps as service potential, not failures
- **Educational tone** — teach, don't criticize
- **Partnership positioning** — collaborate, not sell
- **Business context first** — technical evidence underneath
- **Acknowledges industry patterns** — not isolated criticism

**Example:**
> "Arrive First demonstrates **excellent technical fundamentals:** SEO averaging 97/100 (outstanding), best practices at 96/100, comprehensive Schema.org markup. Service pages perform **strongly** at 78-87/100. **349 color contrast patterns identified** represent **exactly the accessibility remediation service portfolio companies need** — demonstrating due diligence depth and creating a new revenue stream for post-acquisition optimization."

**Why this works:**

- Recipient feels understood and respected
- Open to conversation ("they get our business")
- Action plan feels collaborative, not prescriptive
- Partnership discussion naturally follows

---

## The Four Pillars of Partnership Tone

### Pillar 1: Strengths First (ALWAYS)

**Rule:** Every report MUST start with what's working well.

**Rationale:** Establishes credibility, builds trust, creates receptive mindset for opportunities.

**How to find strengths:**

- What scores well? (SEO, performance, accessibility, structured data)
- What's configured correctly? (robots.txt, sitemap, Schema.org)
- What demonstrates good practices? (zero HTML errors, semantic structure, fast service pages)
- What's industry-leading? (any score >90/100)

**Template:**

```markdown
## Strengths Analysis

### [Strength Category 1]

**[Specific metric/achievement]** demonstrates [what this enables]:

- [Evidence point 1]
- [Evidence point 2]
- [Evidence point 3]

**What this enables:** [Business outcome or technical foundation]

### [Strength Category 2]

[Repeat pattern]
```

**Example:**

```markdown
## Strengths Analysis

### Excellent SEO Foundation

**97/100 average SEO score** demonstrates industry-leading optimization:

- Pre-acquisition services: 100/100 (perfect)
- Expert witness services: 96/100 (excellent)
- Homepage: 92/100 (excellent)

**What this enables:** Organic search traffic already delivers qualified leads. The SEO foundation provides the baseline for AI discovery enhancement.
```

**Anti-pattern (❌ Don't do this):**

```markdown
## Executive Summary

While some areas perform adequately, critical issues undermine overall effectiveness...
```

---

### Pillar 2: Opportunity Framing (Not Failure Framing)

**Rule:** Frame ALL gaps, issues, or missing elements as **opportunities**, not failures.

**Language transformation:**

| ❌ Avoid | ✅ Use Instead |
|----------|----------------|
| "Critical issues" | "Optimization opportunities" |
| "Violations" | "Patterns identified" |
| "Fails" | "Enhancement areas" |
| "Missing" (negative) | "Quick win opportunity" |
| "Unacceptable" | "Target for improvement" |
| "Concerning" | "Optimization priority" |
| "Undermines credibility" | "Service expansion potential" |
| "Error" | "Pattern requiring review" |

**Opportunity framing strategies:**

1. **Service expansion framing:**
   > "349 color contrast patterns identified represent **exactly the accessibility remediation service portfolio companies need**"

2. **Industry-wide pattern framing:**
   > "These patterns are common across [industry] sites built before AI agent requirements emerged"

3. **First-mover advantage framing:**
   > "12-18 month advantage window before competitors recognize AI discovery as competitive differentiator"

4. **Quick win framing:**
   > "llms.txt implementation (2-4 hours) provides immediate AI discovery improvement"

5. **Technical foundation framing:**
   > "Service pages perform strongly at 78-87/100 — same optimization patterns applicable to homepage"

**Template:**

```markdown
## Opportunity Analysis

### [Opportunity Category]

**Current state:** [Neutral description of what exists today]

**What this provides:** [The opportunity/benefit of addressing this]

**Business impact:** [Why this matters to their goals]

**Implementation:** [How easy/quick this is to achieve]
```

**Example:**

```markdown
## Opportunity Analysis

### AI Discovery Enhancement Layer

**Current state:** llms.txt returns 404 (not yet implemented)

**What this provides:** Structured README for AI agents containing service taxonomy, expertise areas, target markets, team credentials

**Business impact:** When PE analysts ask AI assistants "Who provides pre-acquisition technology due diligence?", agents consult llms.txt first for efficient discovery

**Implementation:** 2-4 hours to create, immediate discoverability improvement
```

**Anti-pattern (❌ Don't do this):**

```markdown
## Critical Gaps

**Missing llms.txt (404)** blocks AI agent discovery optimization. Without llms.txt, your site is invisible to AI recommendation engines.
```

---

### Pillar 3: Educational (Not Critical)

**Rule:** Teach the reader, demonstrate expertise through explanation.

**Educational tone strategies:**

1. **Explain WHY it matters:**
   > "For M&A technology advisory firms, color contrast remediation expertise demonstrates: **Due diligence depth** (understanding accessibility = understanding regulatory risk), **Quality standards** (if you fix accessibility proactively, clients trust you'll find liabilities in target companies), **Service expansion** (accessibility auditing = new revenue stream)"

2. **Provide context:**
   > "AI agents parse semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`) to understand content hierarchy. Without verified semantic structure, agents process navigation, footer, and content with equal weight — diluting signal clarity."

3. **Show, don't tell:**
   > Include code examples, before/after comparisons, competitive tables

4. **Multiple perspectives:**
   > Show how different AI providers (ChatGPT, Claude, Gemini, Perplexity, Mistral) respond

5. **Decision frameworks:**
   > "How to choose" sections, tier systems, comparative analysis

**Template:**

```markdown
### [Topic]

**What this is:** [Brief explanation]

**Why this matters:** [Business/technical context]

**How it works:** [Technical detail with code examples if helpful]

**Expected outcome:** [What happens when implemented correctly]
```

**Example:**

```markdown
### llms.txt — Structured README for AI Agents

**What this is:** A plain text file at `https://domain.com/llms.txt` containing structured information about your services, expertise, and contact details

**Why this matters:** AI agents (ChatGPT, Claude, Perplexity) consult llms.txt before crawling entire sites — it's like a sitemap specifically for AI discovery

**Example structure:**

```markdown
# Company Name — Service Category

> Brief description

## Services

- Service 1
- Service 2

## Contact

https://company.com/contact
```

**Expected outcome:** AI agents find and cite your services 3-5x faster than sites requiring full crawling

```

**Anti-pattern (❌ Don't do this):**

```markdown
llms.txt is missing. You need to add this immediately.
```

---

### Pillar 4: Partnership Positioning (Not Vendor Positioning)

**Rule:** Position report as **capabilities demonstration for partnership discussion**, not vendor proposal.

**Partnership positioning strategies:**

1. **Mutual value framing:**
   > "Combine MX audit depth with [Client]'s [unique expertise] to offer comprehensive AI readiness services to clients"

2. **Service expansion opportunity:**
   > "Position [finding] as service offering to [client's customers] — new revenue stream"

3. **White-label collaboration:**
   > "[Client] could offer MX audits to clients under their brand. Revenue share model."

4. **Advisory/founding member opportunity:**
   > "Prospective advisory board member for Cog-Nova-MX, possible founder member of MX community (limited to 6 agencies)"

5. **Industry-first positioning:**
   > "Be the first [industry category] with complete AI discovery optimization"

**Template:**

```markdown
## Partnership Context

This report demonstrates the MX [Analysis Type] — the technical analysis capability that Cog-Nova-MX is developing for [partnership with industry category].

[Client Contact Name] ([Title]) is a [relationship context: prospective advisory board member / founding member opportunity / strategic partner]. This relationship shapes the purpose of this document: it is a capabilities demonstration for a partnership discussion, not a vendor proposal.

The analysis uses [client-url] as the demonstration case. The patterns identified here [frame as industry-wide, not client-specific]. They represent the service opportunity — exactly the gaps that [client's customers] are now asking to have addressed.
```

**Example:**

```markdown
## Partnership Context

This report demonstrates the MX Web Audit Suite — the technical analysis capability that Cog-Nova-MX is developing for white-label partnership with digital agencies.

Chris Bryce (Dotfusion CEO) is a prospective advisory board member for Cog-Nova-MX and a possible founder member of the MX community, limited to six founding agencies. This relationship shapes the purpose of this document: it is a capabilities demonstration for a partnership discussion, not a vendor proposal.

The analysis uses dotfusion.com as the demonstration case. The patterns identified here are common across agency sites built before AI agent requirements emerged. They represent the service opportunity — exactly the gaps that digital agency clients are now asking to have addressed.
```

**Anti-pattern (❌ Don't do this):**

```markdown
## Executive Summary

We've identified several issues with your website that require immediate attention. Cog-Nova-MX can fix these problems for you.
```

---

## Report Structure Template

### Standard Partnership Report Structure

ALL reports follow this structure (from GEO sample reports):

```markdown
---
[YAML frontmatter with runbook: "partnership tone guidance" under mx:]
---

# [Client Name]: MX Analysis & Partnership Opportunity

**Report ID:** [ID]
**Date:** [Date]
**Prepared by:** Tom Cranstoun, Cog-Nova-MX Ltd
**Confidential:** For [Client] leadership only

---

## Partnership Context

[1-2 paragraphs: why this report exists, relationship context, purpose]

---

## Executive Summary

[2-3 paragraphs: strengths highlighted, opportunity framed constructively, partnership potential]

### [Analysis Type] Scores

[Table with scores and industry benchmarks]

[1 paragraph interpreting scores in partnership context]

---

## Strengths Analysis

[ALWAYS FIRST — organized by category, specific evidence, genuine acknowledgment]

### [Strength Category 1]

[Evidence + what this enables]

### [Strength Category 2]

[Repeat]

---

## Opportunity Analysis

[Frame gaps as opportunities, organized by category]

### [Opportunity Category 1]

**Current state:** [Neutral]
**What this provides:** [Benefit]
**Business impact:** [Why it matters]
**Implementation:** [Effort estimate]

### [Opportunity Category 2]

[Repeat]

---

## [Optional: Competitive Landscape — for GEO reports]

[Show where client sits vs competitors, frame positioning opportunity]

---

## Recommended Action Plan

### Quick Wins (0-30 Days)

[5-7 high-impact, low-effort actions with time estimates]

### Foundation Building (1-2 Months)

[Strategic improvements with phases]

### Long-term Strategy (3-6 Months)

[Sustained optimization]

---

## KPIs & Success Metrics

### Primary Metrics

[Measurable outcomes with timelines]

### Secondary Metrics

[Supporting measurements]

### Tracking Schedule

[How often to review]

---

## Success Timeline

[Milestone-based timeline with concrete dates]

---

## Partnership Opportunity

[Specific collaboration models: white-label, advisory, service expansion]

---

## Engagement Options

### Option 1: Foundation Package

**Duration:** X weeks
**Investment:** £X-£Y

**Includes:** [Bullet list]
**Outcome:** [Expected result]

### Option 2: Comprehensive [Analysis Type]

[Repeat pattern]

### Option 3: Strategic Partnership

[Repeat pattern]

---

## Next Steps

[Clear call to action]

---

## Appendix A: Methodology

[Brief explanation of approach, tools, standards]

---

## Appendix B: Technical Details

[Detailed findings for technical stakeholders]
```

---

## Writing Checklist

Before sending ANY report, verify:

### ✅ Tone Checklist

- [ ] **Strengths section comes BEFORE opportunities** (not buried at end)
- [ ] **No critical/negative language** in first 2 sections (Executive Summary, Strengths)
- [ ] **All gaps framed as opportunities** (not failures/violations/errors)
- [ ] **Partnership context clear** (not vendor pitch)
- [ ] **Educational tone throughout** (teach, don't criticize)
- [ ] **Business outcomes stated** for every technical finding
- [ ] **Industry-wide patterns acknowledged** (not isolated criticism)
- [ ] **Service expansion opportunities identified** where relevant

### ✅ Structure Checklist

- [ ] YAML frontmatter includes `runbook` (under `mx:`) with partnership tone guidance
- [ ] Partnership Context section present (explains why report exists)
- [ ] Executive Summary highlights strengths first
- [ ] Scores table shows benchmarks (not just raw scores)
- [ ] Strengths Analysis is comprehensive (3+ categories)
- [ ] Opportunity Analysis uses constructive language
- [ ] Action Plan has 3 phases (Quick Wins / Foundation / Long-term)
- [ ] KPIs & Success Metrics with timelines
- [ ] Success Timeline with concrete milestones
- [ ] Partnership Opportunity section (collaboration models)
- [ ] Engagement Options (3 packages with outcomes)
- [ ] Next Steps (clear call to action)

### ✅ Language Checklist

- [ ] No uses of: "critical issues", "violations", "fails", "concerning", "unacceptable"
- [ ] Uses: "opportunities", "patterns identified", "enhancement areas", "optimization targets"
- [ ] First-person plural avoided ("we found issues" → "analysis identified patterns")
- [ ] Passive construction for findings ("349 patterns identified" not "we found 349 violations")
- [ ] Active construction for opportunities ("llms.txt provides immediate improvement")

---

## Common Transformations

### Homepage Performance

**❌ Critical tone:**
> "Homepage performance is concerning at 61/100 with an 11.8-second Largest Contentful Paint. This is unacceptable and undermines first impressions."

**✅ Partnership tone:**
> "Homepage optimization opportunity: Service pages perform strongly at 78-87/100, demonstrating optimization expertise. Applying the same patterns to homepage targets 75-85/100 performance score with LCP <2.5s — 79% faster first impressions."

---

### Accessibility Issues

**❌ Critical tone:**
> "349 WCAG 2.1 AA violations found (all color contrast failures). For a technology advisory firm to have basic accessibility errors raises credibility questions."

**✅ Partnership tone:**
> "349 color contrast patterns identified represent exactly the accessibility remediation service portfolio companies need. For M&A advisory, this demonstrates: **Due diligence depth** (understanding accessibility = understanding regulatory risk), **Quality standards** (proactive fixes build client trust), **Service expansion** (accessibility auditing = new revenue stream for post-acquisition optimization)."

---

### Missing Features

**❌ Critical tone:**
> "llms.txt is missing (404). This blocks AI agent discovery and means your site is invisible to AI recommendation engines."

**✅ Partnership tone:**
> "llms.txt quick win opportunity (2-4 hours implementation): Structured README for AI agents containing service taxonomy, expertise areas, target markets. When PE analysts ask AI assistants 'Who provides pre-acquisition technology due diligence?', agents consult llms.txt first for efficient discovery. Immediate discoverability improvement."

---

### SEO/Structure Issues

**❌ Critical tone:**
> "Semantic HTML structure is broken. Missing `<main>` elements prevent agents from parsing content correctly."

**✅ Partnership tone:**
> "Semantic HTML verification opportunity (4-8 hours audit): Confirm `<main>`, `<article>`, `<section>`, `<nav>` tags present across all pages. AI agents parse semantic HTML to understand content hierarchy — verified structure ensures reliable navigation. Documentation outcome provides foundation for ongoing MX compliance."

---

## Team Guidance

### For Report Writers

**When writing reports:**

1. **Start by finding 5+ genuine strengths** (scores, configuration, practices)
2. **Frame every gap as "what this enables" not "what's broken"**
3. **Add business context** for every technical finding
4. **Use industry-wide pattern language** ("common across [category] sites")
5. **Include partnership opportunity** section (white-label, advisory, service expansion)
6. **Provide concrete timelines** (Quick Wins 0-30 days, Foundation 1-2 months, Long-term 3-6 months)

### For Reviewers

**When reviewing reports:**

1. **Check strengths come first** (before opportunities)
2. **Flag critical/negative language** ("violations" → "patterns identified")
3. **Verify partnership context** present (not vendor positioning)
4. **Confirm educational tone** (teach, don't criticize)
5. **Validate business outcomes** stated for technical findings

### For Client Conversations

**When discussing reports:**

- "This analysis demonstrates our MX Web Audit Suite capabilities"
- "The patterns identified are industry-wide, representing service opportunity for your clients"
- "Your strong SEO foundation (97/100) provides the baseline for AI discovery enhancement"
- "Quick wins deliver immediate improvement within 30 days"
- "Partnership models include white-label, advisory board, service expansion"

---

## Examples Gallery

**Reference reports demonstrating partnership tone:**

1. **Dotfusion MX Analysis (v2.1):** [mx-crm/strategy/2026-02-05-dotfusion-audit.md](../../../../../mx-crm/strategy/2026-02-05-dotfusion-audit.md)
   - Partnership context with advisory board positioning
   - Strengths-first approach
   - Service opportunity framing ("299 patterns = exactly what clients need")

2. **ArriveFirst MX Analysis (v2.0):** [mx-crm/outreach/reports/2026-02-04/arrivefirst-report-v2-partnership.md](../../../../mx-crm/outreach/reports/2026-02-04/arrivefirst-report-v2-partnership.md)
   - Excellent SEO foundation highlighted first (97/100)
   - Color accessibility as service expansion opportunity
   - AI readiness as new revenue stream positioning

3. **Boye & Co GEO Analysis:** [geo_antworten_Boye & Co.pdf](../../../../geo_antworten_Boye%20&%20Co.pdf)
   - Comparative consulting firm analysis
   - Educational tone ("How to choose" sections)
   - Multiple perspectives (5 AI providers)
   - Decision frameworks (tier systems)

4. **Boye & Co Strategic Optimization:** [geo_analyse_4.pdf](../../../../geo_analyse_4.pdf)
   - Strengths Analysis → Weaknesses Analysis structure
   - Concrete action recommendations (Quick Wins 0-30 days, Long-term 3-6 months)
   - KPIs with success timeline
   - Provider-specific optimization guidance

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Credibility Shaming

**DON'T:**
> "For a [industry] firm to have [issue] raises the question clients will ask: 'If they can't get [basic thing] right, how can they [core service]?'"

**WHY:** Shame-based framing closes doors. Recipient feels attacked, not understood.

**DO INSTEAD:**
> "[Finding] represents [service opportunity]. For [industry], this demonstrates [expertise area 1], [expertise area 2], [service expansion potential]."

---

### ❌ Anti-Pattern 2: Leading With Problems

**DON'T:**
> "While some areas perform adequately, critical issues undermine overall effectiveness..."

**WHY:** Sets negative tone immediately. Recipient becomes defensive.

**DO INSTEAD:**
> "[Client] demonstrates excellent technical fundamentals: [strength 1], [strength 2], [strength 3]. The technical foundation is solid and ready for optimization."

---

### ❌ Anti-Pattern 3: Vendor Positioning

**DON'T:**
> "We've identified several issues that require immediate attention. Cog-Nova-MX can fix these problems for you."

**WHY:** Sounds like sales pitch. Recipient questions motives.

**DO INSTEAD:**
> "This report demonstrates Cog-Nova-MX' analytical capabilities and partnership approach. The patterns identified represent collaboration opportunities rather than isolated criticism."

---

### ❌ Anti-Pattern 4: Technical Jargon Without Context

**DON'T:**
> "Missing `<main>` semantic HTML elements prevent proper DOM traversal by server-side agents."

**WHY:** Technical audience understands, business audience doesn't. Report fails dual-audience test.

**DO INSTEAD:**
> "Semantic HTML verification opportunity: AI agents parse `<main>` tags to identify primary content (vs navigation/footer). Verified structure ensures agents extract the right information when recommending your services to prospects."

---

## Success Metrics

**How to measure partnership tone effectiveness:**

1. **Response rate:** % of reports that generate partnership conversation (target: 60%+)
2. **Time to response:** Days from report delivery to first conversation (target: <7 days)
3. **Conversion to engagement:** % of reports that lead to paid work (target: 30%+)
4. **Referral rate:** % of clients who refer Cog-Nova-MX to others (target: 40%+)
5. **Testimonial quality:** Clients describe reports as "collaborative", "educational", "partnership-focused"

**Failure indicators:**

- Report goes in drawer, no follow-up
- Defensive response ("you don't understand our constraints")
- Request for cheaper options (price-shopping, not partnership)
- No referrals or repeat business

---

## Version History

**v1.0 (2026-02-21):** Initial framework based on GEO sample reports and Dotfusion/ArriveFirst transformations

---

**Maintained by:** Tom Cranstoun and Maxine
**Status:** Active — single source of truth for partnership report tone
**Review schedule:** Quarterly (or when new report patterns emerge)
