---
title: "MX Multilingual Automation Suite"
description: "Complete toolkit for building, validating, and deploying multilingual websites with proper SEO, hreflang annotations, and Google best practices."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"

mx:
  name: multilingual-automation-suite
  status: active
  category: reference-implementation
  tags: [multilingual, automation, seo, workflow, internationalization, i18n, tools]
  partOf: mx-reference-implementations
---

# MX Multilingual Automation Suite

A complete toolkit for building, validating, and deploying multilingual websites that follow Google's best practices for international SEO. Six specialized tools working together to eliminate manual work and prevent common multilingual SEO mistakes.

---

## Overview

Multilingual sites require:

- Path-based language routing (`/es/`, `/en/`)
- Proper `lang` and `data-lang` attributes
- Absolute URL hreflang tags
- Browser language detection
- Bidirectional language references
- Sitemap with hreflang annotations
- Content parity across translations

**Manual setup is error-prone.** This suite automates the entire workflow.

---

## The Six Tools

### 1. Template Generator

**Purpose:** Create language versions from single template
**When:** Starting a new multilingual site
**Input:** One HTML file
**Output:** `/es/` and `/en/` directories with proper files + root redirect

```bash
npm run generate:multilingual -- --template=index.html --domain=example.com
```

**What It Does:**

- Creates language directories
- Updates lang/data-lang attributes
- Converts to absolute hreflang URLs
- Removes hash/query param language switching
- Generates root redirect with language detection

**Manual:** [Multilingual Template Generator](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-template.cog.md)

---

### 2. Asset Synchronizer

**Purpose:** Copy CSS/JS/images/fonts across languages
**When:** After template generation or asset updates
**Input:** Assets in one language or external directory
**Output:** Assets copied to all language directories

```bash
npm run sync:assets -- --dir=/path/to/site --mode=language
```

**What It Does:**

- Finds assets in first language (`.css`, `.js`, images, fonts)
- Copies to other language directories
- Preserves directory structure
- Dry run mode for safety

**Manual:** [Asset Synchronizer](../mx-canon/mx-maxine-lives/manuals/manual-asset-sync.cog.md)

---

### 3. Sitemap Generator

**Purpose:** Create sitemap.xml with hreflang
**When:** Before deployment or after content changes
**Input:** Language directories with HTML files
**Output:** `sitemap.xml` at site root

```bash
npm run generate:sitemap -- --domain=example.com --dir=/path/to/site
```

**What It Does:**

- Scans language directories for HTML
- Groups files by page
- Generates bidirectional hreflang links
- Adds x-default language reference
- Includes modification dates

**Manual:** [Multilingual Sitemap Generator](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-sitemap.cog.md)

---

### 4. Validator

**Purpose:** Verify SEO compliance
**When:** Before deployment, in CI/CD
**Input:** Multilingual site directory
**Output:** Pass/fail with detailed errors

```bash
npm run validate:multilingual -- --dir=/path/to/site
```

**What It Does:**

- Checks directory structure
- Validates lang/data-lang attributes
- Verifies absolute hreflang URLs
- Detects hash/query param anti-patterns
- Checks root redirect and sitemap

**Exit Code:** 0 = pass, 1 = critical errors

**Manual:** [Multilingual Validator](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-validator.cog.md)

---

### 5. Parity Checker

**Purpose:** Compare content across languages
**When:** After translation updates
**Input:** Multilingual site directory
**Output:** Content difference analysis

```bash
npm run check:parity -- --dir=/path/to/site --threshold=20
```

**What It Does:**

- Extracts text from HTML (removes tags/scripts/styles)
- Counts structural elements (headings, paragraphs, lists, images, links)
- Compares file modification times
- Flags translation gaps >20% difference

**Exit Code:** 0 = acceptable (warnings OK), 1 = critical issues

**Manual:** [Content Parity Checker](../mx-canon/mx-maxine-lives/manuals/manual-parity-checker.cog.md)

---

### 6. Deployment Helper

**Purpose:** Orchestrate pre-deployment workflow
**When:** Before every production deployment
**Input:** Multilingual site directory + domain
**Output:** Comprehensive readiness report

```bash
npm run deploy:check -- --dir=/path/to/site --domain=example.com
```

**What It Does:**

- Runs Validator (23 checks)
- Runs Parity Checker (content/structure/timing)
- Generates Sitemap
- Creates deployment checklist
- Assesses production readiness
- Provides Google Search Console setup guide

**Exit Code:** 0 = ready, 1 = not ready

**Manual:** [Deployment Helper](../mx-canon/mx-maxine-lives/manuals/manual-deployment-helper.cog.md)

---

## Complete Workflow

### Phase 1: Initial Setup

**Step 1: Create template**

