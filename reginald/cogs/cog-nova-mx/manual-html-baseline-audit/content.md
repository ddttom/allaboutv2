---
title: HTML Baseline Audit & Regression System Manual
description: Comprehensive guide to establishing HTML baselines and detecting regressions across all .cog.html files using automated visual, structural, style, and metadata comparison.
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"

mx:
  name: manual-html-baseline-audit
  status: active
  category: manual
  tags:
    - manual
    - html
    - audit
    - baseline
    - regression
    - testing
    - automation
    - validation
  partOf: mx-maxine-lives
  refersTo:
    - manual-enhanced-audit
    - cogify-this
    - step-commit
  purpose: Document HTML baseline & regression system - usage, workflow, and best practices
  audience: human
  stability: stable
  runbook: Read when establishing HTML baselines, detecting regressions, or integrating audit workflow
  contextProvides:
    - HTML baseline establishment and regression detection workflow
    - Automated comparison across visual, structural, style, and metadata layers
    - Integration with development workflow and CI/CD
    - Troubleshooting and best practices
---

# HTML Baseline Audit & Regression System Manual

Automated baseline establishment and regression detection for all `.cog.html` files in the repository. Detects visual, structural, style, and metadata changes that could indicate compliance regressions.

---

## Overview

### What It Does

The HTML Baseline Audit System provides automated regression detection for .cog.html files:

1. **Baseline Establishment** - Audits all .cog.html files and captures current state
2. **Automated Auditing** - Uses existing enhanced-audit system (`npm run cogify`)
3. **Comprehensive Capture** - Screenshots, DOM structure, CSS styles, metadata
4. **Regression Detection** - Compares current state against baseline
5. **Detailed Reporting** - Identifies what changed and severity

### Why Use It

**Problem:** Need to know when HTML changes break compliance or introduce regressions

**Solution:** Establish baseline, automatically detect deviations

**Benefits:**

- ✅ Catch regressions before deployment
- ✅ Visual comparison (pixel-level diff)
- ✅ Structural validation (element counts, hierarchy)
- ✅ Style checking (colors, fonts, CSS properties)
- ✅ Metadata verification (YAML frontmatter, meta tags)
- ✅ CI/CD integration ready

---

## Quick Start

### Prerequisites

1. Enhanced audit system installed:

   ```bash
   npm run cogify:install
   ```

2. At least one `.cog.html` file in repository

### Establish Baseline

```bash
npm run audit:html:baseline
```

This discovers all `.cog.html` files and creates a baseline with:

- Screenshots
- Audit data (DOM, CSS, metadata)
- Cached HTML/CSS
- Structural metrics

### Detect Regressions

```bash
npm run audit:html:compare
```

This runs a fresh audit and compares against the baseline, reporting:

- Visual changes (pixel differences)
- Structural changes (element counts, sections)
- Style changes (colors, fonts)
- Metadata changes (version, compliance level)

---

## Commands

### npm run audit:html:baseline

**Description:** Establish comprehensive baseline for all .cog.html files

**What it does:**

1. Discovers all `.cog.html` files via glob
2. Starts local HTTP server for file:// URLs
3. Runs enhanced audit (`cogify`) on each file
4. Captures screenshots, audit data, cached assets
5. Generates summary index.json
6. Stops local server

**Output:**

```text
mx-outputs/html/audit/baselines/
└── 2026-02-21-15-30-00/           # Timestamp directory
    ├── index.json                  # Summary of all files
    ├── los-granainos/              # Per-file audit data
    │   ├── audit-data.json
    │   ├── screenshots/
    │   ├── cached-html/
    │   ├── cached-css/
    │   ├── validation-baseline.json
    │   └── visual-audit-report.md
    └── ... [other files]
```

**Exit codes:**

- `0` - Success (all files audited)
- `1` - Partial failure (some files failed)

**Example output:**

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HTML Baseline Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Discovering .cog.html files...
  ✓ Found 12 .cog.html files

Step 2: Creating baseline directory...
  ✓ Baseline: mx-outputs/html/audit/baselines/2026-02-21-15-30-00

Step 3: Starting local server...
  ✓ Server running on localhost:54321

