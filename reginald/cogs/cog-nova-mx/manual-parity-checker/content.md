---
name: manual-parity-checker
title: "Content Parity Checker Manual"
description: "Compares content across multilingual site language versions to identify translation gaps, structural differences, and outdated translations."
author: Tom Cranstoun and Maxine
created: 2026-02-21
version: "1.0"
status: active
category: manual
tags: [manual, multilingual, parity, quality-assurance, translation, content]
partOf: mx-maxine-lives
purpose: "Document the content parity checker - detecting translation gaps and content inconsistencies"
audience: "human"
stability: "stable"
runbook: "Read when checking translation completeness, identifying content gaps, or ensuring multilingual parity"
contextProvides:
  - "Content parity checking methodology (text length, structural elements, modification times)"
  - "Translation gap detection and threshold tuning"
  - "Interpreting parity results and fixing inconsistencies"
  - "Workflow integration for quality assurance"
refersTo:
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/check-parity.js"
  - "mx-canon/mx-the-gathering/reference-implementations/_tools/README.cog.md"
---

# Content Parity Checker

Compares content across language versions of a multilingual site to identify translation gaps, structural differences, and outdated translations. Ensures all language versions provide equivalent content to users.

---

## Overview

Even with proper multilingual SEO setup, sites can suffer from incomplete translations, missing content, or outdated versions. This tool analyzes text length, structural elements, and file modification times to detect parity issues.

**Key Features:**

- Text content length comparison
- Structural element counting (headings, paragraphs, lists, images, links)
- File modification time tracking
- Configurable difference threshold
- Detailed comparison mode
- Warning vs. critical issue classification

**Comparison Metrics:**

- **Text Length:** Character count after removing HTML/scripts/styles
- **Headings:** Count of `<h1>`-`<h6>` elements
- **Paragraphs:** Count of `<p>` elements
- **List Items:** Count of `<li>` elements
- **Images:** Count of `<img>` elements
- **Links:** Count of `<a>` elements
- **Modification Time:** File last modified timestamp

---

## Usage

### Basic Usage

```bash
npm run check:parity -- --dir=/path/to/site
```

### Command-Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `--dir` | Current directory | Site root directory |
| `--languages` | `es,en` | Comma-separated language codes |
| `--threshold` | `20` | Max acceptable difference (%) |
| `--detailed` | `false` | Show detailed element counts |

### Examples

**Check Los Granainos:**

```bash
npm run check:parity -- --dir=allaboutv2/mx/demo/salva
```

**Stricter threshold (10%):**

```bash
npm run check:parity -- --dir=dist --threshold=10
```

**Detailed output:**

```bash
npm run check:parity -- --dir=public --detailed=true
```

**Three languages:**

```bash
npm run check:parity -- --dir=site --languages=fr,de,it
```

---

## How It Works

### 1. File Discovery

Scans first language directory (`/es/`) for HTML files:

```
/es/
  ├── index.html
  ├── about.html
  └── contact.html
```

### 2. Language Pairing

For each file in first language, finds corresponding files in other languages:

```
es/index.html ↔ en/index.html
es/about.html ↔ en/about.html
es/contact.html ↔ en/contact.html
```

### 3. Content Extraction

**Text Extraction Process:**

1. Remove `<script>` tags and content
2. Remove `<style>` tags and content
3. Remove HTML comments
4. Remove YAML frontmatter (if present)
5. Strip all HTML tags
6. Decode HTML entities (`&nbsp;` → space)
7. Normalize whitespace
8. Count characters

**Example:**

```html
<p>Los Granainos Restaurant serves authentic <strong>Spanish</strong> cuisine.</p>
<!-- Comment -->
<script>console.log('test');</script>
```

**Extracted Text:**

```
Los Granainos Restaurant serves authentic Spanish cuisine.
```

**Character Count:** 59

---

### 4. Structural Analysis

Counts HTML elements by type:

```javascript
{
  headings: 5,      // <h1> through <h6>
  paragraphs: 12,   // <p>
  listItems: 8,     // <li>
  images: 3,        // <img>
  links: 15         // <a>
}
```

---

### 5. Comparison Logic

**Text Length Comparison:**

```
Difference % = |length1 - length2| / max(length1, length2) × 100

Example:
  Spanish: 1200 characters
  English: 1450 characters
  Difference: 250 / 1450 × 100 = 17.2%

  If threshold = 20%: ✓ PASS
  If threshold = 10%: ✗ WARNING
```

**Structural Comparison:**

```
Element match = All element counts identical

Example:
  Spanish: {headings: 5, paragraphs: 12}
  English: {headings: 5, paragraphs: 12}
  Result: ✓ MATCH
```

**Modification Time:**

