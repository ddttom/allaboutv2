---
title: "Deployment Helper Manual"
description: "Orchestrates pre-deployment workflow for multilingual sites: runs validation, parity checks, sitemap generation, creates deployment checklist, and provides Google Search Console setup instructions."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"

mx:
  name: manual-deployment-helper
  status: active
  category: manual
  tags: [manual, multilingual, deployment, workflow, orchestration, automation]
  partOf: mx-maxine-lives
  purpose: "Document the deployment helper - orchestrating multilingual site deployment workflow"
  audience: "human"
  stability: "stable"
  runbook: "Read when deploying multilingual sites or understanding pre-deployment workflows"
  contextProvides:
    - "4-step deployment workflow orchestration (validation, parity, sitemap, readiness)"
    - "Deployment checklist (pre/during/post deployment tasks)"
    - "Google Search Console setup guide with step-by-step instructions"
    - "CI/CD integration patterns for automated deployment gates"
  refersTo:
    - "mx-canon/mx-the-gathering/reference-implementations/_tools/deploy-multilingual.js"
    - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
    - "mx-canon/mx-maxine-lives/manuals/manual-multilingual-validator.cog.md"
    - "mx-canon/mx-maxine-lives/manuals/manual-parity-checker.cog.md"
    - "mx-canon/mx-maxine-lives/manuals/manual-multilingual-sitemap.cog.md"
---

# Deployment Helper

Orchestrates the complete pre-deployment workflow for multilingual sites. Runs validation checks, content parity analysis, sitemap generation, creates a comprehensive deployment checklist, assesses production readiness, and provides step-by-step Google Search Console setup instructions.

---

## Overview

Deploying a multilingual site involves dozens of checks and configuration steps. This tool automates the technical validation and provides structured guidance for manual deployment tasks. Think of it as your pre-flight checklist before production.

**Key Features:**

- Automated validation suite execution
- Content parity verification
- Sitemap generation
- Deployment readiness assessment
- Comprehensive checklist (pre/during/post deployment)
- Google Search Console setup guide
- Exit codes for CI/CD integration

**Orchestrated Tools:**

1. Multilingual Validator (23 checks)
2. Content Parity Checker (content/structure/timing)
3. Sitemap Generator (hreflang annotations)

---

## Usage

### Basic Usage

```bash
npm run deploy:check -- --dir=/path/to/site --domain=example.com
```

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dir` | Current directory | Site root directory |
| `--domain` | `example.com` | Domain name for URLs |
| `--languages` | `es,en` | Comma-separated language codes |
| `--skipValidation` | `false` | Skip validation checks |
| `--skipParity` | `false` | Skip parity checks |
| `--skipSitemap` | `false` | Skip sitemap generation |

### Examples

**Full deployment check for Los Granainos:**

```bash
npm run deploy:check -- --dir=allaboutv2/mx/demo/salva --domain=allabout.network
```

**Skip parity check (if known to be out of sync):**

```bash
npm run deploy:check -- --dir=dist --domain=example.com --skipParity=true
```

**Validation only (no sitemap regeneration):**

```bash
npm run deploy:check -- --dir=public --skipSitemap=true
```

---

## Workflow Steps

The deployment helper executes 4 sequential steps:

### Step 1: Multilingual Validation

Runs the full validation suite:

```
════════════════════════════════════════════════════════════
STEP 1: MULTILINGUAL VALIDATION
════════════════════════════════════════════════════════════

✓  MX Multilingual Validation Tool

🔍 Validating multilingual structure...

📊 SUMMARY:
   Passed: 23
   Warnings: 0
   Errors: 0

🎉 Perfect! Multilingual implementation is compliant.
```

**Checks:**

- Directory structure (`/es/`, `/en/`)
- HTML lang/data-lang attributes
- Hreflang absolute URLs
- No hash/query param language switching
- x-default hreflang presence
- Root redirect with language detection
- Sitemap with hreflang annotations

**Result Captured:** `validation` = passed/failed/skipped

---

### Step 2: Content Parity Check

Compares content across languages:

```
════════════════════════════════════════════════════════════
STEP 2: CONTENT PARITY CHECK
════════════════════════════════════════════════════════════

🔍 MX Multilingual Content Parity Checker

✅ PASSED CHECKS:
   ✓ index.html: Content length within threshold
   ✓ index.html: Structural parity (5 elements match)
   ✓ index.html: Modification times in sync

📊 SUMMARY:
   Passed: 3
   Warnings: 0
   Critical issues: 0

🎉 Perfect parity! All language versions are in sync.
```

**Checks:**

- Text content length differences
- Structural element counts
- File modification time gaps

**Result Captured:** `parity` = passed/warning/skipped

---

### Step 3: Sitemap Generation

Creates/updates sitemap.xml:

```
════════════════════════════════════════════════════════════
STEP 3: SITEMAP GENERATION
════════════════════════════════════════════════════════════

🗺️  MX Multilingual Sitemap Generator

📁 Scanning for HTML files...
   Found 2 HTML files

🌐 Grouping by language...
   Found 1 unique pages

🗺️  Generating sitemap.xml...
   ✅ Sitemap written to: /path/to/site/sitemap.xml

📊 Summary:
   Pages: 1
   Languages: es, en
   Total URLs: 2
```

**Output:** `sitemap.xml` at site root

**Result Captured:** `sitemap` = generated/failed/skipped

---

### Step 4: Deployment Checklist

Provides comprehensive task list:

```
════════════════════════════════════════════════════════════
DEPLOYMENT CHECKLIST
════════════════════════════════════════════════════════════

