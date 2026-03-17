---
version: "1.2.0"
description: "Comprehensive web audit — crawl pages, analyse accessibility, performance, SEO, and AI agent suitability, then generate a partnership-ready executive report."

created: 2026-02-14
modified: 2026-02-14

author: Tom Cranstoun and Maxine

mx:
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: published

  category: mx-sales
  partOf: mx-os
  refersTo: [cog-unified-spec, mx-principles]
  buildsOn: [what-is-a-cog, building-action-docs]
  tags: [audit, web-audit, accessibility, wcag, performance, seo, ai-agents, llms-txt, sales-enablement, partnership, white-label, report-generation]

  audience: agents
  readingLevel: advanced

  execute:
    runtime: runbook
    command: mx audit
    actions:
      - name: audit
        description: Run the full audit pipeline — crawl, analyse, inspect, verify, generate report
        usage: |
          Run all actions in sequence: recon → crawl → analyse → inspect → check-discovery → verify-claims → select-template → generate-report → lint → summary.
          This is the primary workflow. It produces a complete executive report from a URL.
          CRITICAL: The verify-claims step runs BEFORE report generation. Never publish discovery claims without evidence.
        inputs:
          - name: url
            type: string
            required: true
            description: "Client website URL to audit (must include https://)"
          - name: max-pages
            type: number
            required: false
            description: "Maximum pages to crawl (default: 9)"
        outputs:
          - name: report-path
            type: string
            description: "Path to the generated report file"
          - name: summary
            type: object
            description: "Key scores, template used, verification status"

      - name: recon
        description: Pre-inference data collection — gather all raw data before AI analysis
        usage: |
          Run the standalone bash script to collect all reconnaissance data.
          This is the FIRST step — gather data cheaply with curl, then feed it to the AI.

          Script: scripts/mx-audit-recon.sh

          Run it:
            bash scripts/mx-audit-recon.sh <URL> [--slug NAME] [--max-pages N]

          What it collects:
          1. robots.txt — crawler permissions and sitemap location
          2. llms.txt — AI agent discovery file (root and .well-known)
          3. sitemap.xml — page index for URL discovery
          4. Homepage HTML — full DOM for analysis
          5. HTTP headers — security headers, redirects, server info
          6. Page HTML — up to max-pages from sitemap
          7. Meta extraction — title, description, OG tags, JSON-LD, headings
          8. Security headers — extracted for quick reference

          Output: /tmp/mx-audit/{slug}/{date}/
          Manifest: /tmp/mx-audit/{slug}/{date}/manifest.yaml

          The manifest is the AI's entry point. Read it first. It lists every
          collected file with status, size, and description.

          After recon completes:
          - Read manifest.yaml to understand what was collected
          - Read meta-extract.txt for a quick overview
          - Read security-headers.txt for security posture
          - Read homepage.html for deep DOM analysis
          - Read individual pages for site-wide patterns

          This separates data gathering (deterministic, cheap) from analysis
          (AI inference, expensive). Cut compute, not context.
        inputs:
          - name: url
            type: string
            required: true
            description: "Website URL to audit"
          - name: slug
            type: string
            required: false
            description: "Client slug for directory naming (default: derived from domain)"
          - name: max-pages
            type: number
            required: false
            description: "Max pages to fetch from sitemap (default: 9)"
        outputs:
          - name: output-dir
            type: string
            description: "Path to collected data directory"
          - name: manifest
            type: string
            description: "Path to manifest.yaml"

      - name: crawl
        description: Run the automated web audit suite against a URL
        usage: |
          1. Validate URL format (must start with https://)
          2. Create output directory: mx-crm/outreach/YYYY-MM-DD/
          3. Extract client name from domain (e.g. dotfusion.com → dotfusion)

          4. Run the audit with cache cleared:
             npm run audit:start -- -s [URL] -c [MAX_PAGES] --no-recursive --force-delete-cache

          5. Wait for completion (2-5 minutes typical)

          6. Verify results in mx-audit/results/:
             - results.json — complete analysis data
             - executive_summary.md — overall scores
             - accessibility_report.csv — WCAG compliance (Pa11y)
             - llm_general_suitability.csv — AI agent compatibility
             - seo_scores.csv — SEO metrics
             - image_optimization.csv — image analysis
             - performance_metrics.csv — load times, FCP, CLS
             - security_report.csv — security headers
             - content_quality.csv — content analysis

          7. Read ALL result files and extract key metrics:

             Performance: average load time, FCP, CLS, overall score (0-100)
             Accessibility: total WCAG AA errors by page, critical issues, colour contrast, ARIA, alt text
             AI Agent Suitability: served HTML score, rendered HTML score, main/nav/Schema.org/Open Graph presence
             SEO: title optimisation, meta descriptions, image alt text percentage, structured data
             Image Optimisation: total images, lazy loading, alt text, width/height attributes

          CRITICAL: Always use --force-delete-cache. Never reuse cached results.
          CRITICAL: Always use --no-recursive to limit crawling scope.
        inputs:
          - name: url
            type: string
            required: true
            description: "URL to audit"
          - name: max-pages
            type: number
            required: false
            description: "Page limit (default: 9)"
        outputs:
          - name: results
            type: object
            description: "All metrics extracted from audit result files"

      - name: inspect
        description: Manual HTML verification via WebFetch — supplements automated findings
        usage: |
          Skip this action if the URL ends with .xml (sitemap files).

          1. Extract homepage URL:
             - Read mx-audit/results/results.json
             - Use the first URL from results
             - OR extract base domain from sitemap URL if provided

          2. Use WebFetch to fetch and analyse the homepage HTML with this prompt:

             "Analyse this HTML page comprehensively for accessibility and AI agent compatibility:

             1. DOM Structure:
                - Heading hierarchy (H1-H6 presence, order, nesting)
                - Multiple H1s or skipped heading levels?
                - Semantic landmarks (main, header, footer, nav, aside, article, section)
                - Empty structural elements?

             2. Metadata:
                - Does html tag have lang attribute?
                - Character encoding declared?
                - Viewport properly configured?

             3. Accessibility:
                - Navigation structure and skip links
                - Form accessibility (labels, fieldsets, ARIA, autocomplete attributes)
                - Interactive elements (proper button/link usage, ARIA states)
                - Keyboard navigation support

             4. Code Quality:
                - Redundant ARIA on semantic elements (e.g. nav with role=navigation)
                - Semantic violations (divs instead of buttons/links)
                - Heading structure issues

             5. Positive Patterns:
                - Well-implemented accessibility features
                - Good semantic structure
                - Proper ARIA usage
                - Image optimisation (lazy loading, responsive, WebP)

             For each finding: specific code examples (current HTML), fixed code examples (recommended), WCAG violation codes, user impact, AI agent impact."

          3. Structure findings into categories:
             - critical: WCAG Level A violations with code examples and fixes
             - highPriority: WCAG Level AA violations
             - medium: enhancement opportunities
             - positivePatterns: well-implemented features with code examples

          4. Error handling:
             - WebFetch timeout/failure: log warning, continue with automated data only
             - Homepage not found: try {baseURL}/index.html, then {baseURL}/, then skip
             - Non-HTML content: detect Content-Type, skip verification
             - Duplicates Pa11y findings: cross-reference and enhance, do not duplicate
        inputs:
          - name: homepage-url
            type: string
            required: true
            description: "Homepage URL to inspect"
        outputs:
          - name: manual-findings
            type: object
            description: "Structured manual verification findings (critical, highPriority, medium, positivePatterns)"

      - name: check-discovery
        description: Check llms.txt and robots.txt at the domain root
        usage: |
          1. Fetch [URL]/llms.txt
             - If found: analyse structure and content quality
             - If 404: note as missing — this is an opportunity, not a failure

             Context for reports: llms.txt is an emerging standard for AI agent discovery.
             Adoption is growing as MX practices spread. Early implementation provides
             first-mover advantage. Standard documented at https://llmstxt.org.

          2. Fetch [URL]/robots.txt
             - Analyse directives: User-agent, Disallow, Allow, Sitemap
             - Check for overly restrictive rules blocking agents
             - Identify AI bot restrictions (GPTBot, ChatGPT-User, etc.)
             - Note sitemap URL and any www/non-www inconsistencies
        inputs:
          - name: url
            type: string
            required: true
            description: "Base URL to check"
        outputs:
          - name: llms-txt
            type: object
            description: "llms.txt analysis (found, content, quality)"
          - name: robots-txt
            type: object
            description: "robots.txt analysis (directives, restrictions, sitemap)"

      - name: verify-claims
        description: Test discovery claims before making them — never say "invisible" without evidence
        usage: |
          CONTEXT: This action exists because of the Dotfusion lesson (February 2026).
          The audit measured technical readiness (no Schema.org, no structured data)
          and the report claimed the site was "invisible to AI agents." The client
          tested the same query and came up first. Technical readiness scores and
          actual discoverability are different things. Never conflate them.

          For each discovery claim the report would make, verify it:

          1. Identify the primary search query for this client:
             - "[industry] [service] in [location]" (e.g. "headless CMS agency in Toronto")
             - "[company name] [primary service]"
             - The query a CMO or buyer would actually type

          2. Test the claim using WebSearch:
             - Search for the identified query
             - Check whether the client appears in results
             - Note their position (first page, first result, absent)

          3. Apply the verification result:

             IF client appears prominently:
                → DO NOT claim they are "invisible" or "undiscoverable"
                → Instead: "Your site ranks well for [query] today. Structured data
                  and llms.txt would strengthen that position as AI agents become
                  a larger share of discovery traffic."

             IF client does not appear:
                → Frame as opportunity, not failure: "For the query [query],
                  structured data would improve visibility as AI-driven discovery
                  grows alongside traditional search."

             IF verification fails (WebSearch unavailable):
                → DO NOT make discovery claims at all
                → Report technical readiness scores only
                → Note: "Discovery impact not verified — scores reflect technical
                  readiness for AI agents, not current search ranking."

          4. Record verification results for the generate-report action:
             - query tested
             - result (found/not-found/verification-failed)
             - position if found
             - recommended framing language

          RULE: Technical readiness ≠ discoverability. A site can score 55/100 on
          AI agent suitability and still rank first for its primary query. The audit
          measures what the site provides to AI agents (structured data, semantic
          HTML, llms.txt). It does not measure how well search engines or AI
          assistants already know the brand. Report both facts. Never assume one
          from the other.
        inputs:
          - name: client-name
            type: string
            required: true
            description: "Client name for search queries"
          - name: industry
            type: string
            required: true
            description: "Client industry/service category"
          - name: location
            type: string
            required: false
            description: "Client location if relevant"
          - name: audit-results
            type: object
            required: true
            description: "Scores from the crawl action"
        outputs:
          - name: verification
            type: object
            description: "Query tested, result, position, recommended framing"

      - name: select-template
        description: Choose the appropriate report template based on audit data quality
        usage: |
          Decision tree:

          IF robots.txt quality score = 0 OR robots.txt content missing:
             → Use manual template
             → Reason: "robots.txt unavailable or invalid"

          ELSE IF pages analysed < 3:
             → Use manual template
             → Reason: "limited audit scope"

          ELSE IF Pa11y/performance/SEO/LLM metrics incomplete:
             → Use manual template
             → Reason: "incomplete automated metrics"

          ELSE:
             → Use automated template
             → Reason: "full automated audit data available"

          Template paths:
          - Automated: mx-crm/outreach/web-audit-suite-template.md
          - Manual: mx-crm/outreach/2026-01-23/manual-report-template.md

          Automated template: 610 lines, [BRACKET_NOTATION] placeholders, business-focused executive report.
          Manual template: 339 lines, technical audit format, for single-page or limited-data audits.
        outputs:
          - name: template-type
            type: string
            description: "'manual' or 'automated'"
          - name: template-reason
            type: string
            description: "Why this template was selected"
          - name: template-path
            type: string
            description: "Full path to the selected template"

      - name: generate-report
        description: Fill the template with audit data, manual findings, and business context
        usage: |
          1. Read the selected template file

          2. Extract client information:
             - Client name: derive from domain
             - Client slug: lowercase (e.g. dotfusion)
             - Date: today (YYYY-MM-DD)
             - Report ID: [SLUG]-WEB-AUDIT-[YYYYMMDD]

          3. Fill placeholders — replace all [BRACKET_NOTATION] with actual data:
             - [CLIENT_NAME], [DATE], [CLIENT_SHORT_NAME]
             - [PERFORMANCE_SCORE], [A11Y_SCORE], [SEO_SCORE], [LLM_SCORE]
             - [NUMBER_OF_ISSUES], [ELEVATOR_PITCH]
             - [CLIENT_CONTEXT] — research the client (web search if needed)

          4. Integrate manual verification findings:
             - Insert code examples from inspect action into relevant priority sections
             - Add "Manual Verification" subsections with specific HTML and fixes
             - Add positive patterns to "What's Working Well" section

          5. Add llms.txt and robots.txt analysis to appendices

          6. Add YAML frontmatter:
             title, author, created, client, client-slug, client-url, report-id,
             report-type, audit-tool, audit-date, description, tags, scores,
             pages-analysed, images-analysed, engagement-options, version, confidential

          7. Research and customise business context:
             - Client industry and target audience
             - Competitive landscape
             - Tone: B2B (compliance/risk), B2C (UX/discovery), SaaS (innovation), Publishing (discoverability)

          8. Priority classification:
             - Priority 1: scores 0-30 or critical compliance
             - Priority 2: scores 30-70 or high impact
             - Priority 3: scores 70-90 or enhancement opportunities

          9. Engagement options (adjust based on client size):
             - Foundation: £12k-£28k (4-6 weeks)
             - Comprehensive: £35k-£65k (8-12 weeks)
             - Strategic: £60k-£90k initial + £5k-£10k/month

          10. Apply partnership tone throughout:
              - Lead with strengths: What's working well section BEFORE opportunities
              - Frame constructively: "patterns identified" not "violations found"
              - Educational approach: Teach the reader, demonstrate expertise
              - Partnership positioning: Collaboration not criticism

              REFERENCE: Complete partnership reporting guidelines at
              mx-canon/mx-maxine-lives/manuals/manual-partnership-reporting.cog.md

              Example transformation:
              ❌ "349 WCAG AA violations create legal risk"
              ✅ "349 accessibility patterns identified represent exactly the
                 remediation services your clients need"

          11. Remove ALL template instructions, HTML comments, and unfilled placeholders

          CRITICAL: Never send a report with [PLACEHOLDERS] unfilled.
          CRITICAL: Always remove instruction blocks from templates.
          CRITICAL: Always research actual competitors — never guess.
          CRITICAL: Always use partnership tone — opens conversations, not price objections.
        inputs:
          - name: template-path
            type: string
            required: true
            description: "Path to the selected template"
          - name: audit-results
            type: object
            required: true
            description: "All metrics from the crawl action"
          - name: manual-findings
            type: object
            required: false
            description: "Manual verification findings from the inspect action"
          - name: discovery
            type: object
            required: false
            description: "llms.txt and robots.txt analysis"
        outputs:
          - name: report-content
            type: string
            description: "Complete report markdown ready to write"

      - name: write-and-lint
        description: Write the report file and validate markdown
        usage: |
          1. Construct filename: [client-slug]-report.md
          2. Full path: mx-crm/outreach/YYYY-MM-DD/[client-slug]-report.md
          3. Write the complete report

          4. Lint with project config:
             npx markdownlint -c .markdownlint-cli2.jsonc [report-path]

          5. Fix any linting errors
          6. Re-run lint to verify clean
        inputs:
          - name: report-content
            type: string
            required: true
            description: "The complete report markdown"
          - name: output-path
            type: string
            required: true
            description: "Where to write the report"
        outputs:
          - name: report-path
            type: string
            description: "Path to the written report"
          - name: lint-status
            type: string
            description: "'clean' or list of remaining issues"

      - name: summary
        description: Report completion status to the user
        usage: |
          Present a summary:
          - Template used: [type] — [reason]
          - Audit completed: [N] pages analysed
          - Manual verification: [completed/skipped/failed]
          - Report generated: [path]
          - Key findings: Performance, Accessibility (issues count), SEO, AI Agent Suitability
          - Engagement options: price range
          - Full audit results: mx-audit/results/

  semantic: true
  convergence: true
  accessibility: true
  runbook: "mx exec mx-audit"
---

# The MX Web Audit

Run a comprehensive web audit and generate a partnership-ready executive report. From URL to deliverable in one workflow.

---

## What This Does

This action-doc codifies the three-stage audit pipeline that produces executive reports for business development and partnership outreach.

Nine actions, one pipeline:

1. **Recon** — Pre-inference data collection. Run `scripts/mx-audit-recon.sh` to gather robots.txt, llms.txt, sitemap.xml, homepage HTML, HTTP headers, security headers, and page HTML. Pure bash + curl. No AI inference needed. Produces a YAML manifest the AI reads first. Separates data gathering (cheap) from analysis (expensive). Cut compute, not context.

2. **Crawl** — Run the MX Web Audit Suite against a URL. Automated analysis across accessibility (Pa11y), performance, SEO, AI agent suitability, image optimisation, security headers, and content quality. Includes three-screenshot visual dynamism detection via Puppeteer.

3. **Inspect** — Manual HTML verification via WebFetch. Deep DOM inspection of the homepage: heading hierarchy, semantic landmarks, form accessibility, code quality, positive patterns. Produces specific code examples with recommended fixes.

4. **Check discovery** — Analyse llms.txt and robots.txt from recon data (already collected in step 1). AI agent discoverability and crawler permissions.

5. **Verify claims** — Before making discovery claims, test them. Search for the client's primary query and check whether they actually appear. Technical readiness scores and real-world discoverability are different things. This action exists because of the Dotfusion lesson.

6. **Select template** — Choose automated or manual report template based on data quality and audit scope.

7. **Generate report** — Fill the template with audit data, manual findings, and researched business context. Add YAML frontmatter, engagement options, and appendices. Stamp with `x-mx-p-ref` cog ID.

8. **Write and lint** — Write the report file and validate against project markdown standards.

9. **Summary** — Report completion status with key scores and file locations.

The full **audit** action runs all nine in sequence.

---

## Why This Exists

The web audit is the first conversation in a partnership. It demonstrates what CogNovaMX can see that others miss. The automated tooling provides breadth (hundreds of images, dozens of pages, multiple metric categories). The manual inspection provides depth (specific code examples, WCAG violation codes, recommended fixes). The template provides structure (business context, engagement options, professional presentation).

Before this cog existed, the workflow lived in a Claude Code skill. The skill was 670 lines of step-by-step instructions. It worked, but it was platform-specific. This cog captures the same workflow in a format any AI agent can execute — Claude Code, ChatGPT, or any future platform that reads action-docs.

The instructions are the program. You are the runtime.

---

## The Three Stages

### Stage 1: Automated Analysis

The MX Web Audit Suite (`mx-audit/`) crawls the target site and produces CSV and JSON result files. Pa11y handles accessibility. Custom analysers handle SEO, performance, security, AI agent compatibility, and image optimisation.

**Key command:**

```bash
npm run audit:start -- -s https://example.com -c 9 --no-recursive --force-delete-cache
```

**Result files:** `mx-audit/results/`

| File | What it measures |
| --- | --- |
| `results.json` | Complete analysis data |
| `executive_summary.md` | Overall scores |
| `accessibility_report.csv` | WCAG compliance (Pa11y) |
| `llm_general_suitability.csv` | AI agent compatibility |
| `seo_scores.csv` | SEO metrics |
| `image_optimization.csv` | Image analysis |
| `performance_metrics.csv` | Load times, FCP, CLS |
| `security_report.csv` | Security headers |
| `content_quality.csv` | Content analysis |

### Stage 2: Manual HTML Verification

WebFetch retrieves the homepage HTML for direct inspection. This catches patterns that automated tools miss: placeholder-only forms, redundant ARIA, semantic violations, heading hierarchy gaps, and positive patterns worth highlighting.

The manual findings include current HTML code and recommended fixes with WCAG violation codes. These specific examples make the report credible — they demonstrate that someone (or something) actually read the markup.

### Stage 3: Template-Based Report Generation

Two templates, selected by data quality:

| Template | When | Path |
| --- | --- | --- |
| Automated | Full metrics, 3+ pages, robots.txt available | `mx-crm/outreach/web-audit-suite-template.md` |
| Manual | Limited data, blocked crawling, single page | `mx-crm/outreach/2026-01-23/manual-report-template.md` |

Templates use `[BRACKET_NOTATION]` placeholders filled with actual audit data. Business context is researched and customised per client.

---

## Output

The pipeline produces a single markdown file:

```
mx-crm/outreach/YYYY-MM-DD/[client-slug]-report.md
```

The report includes:

- YAML frontmatter with all scores, metadata, and engagement options
- Executive summary with key scores table
- Priority-classified findings (0-30 critical, 30-70 high impact, 70-90 enhancement)
- Manual verification code examples with recommended fixes
- Business case with competitive context
- Engagement options (three tiers, £12k-£90k+)
- Appendices: methodology, robots.txt, llms.txt, discovered URLs

---

## The Dotfusion Lesson

In February 2026, the first audit report was sent to Chris Bryce (Dotfusion CEO). Two problems surfaced:

**The accuracy problem.** The audit measured technical readiness — no Schema.org, no structured data, no llms.txt — and scored AI agent suitability at 55/100. The report then claimed: "When a CMO asks an AI assistant to find a headless CMS agency in Toronto, your website is effectively invisible." Chris tested the query. Dotfusion came up first.

Technical readiness and discoverability are different measurements. A well-known brand with strong backlinks and years of content can rank highly despite having zero structured data. The audit measures what the site provides to AI agents. It does not measure what AI agents already know about the brand. The `verify-claims` action was added to prevent this mistake from recurring.

**The tone problem.** The report used language like "credibility gap that competitors can exploit," "contradiction of your sales pitch," and "deal-breaking objection." Chris's feedback: "too negative." The report read like an attack, not a partnership conversation. Chris is an advisory board member and potential founding partner, not a cold prospect.

The lesson is permanent: every report must be warm and professional. Frame findings as opportunities. Lead with strengths. Position gaps as service offerings that the client (or their clients) needs. The audit demonstrates MX capabilities — it does not grade the recipient.

**Complete Partnership Reporting Framework:**

For comprehensive tone guidance, examples, and language transformation tables, see:

- **Manual:** [`mx-canon/mx-maxine-lives/manuals/manual-partnership-reporting.cog.md`](../../MX-Maxine-Lives/manuals/manual-partnership-reporting.cog.md)
  - 4 pillars: Strengths First, Opportunity Framing, Educational, Partnership Positioning
  - Language transformation guide (critical → partnership)
  - Writing checklist and anti-patterns
  - Examples gallery: Dotfusion, ArriveFirst, Boye & Co reports

- **Template:** [`mx-canon/mx-the-gathering/reference-implementations/templates/partnership-report-template.md`](../../../mx-reference-implementations/_templates/partnership-report-template.md)
  - Complete structure with YAML frontmatter
  - Example text for every section
  - Engagement options framework

---

## For AI Agents

When a user asks you to audit a website:

1. **Read this action-doc** fresh — it is the single source of truth
2. **Run the audit action** for the full pipeline, or individual actions for specific stages
3. **Always clear cache** before crawling — stale data produces wrong reports
4. **Always research the client** — generic reports are obvious and unhelpful
5. **Always verify discovery claims** — search for the client's primary query before writing "invisible" or "undiscoverable"
6. **Never leave placeholders** — every `[BRACKET]` must be replaced with real data
7. **Warm and professional tone** — the report starts a partnership conversation, not an argument
8. **Lint before finishing** — the report must pass markdownlint
9. **Report output paths** — when the report is generated, provide the full absolute path

**Output Reporting Principle:** When the generate-report action completes and writes the audit report, always report the full absolute path of the created file. This enables traceability and makes it easy to locate the deliverable.

Example:

```
✓ Web audit report generated successfully

Output:
  /Users/tom/Documents/MX/MX-The-Books/repo/mx-crm/outreach/2026-02-17/dotfusion-report.md

Summary:
  Template: automated (full metrics available)
  Pages analysed: 9
  Performance: 78/100
  Accessibility: 23 issues
  AI Agent Suitability: 55/100
  Engagement options: £12k-£65k
```

Not just "report saved to outreach/2026-02-17/" — the full absolute path from root.

---

## The Rules

1. **Fresh data only.** Always `--force-delete-cache`. Never reuse results from previous audits.

2. **Manual verification is not optional.** Unless the URL is a sitemap XML, run the inspect action. The code examples are what make the report credible.

3. **Research the client.** Use web search if needed. Industry, competitors, target audience. A generic report is a wasted opportunity.

4. **Remove all template artefacts.** No `[PLACEHOLDERS]`, no HTML comments, no instruction blocks in the final report.

5. **Lint is the last step.** The report must pass `npx markdownlint -c .markdownlint-cli2.jsonc` before delivery.

6. **Verify before you claim.** Never write "invisible to AI agents" or "undiscoverable" without testing the actual search query first. Technical readiness scores measure what the site provides to machines. They do not measure whether the brand is already well known. A site can score 55/100 on AI suitability and still rank first for its primary query. Report both facts honestly.

7. **Warm and professional tone.** The report is the first conversation in a partnership. It must read as collaborative and respectful, never confrontational. The reader is a potential partner, not a target.

   **Never use:**
   - "credibility gap" / "competitive liability" / "deal-breaking objection"
   - "competitors can exploit" / "contradiction of your sales pitch"
   - "raises questions about the quality you deliver"
   - Any framing that positions the client's site as an embarrassment

   **Always use:**
   - "opportunity" / "enhancement" / "foundation for improvement"
   - "industry-wide pattern" (not "your specific failure")
   - "what clients are asking agencies to address" (service opportunity framing)
   - Lead with what works well before identifying gaps

8. **Opportunity framing, not crisis framing.** Reports position findings as market opportunities and service packages, not attacks on the client's competence. Frame every technical gap as a service that the client (or their clients) needs. The audit demonstrates MX capabilities. It does not grade the client.

---

*Crawl it. Inspect it. Template it. Deliver it. The audit is the program. You are the runtime.*