```
Out of sync = |mtime1 - mtime2| > 24 hours

Example:
  Spanish: 2026-02-20 10:00
  English: 2026-02-15 14:30
  Difference: 4 days, 19.5 hours
  Result: ⚠ WARNING (English may be outdated)
```

---

## Output Format

### Perfect Parity

```
🎉 Perfect parity! All language versions are in sync.

✅ PASSED CHECKS:
   ✓ index.html: Content length within threshold
   ✓ index.html: Structural parity (5 elements match)
   ✓ index.html: Modification times in sync

📊 SUMMARY:
   Passed: 3
   Warnings: 0
   Critical issues: 0
```

**Exit Code:** 0

---

### Warnings Present

```
⚠️  WARNINGS:

   ⚠ about.html:
      Content length difference: 23.5% (threshold: 20%)
      es: 1200 chars | en: 950 chars

   ⚠ contact.html:
      File modification times differ by 3 days
      es: 2026-02-20 | en: 2026-02-17

✅ PASSED CHECKS:
   ✓ index.html: Content length within threshold
   ✓ index.html: Structural parity

📊 SUMMARY:
   Passed: 2
   Warnings: 2
   Critical issues: 0
```

**Exit Code:** 0 (warnings don't block deployment)

---

### Critical Issues

```
❌ CRITICAL ISSUES:

   ✗ about.html:
      Missing English version
      es: exists | en: NOT FOUND

   ✗ contact.html:
      Structural mismatch
      es: {headings: 3, paragraphs: 8}
      en: {headings: 2, paragraphs: 6}

📊 SUMMARY:
   Passed: 1
   Warnings: 0
   Critical issues: 2
```

**Exit Code:** 1

---

## Detailed Mode

With `--detailed=true`, shows full element breakdown:

```
📄 Comparing: index.html

Spanish (es):
  Text length: 1,245 characters
  Elements:
    Headings: 4
    Paragraphs: 12
    List items: 8
    Images: 3
    Links: 15
  Last modified: 2026-02-20 10:30

English (en):
  Text length: 1,198 characters
  Elements:
    Headings: 4
    Paragraphs: 12
    List items: 8
    Images: 3
    Links: 15
  Last modified: 2026-02-20 10:28

Analysis:
  ✓ Length difference: 3.8% (within 20% threshold)
  ✓ Structural parity: All elements match
  ✓ Modification times: In sync (2 minutes apart)
```

---

## Threshold Tuning

**Default (20%):**

- Allows natural language differences (Spanish often longer than English)
- Catches major translation gaps
- Reduces false positives

**Stricter (10%):**

- Catches smaller content differences
- May flag acceptable translation variations
- Better for technical documentation

**Relaxed (30%):**

- Allows significant length variation
- Good for creative/marketing content
- May miss substantial gaps

---

## Workflow Integration

### Pre-Deployment Check

```bash
# Run parity check before deployment
npm run check:parity -- --threshold=15 || echo "⚠️ Review translation gaps"
```

### CI/CD Pipeline

```yaml
- name: Check Content Parity
  run: |
    npm run check:parity -- --dir=dist --threshold=20
  continue-on-error: true  # Warnings don't fail build
```

### Regular Monitoring

```bash
# Weekly parity audit
npm run check:parity -- --detailed=true > parity-report.txt
```

---

## Interpreting Results

**High Text Difference (>30%):**

- Possible incomplete translation
- Missing paragraphs/sections
- Check source files manually

**Structural Mismatch:**

- Different content structure
- Elements added/removed
- Review both versions

**Large Time Gap (>7 days):**

- Translation likely outdated
- Source updated but translation not
- Schedule retranslation

**Perfect Parity:**

- All versions current and complete
- Ready for deployment

---

## Troubleshooting

**No HTML files found:**

- Check `--dir` path is correct
- Verify language directories exist (`/es/`, `/en/`)

**Missing file errors:**

- One language has files the other doesn't
- Ensure all pages translated
- Use Template Generator to create missing versions

**High false positive rate:**

- Increase `--threshold` for natural variation
- Different languages have different verbosity

**All files show time mismatch:**

- Recent bulk update touched all files
- Warnings expected, can be ignored

---

## Implementation Details

**File:** `mx-canon/mx-the-gathering/reference-implementations/_tools/check-parity.js`
**Language:** Node.js
**Dependencies:** None (uses Node.js built-ins)
**NPM Script:** `check:parity`
**Exit Codes:**

- `0` - Success (warnings OK)
- `1` - Critical issues found (missing files, major mismatches)

---

## Related Tools

- **Multilingual Validator** - Checks SEO compliance
- **Deployment Helper** - Runs parity check in workflow
- **Asset Synchronizer** - Ensures asset consistency

---

*Part of MX OS. The instructions are the program.*