📋 Pre-Deployment:
   ✓ Multilingual validation passed
   ✓ Content parity verified
   ✓ Sitemap.xml generated
   ○ All content reviewed and finalized
   ○ Contact information verified
   ○ Images optimized and compressed
   ○ Browser testing complete (Chrome, Safari, Firefox)
   ○ Mobile/tablet testing complete
   ○ Accessibility testing (WCAG 2.1 AA)

📋 Deployment:
   ○ Upload files to https://example.com
   ○ Verify root redirect works (test in incognito)
   ○ Test Spanish version: https://example.com/es/
   ○ Test English version: https://example.com/en/
   ○ Verify language toggle navigation works
   ○ Check all internal links
   ○ Verify hreflang tags in page source

📋 Post-Deployment:
   ○ Submit sitemap: https://search.google.com/search-console
      URL: https://example.com/sitemap.xml
   ○ Request indexing for each language version
   ○ Validate hreflang: https://technicalseo.com/tools/hreflang/
   ○ Test rich results: https://search.google.com/test/rich-results
   ○ Set up Google Analytics (optional)
   ○ Set up monitoring/uptime checks
   ○ Document deployment in project notes
```

**✓ = Automated (completed by tool)**
**○ = Manual (requires human action)**

---

## Deployment Readiness Assessment

The helper analyzes results and determines readiness:

### Ready for Deployment

```
════════════════════════════════════════════════════════════
DEPLOYMENT READINESS ASSESSMENT
════════════════════════════════════════════════════════════

Critical checks:
   ✓ Multilingual validation: passed
   ✓ Sitemap generation: generated

Warning checks:
   ✓ Content parity: passed

🎉 READY FOR DEPLOYMENT!
   All checks passed. Site is production-ready.
```

**Exit Code:** 0

---

### Ready with Warnings

```
Critical checks:
   ✓ Multilingual validation: passed
   ✓ Sitemap generation: generated

Warning checks:
   ⚠️ Content parity: warning

✓ READY FOR DEPLOYMENT (with warnings)
   Critical checks passed. Review warnings before deploying.
```

**Exit Code:** 0 (warnings don't block deployment)

---

### Not Ready

```
Critical checks:
   ✗ Multilingual validation: failed
   ✓ Sitemap generation: generated

Warning checks:
   ✓ Content parity: passed

✗ NOT READY FOR DEPLOYMENT
   Fix critical issues before deploying to production.
```

**Exit Code:** 1

---

## Google Search Console Setup

If deployment-ready, provides step-by-step instructions:

```
════════════════════════════════════════════════════════════
GOOGLE SEARCH CONSOLE SETUP
════════════════════════════════════════════════════════════

📍 Step-by-step instructions:

1. Add property to Search Console:
   → Go to: https://search.google.com/search-console
   → Add property: https://example.com
   → Verify ownership (DNS, HTML file, or meta tag)

2. Submit sitemap:
   → In Search Console, go to Sitemaps
   → Add new sitemap: sitemap.xml
   → Full URL: https://example.com/sitemap.xml

3. Request indexing:
   → Use URL Inspection tool for each language:
      • https://example.com/es/
      • https://example.com/en/
   → Click "Request Indexing" for each URL

4. Validate hreflang implementation:
   → Go to: https://technicalseo.com/tools/hreflang/
   → Test URL: https://example.com/es/
   → Check for errors in hreflang annotations

5. Monitor indexing:
   → Search Console → Coverage report
   → Verify both language versions appear
   → Check for indexing errors or warnings
```

---

## CI/CD Integration

### Pre-Deployment Gate

```bash
#!/bin/bash
# Pre-deployment validation

npm run deploy:check -- --dir=dist --domain=example.com

if [ $? -eq 0 ]; then
  echo "✅ Deployment checks passed"
  # Proceed with deployment
else
  echo "❌ Deployment checks failed"
  exit 1
fi
```

### GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Pre-deployment checks
        run: npm run deploy:check -- --dir=dist --domain=${{ secrets.DOMAIN }}

      - name: Deploy to production
        if: success()
        run: ./deploy.sh
```

---

## Skip Flags Use Cases

**Skip Validation:**

- Validation already run separately
- Testing parity/sitemap only

**Skip Parity:**

- Known translation gaps (in progress)
- Focus on technical compliance only

**Skip Sitemap:**

- Sitemap manually maintained
- Sitemap already generated separately

---

## Troubleshooting

**Tool fails on Step 1:**

- Check validation errors and fix HTML issues
- See Multilingual Validator manual for details

**Parity warnings after content update:**

- Expected after translating one language
- Use `--skipParity=true` until translations complete

**Sitemap generation fails:**

- Verify HTML files exist in language directories
- Check file permissions on output directory

**"Not ready" despite passing tests:**

- Check manual checklist items
- Ensure browser testing completed
- Verify contact info and content finalized

---

## Output Files

After running, you'll have:

```
site/
├── sitemap.xml          ← Generated/updated
├── es/
│   └── index.html
└── en/
    └── index.html
```

**Plus console output with:**

- Validation results
- Parity analysis
- Deployment checklist
- Readiness assessment
- Search Console guide

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/deploy-multilingual.js`
**Language:** Node.js
**Dependencies:** Other multilingual tools (via child_process)
**NPM Script:** `deploy:check`
**Exit Codes:**

- `0` - Ready for deployment (warnings OK)
- `1` - Not ready (critical failures)

---

## Related Tools

- **Multilingual Validator** - Step 1 validation
- **Content Parity Checker** - Step 2 parity check
- **Sitemap Generator** - Step 3 sitemap creation

**This tool orchestrates all three.**

---

*Part of MX OS. The instructions are the program.*