Step 4: Auditing files...
  [1/12] mx-canon/mx-the-gathering/reference-implementations/los-granainos/...
    ✓ Audit complete (8.2s)
  [2/12] allaboutv2/mx/demo/salva/index.cog.html
    ✓ Audit complete (7.9s)
  ...

Step 5: Stopping local server...
  ✓ Server stopped

Step 6: Generating summary...
  ✓ Summary saved: index.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Baseline Established
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location:  mx-outputs/html/audit/baselines/2026-02-21-15-30-00/
Files:     12/12 successful
Size:      14.3 MB
Duration:  96.4s
```

---

### npm run audit:html:compare

**Description:** Compare current state against latest baseline

**What it does:**

1. Loads latest baseline from mx-outputs/html/audit/baselines/
2. Runs fresh audit (same as baseline)
3. Compares each file:
   - Visual: Screenshot pixel comparison
   - Structure: Element counts, depth, sections
   - Styles: Colors, fonts, custom properties
   - Metadata: YAML frontmatter fields
4. Generates regression report

**Output:**

```text
mx-outputs/md/audit/
├── comparison-2026-02-21-16-45-00.json   # Machine-readable
├── comparison-2026-02-21-16-45-00.md     # Human-readable
└── diffs/                                 # Visual diff images
    └── *.png
```

**Exit codes:**

- `0` - No regressions detected
- `1` - Regressions detected
- `2` - Error (no baseline, audit failed)

**Example output (no regressions):**

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HTML Baseline Comparison
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Loading baseline...
  ✓ Baseline: 2026-02-21T15:30:00Z
  Files: 12

Step 2: Running current audit...
  [... audit output ...]

Step 3: Loading current audit...
  ✓ Current: 2026-02-21T16:45:00Z

Step 4: Comparing against baseline...

Step 5: Generating reports...
  ✓ JSON report: mx-outputs/md/audit/comparison-2026-02-21-16-45-00.json
  ✓ Markdown report: mx-outputs/md/audit/comparison-2026-02-21-16-45-00.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Comparison Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No regressions detected
All 12 files match baseline
```

**Example output (regressions detected):**

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Comparison Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  2 REGRESSIONS DETECTED

Visual:      1
Structural:  1
Style:       1
Metadata:    1

✅ Unchanged:  10 files

See full report: mx-outputs/md/audit/comparison-2026-02-21-16-45-00.md
```

---

## Workflow Integration

### Development Workflow

**During development:**

```bash
# Make changes to HTML files
# ...

# Check for regressions
npm run audit:html:compare

# If regressions are intentional:
npm run audit:html:baseline  # Establish new baseline
```

### Before Committing

```bash
# Pre-commit check
npm run audit:html:compare

# If passing, proceed with commit
# If failing, fix regressions or update baseline
```

### CI/CD Integration

Add to `.github/workflows/html-regression.yml`:

```yaml
name: HTML Regression Check

on:
  pull_request:
    paths:
      - '**.cog.html'
      - 'allaboutv2/**'
      - 'mx-canon/mx-the-gathering/reference-implementations/**'

jobs:
  html-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Install cogify
        run: npm run cogify:install

      - name: Run HTML regression check
        run: npm run audit:html:compare
```

---

## Understanding Reports

### Baseline Index (index.json)

**Location:** `mx-outputs/html/audit/baselines/YYYY-MM-DD-HH-MM-SS/index.json`

**Structure:**

```json
{
  "mx": {
    "name": "html-baseline-audit-index",
    "version": "1.0.0",
    "timestamp": "2026-02-21T15:30:00Z",
    "machine": "Toms-MacBook-Pro.local",
    "source": "scripts/audit-html-baseline.js"
  },
  "baseline": {
    "established": "2026-02-21T15:30:00Z",
    "totalFiles": 12,
    "successful": 12,
    "failed": 0,
    "totalSize": 14987264,
    "duration": 96.4
  },
  "files": [
    {
      "path": "mx-canon/mx-the-gathering/reference-implementations/los-granainos/los-granainos-mx-reference.cog.html",
      "url": "http://localhost:54321/...",
      "auditDir": "mx-outputs/html/audit/baselines/.../los-granainos/",
      "screenshots": ["homepage.png"],
      "structure": {
        "elementCount": 166,
        "maxDepth": 10,
        "sections": 4,
        "landmarks": 3
      },
      "styles": {
        "colorCount": 14,
        "fontFamilies": ["Lato", "Playfair Display"],
        "customPropertiesCount": 65
      },
      "metadata": {
        "name": "los-granainos-mx-reference",
        "version": "1.0.0",
        "complianceLevel": 3
      }
    }
  ]
}
```

### Comparison Report (comparison-YYYY-MM-DD.md)

**Location:** `mx-outputs/md/audit/comparison-YYYY-MM-DD-HH-MM-SS.md`

**Sections:**

1. **Summary** - High-level metrics
2. **Regressions Detected** - Detailed breakdown per file
3. **Files Without Regressions** - List of unchanged files

**Example regression:**

```markdown
### ⚠️ Regression: allaboutv2/mx/demo/salva/index.cog.html