```bash
# Create your single-language HTML file
# e.g., source.html with English content
```

**Step 2: Generate language versions**

```bash
npm run generate:multilingual -- \
  --template=source.html \
  --domain=example.com \
  --output=dist
```

**Result:**

```
dist/
├── index.html        # Root redirect
├── es/
│   └── source.html   # Spanish version
└── en/
    └── source.html   # English version
```

---

### Phase 2: Asset Management

**Step 3: Copy assets**

```bash
# Option A: From one language to others
npm run sync:assets -- --dir=dist --mode=language

# Option B: From external directory
npm run sync:assets -- --dir=dist --mode=external --source=assets
```

**Result:**

```
dist/
├── es/
│   ├── source.html
│   ├── styles.css
│   ├── script.js
│   └── logo.png
└── en/
    ├── source.html
    ├── styles.css
    ├── script.js
    └── logo.png
```

---

### Phase 3: Validation

**Step 4: Generate sitemap**

```bash
npm run generate:sitemap -- --domain=example.com --dir=dist
```

**Result:** `dist/sitemap.xml` with hreflang annotations

**Step 5: Validate implementation**

```bash
npm run validate:multilingual -- --dir=dist
```

**Expected:**

```
🎉 Perfect! Multilingual implementation is compliant.
📊 SUMMARY: Passed: 23, Warnings: 0, Errors: 0
```

---

### Phase 4: Content Quality

**Step 6: Check content parity**

```bash
npm run check:parity -- --dir=dist --threshold=20
```

**Expected:**

```
🎉 Perfect parity! All language versions are in sync.
📊 SUMMARY: Passed: 3, Warnings: 0, Critical issues: 0
```

---

### Phase 5: Deployment

**Step 7: Pre-deployment check**

```bash
npm run deploy:check -- --dir=dist --domain=example.com
```

**Expected:**

```
🎉 READY FOR DEPLOYMENT!
   All checks passed. Site is production-ready.
```

**Step 8: Deploy to production**

- Upload `dist/` contents to web server
- Test root redirect in incognito browser
- Verify language versions load correctly

**Step 9: Submit to Google**

- Add property to Google Search Console
- Submit `sitemap.xml`
- Request indexing for each language version
- Validate hreflang implementation

---

## Quick Reference

| Task | Command | Exit Code | Output |
|------|---------|-----------|--------|
| Generate language versions | `npm run generate:multilingual` | 0 = success | Language directories + root redirect |
| Sync assets | `npm run sync:assets` | 0 = success | Assets in all language dirs |
| Generate sitemap | `npm run generate:sitemap` | 0 = success | `sitemap.xml` |
| Validate SEO | `npm run validate:multilingual` | 0 = pass, 1 = fail | Validation report |
| Check parity | `npm run check:parity` | 0 = OK, 1 = critical | Parity analysis |
| Pre-deployment check | `npm run deploy:check` | 0 = ready, 1 = not ready | Full readiness report |

---

## Common Use Cases

### Use Case 1: New Multilingual Site

**Scenario:** Building a new site from scratch

**Steps:**

1. Create single-language template
2. Run Template Generator
3. Translate content in language directories
4. Sync assets
5. Generate sitemap
6. Validate
7. Deploy

**Commands:**

```bash
npm run generate:multilingual -- --template=index.html --domain=example.com
# Manually translate content
npm run sync:assets -- --mode=language
npm run deploy:check -- --domain=example.com
```

---

### Use Case 2: Content Update

**Scenario:** Updated Spanish version, need to regenerate sitemap

**Steps:**

1. Update `/es/` content
2. Regenerate sitemap (updates lastmod dates)
3. Validate

**Commands:**

```bash
npm run generate:sitemap -- --domain=example.com
npm run validate:multilingual
```

---

### Use Case 3: Translation Quality Check

**Scenario:** Verify English translation is complete

**Steps:**

1. Run parity checker
2. Review warnings
3. Update incomplete translations
4. Recheck

**Commands:**

```bash
npm run check:parity -- --threshold=15
# Fix issues
npm run check:parity -- --threshold=15
```

---

### Use Case 4: Adding New Language

**Scenario:** Site has Spanish/English, adding French

**Steps:**

1. Create `/fr/` directory
2. Copy and translate HTML files
3. Sync assets to `/fr/`
4. Update language list in all tools
5. Regenerate sitemap
6. Validate

**Commands:**

```bash
mkdir dist/fr
# Copy and translate files manually
npm run sync:assets -- --languages=es,en,fr
npm run generate:sitemap -- --languages=es,en,fr
npm run validate:multilingual -- --languages=es,en,fr
```

---

### Use Case 5: CI/CD Integration

**Scenario:** Automated pre-deployment validation

**GitHub Actions:**