**Severity:** HIGH

**Structural Changes:**

- Element count: 166 → 158 (-8 elements, -4.8%)
- Max depth: 10 → 9 (-1 level)
- Sections removed: ["contacto"]

**Style Changes:**

- Missing color: #d4704b (coral) - was used in 3 elements
- Font family removed: "Playfair Display"

**Recommendation:** Investigate structural changes - content may have been accidentally removed
```

---

## Regression Types

### Visual Regressions

**What:** Screenshot pixel differences

**Threshold:** >1% pixels changed

**Severity:**

- **LOW:** 1-5% pixels changed (likely font rendering)
- **MEDIUM:** 5-10% pixels changed
- **HIGH:** >10% pixels changed (major layout shift)

**Example:**

```text
Visual: 15.2% pixels changed (MAJOR)
Diff image: mx-outputs/md/audit/diffs/file-visual-diff.png
```

### Structural Regressions

**What:** DOM structure changes

**Detects:**

- Element count changes (>5%)
- Max depth changes (±2 levels)
- Sections added/removed
- Landmarks added/removed

**Example:**

```text
Element count: 166 → 158 (-8 elements, -4.8%)
Sections removed: ["contacto"]
```

### Style Regressions

**What:** CSS style changes

**Detects:**

- Color count changes
- Font families added/removed
- Custom properties count changes

**Example:**

```text
Missing color: #d4704b (coral)
Font family removed: "Playfair Display"
```

### Metadata Regressions

**What:** Frontmatter/meta tag changes

**Detects:**

- Version changes
- Compliance level changes
- Name changes

**Example:**

```text
Metadata: FAIL - missing mx:version
Baseline had: <meta name="mx:version" content="2.2.0">
Current: Field removed
```

---

## Troubleshooting

### Error: No baseline found

**Symptom:**

```text
Error: No baseline found

Run this first: npm run audit:html:baseline
```

**Fix:**

```bash
npm run audit:html:baseline
```

**Cause:** No baseline has been established yet

---

### Error: cogify command not found

**Symptom:**

```text
Error: Current audit failed
npm run cogify: command not found
```

**Fix:**

```bash
npm run cogify:install
```

**Cause:** Enhanced audit system (Playwright) not installed

---

### Error: Port already in use

**Symptom:**

```text
Error: listen EADDRINUSE: address already in use :::8080
```

**Fix:** Script uses random port (shouldn't happen). If it does:

```bash
# Kill process on port
lsof -ti:8080 | xargs kill -9

# Re-run audit
npm run audit:html:baseline
```

---

### False Positive: Font rendering differences

**Symptom:**

```text
Visual: 0.3% pixels changed
Likely cause: Font rendering variation
```

**Explanation:** Different OSes/browsers render fonts slightly differently

**Action:**

- If <1% and no other changes: Likely safe to ignore
- If reproducible across machines: May indicate real issue

---

### No .cog.html files found

**Symptom:**

```text
No .cog.html files found in repository
```

**Cause:** No `.cog.html` files exist

**Fix:** This system is for auditing existing .cog.html files. If you need to create one, see:

- Manual: `manual-cogify.cog.md`
- Templates: `mx-canon/mx-the-gathering/reference-implementations/_templates/`

---

## Best Practices

### 1. Establish baseline on stable state

✅ **DO:** Establish baseline when HTML files are in known-good state

❌ **DON'T:** Establish baseline when files have unfinished work

### 2. Re-baseline after intentional changes

✅ **DO:** Run `npm run audit:html:baseline` after major updates

❌ **DON'T:** Keep comparing against stale baseline

### 3. Review regression reports carefully

✅ **DO:** Investigate why regressions occurred

❌ **DON'T:** Blindly re-baseline to make tests pass

### 4. Commit baselines to git

✅ **DO:** Include baseline in version control

```bash
git add mx-outputs/html/audit/baselines/
git commit -m "chore: establish HTML baseline"
```

❌ **DON'T:** .gitignore baseline directories

### 5. Use in CI/CD

✅ **DO:** Run regression checks on every PR

❌ **DON'T:** Only check locally

---

## Architecture

### Components

```text
HTML Baseline Audit System
├── scripts/lib/html-audit-utils.js      # Shared utilities
├── scripts/audit-html-baseline.js       # Baseline establishment
├── scripts/audit-html-compare.js        # Regression detection
└── Enhanced Audit System (existing)
    └── npm run cogify                    # HTML/CSS/DOM capture
```

### Data Flow

```text
1. Baseline Establishment:
   glob *.cog.html
   → http-server (local files)
   → cogify --target=URL
   → copy outputs to baseline/
   → generate index.json

2. Regression Detection:
   load baseline index.json
   → run fresh audit
   → compare:
      - screenshots (pixel diff)
      - structure (element counts)
      - styles (colors, fonts)
      - metadata (YAML fields)
   → generate reports
```

---

## Files and Locations

**Scripts:**

- `scripts/lib/html-audit-utils.js` - Shared utilities
- `scripts/audit-html-baseline.js` - Baseline establishment
- `scripts/audit-html-compare.js` - Regression detection

**Configuration:**

- `package.json` - npm scripts (audit:html:baseline, audit:html:compare)

**Outputs:**

- `mx-outputs/html/audit/baselines/` - Baseline data (committed to git)
- `mx-outputs/md/audit/` - Comparison reports (not committed)

**Documentation:**

- `mx-canon/mx-maxine-lives/manuals/manual-html-baseline-audit.cog.md` - This manual
- `scripts/cogs/html-baseline-audit.cog.md` - Action-doc

---

## Partnership Reporting

### Report Tone

The HTML baseline comparison tool (`scripts/audit-html-compare.js`) automatically generates reports using **partnership tone** rather than critical/technical tone.

**Key Transformation:**

- ❌ "REGRESSIONS DETECTED" → ✅ "CHANGE PATTERNS IDENTIFIED"
- ❌ "Critical failures" → ✅ "Changes detected - review to determine if intentional"
- ❌ "Violation count" → ✅ "Pattern count"

**Report Structure:**

1. **Lead with strengths:** "✅ Baseline Compliance" section appears BEFORE change patterns
2. **Constructive framing:** "May indicate content streamlining" rather than "Elements removed"
3. **Actionable guidance:** "If changes are intentional, re-establish baseline: `npm run audit:html:baseline`"

**Complete Guidelines:**

- **Partnership Reporting Manual:** [`manual-partnership-reporting.cog.md`](manual-partnership-reporting.cog.md)
  - 4 pillars: Strengths First, Opportunity Framing, Educational, Partnership Positioning
  - Language transformation guide
  - Complete examples and anti-patterns

**Why Partnership Tone Matters:**

Reports generated by this system may be shared with clients, partners, or stakeholders. Partnership tone:

- Opens collaboration conversations rather than triggering defensiveness
- Demonstrates professionalism and expertise
- Positions findings as service opportunities
- Aligns with Cog-Nova-MX' consultative approach

---

## Related Documentation

- **Enhanced Audit Manual:** `manual-enhanced-audit.cog.md` - Underlying audit system
- **Cogify-This Manual:** `manual-cogify.cog.md` - HTML cogification workflow
- **Step-Commit Skill:** `.claude/skills/step-commit/` - Git workflow integration
- **Partnership Reporting:** `manual-partnership-reporting.cog.md` - Complete tone guidelines

---

**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-02-21
**Author:** Cog-Nova-MX Ltd

*"Establish baseline once, detect regressions forever."*