```yaml
- name: Multilingual Quality Check
  run: |
    npm run deploy:check -- --dir=dist --domain=${{ secrets.DOMAIN }}

- name: Deploy
  if: success()
  run: ./deploy.sh
```

**Exit Codes:**

- `0` = deployment proceeds
- `1` = deployment blocked

---

## Troubleshooting

### Validation Fails

**Problem:** `npm run validate:multilingual` reports errors

**Solution:**

1. Read error messages carefully
2. Check which HTML file has issues
3. Common fixes:
   - Add missing `lang` attribute
   - Update hreflang to absolute URLs
   - Remove `#lang=` or `?lang=` references
4. Re-run validation after fixes

---

### Parity Warnings

**Problem:** Content length differs >20%

**Solutions:**

- **Expected:** Some languages are naturally more verbose (Spanish often 15-20% longer than English)
- **Investigate:** Check if paragraphs/sections missing
- **Adjust threshold:** Use `--threshold=30` if natural variation
- **Update translation:** Add missing content

---

### Sitemap Issues

**Problem:** Sitemap missing language versions

**Causes:**

- HTML files don't exist in that language directory
- Files have wrong extensions (not `.html`)
- Language directory doesn't exist

**Solution:**

1. Verify `/es/` and `/en/` directories exist
2. Check HTML files present in both
3. Ensure filenames match across languages

---

### Asset Sync Problems

**Problem:** Assets not copying

**Causes:**

- Source directory empty
- Wrong `--mode` setting
- File permissions

**Solution:**

1. Run with `--dry-run=true` to preview
2. Check source path is correct
3. Verify file permissions on target directories

---

## Best Practices

**1. Version Control**

- Commit generated files (sitemap, language versions)
- Track when tools were run (commit messages)
- Document which threshold values you use

**2. Deployment Workflow**

- Always run `deploy:check` before production
- Don't ignore warnings — investigate them
- Keep deployment checklist handy

**3. Content Updates**

- Update one language at a time
- Run parity checker after each translation
- Regenerate sitemap after content changes

**4. Testing**

- Test in incognito mode (avoids language cookies)
- Verify language toggle navigation works
- Check hreflang in page source (View Source)

**5. Monitoring**

- Check Google Search Console weekly
- Monitor indexing status for both languages
- Watch for hreflang errors in Search Console

---

## Tool Files

All tools located in: `mx-canon/mx-the-gathering/reference-implementations/_tools/`

| File | Tool | Lines |
|------|------|-------|
| `generate-multilingual.js` | Template Generator | 272 |
| `sync-assets.js` | Asset Synchronizer | 289 |
| `generate-sitemap.js` | Sitemap Generator | 214 |
| `validate-multilingual.js` | Validator | 299 |
| `check-parity.js` | Parity Checker | 340 |
| `deploy-multilingual.js` | Deployment Helper | 323 |

**Total:** 1,737 lines of automation

---

## Manuals

Each tool has a comprehensive manual in the MX brain:

- [Multilingual Template Generator Manual](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-template.cog.md)
- [Asset Synchronizer Manual](../mx-canon/mx-maxine-lives/manuals/manual-asset-sync.cog.md)
- [Multilingual Sitemap Generator Manual](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-sitemap.cog.md)
- [Multilingual Validator Manual](../mx-canon/mx-maxine-lives/manuals/manual-multilingual-validator.cog.md)
- [Content Parity Checker Manual](../mx-canon/mx-maxine-lives/manuals/manual-parity-checker.cog.md)
- [Deployment Helper Manual](../mx-canon/mx-maxine-lives/manuals/manual-deployment-helper.cog.md)

**All manuals indexed in:** [Manuals Registry](../mx-canon/mx-maxine-lives/manuals/manuals-registry.cog.md)

---

## Reference Implementation

**Los Granainos Restaurant** (`allaboutv2/mx/demo/salva/`)

A complete multilingual site demonstrating all tools:

- Spanish and English versions
- Proper hreflang annotations
- Leaflet maps integration
- Responsive design
- Full menu system
- Image optimization

**Test Results:**

- ✅ 23 validation checks passed
- ✅ Perfect content parity
- ✅ Sitemap generated (2 URLs, 2 languages)
- ✅ Deployment-ready

**View online:** [allabout.network](https://allabout.network) (when deployed)

---

## Support

**Documentation:**

- This README for workflow overview
- Individual tool manuals for detailed usage
- Manuals registry for finding specific topics

**Testing:**

- Los Granainos reference implementation
- Run tools against Los Granainos to verify setup

**Troubleshooting:**

- Check manual for specific tool
- Review Los Granainos for working example
- Run with verbose flags (`--detailed=true`, `--strict=true`)

---

*Part of MX OS. The instructions are the program. Making the web work for everyone and everything that uses it.*
