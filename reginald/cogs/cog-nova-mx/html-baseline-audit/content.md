---
title: HTML Baseline Audit & Regression Detection
description: Action-doc for establishing HTML baselines and detecting regressions across all .cog.html files. Automates visual, structural, style, and metadata comparison.
version: "1.0"
created: 2026-02-21
modified: 2026-02-21
author: Tom Cranstoun and Maxine

mx:
  name: html-baseline-audit
  category: validation
  status: active
  tags: [html, audit, baseline, regression, testing, automation, validation, ci-cd]
  audience: [tech]

  partOf: mx-cog-registry

  buildsOn: [manual-html-baseline-audit, manual-enhanced-audit]

  runtime: nodejs
  purpose: Establish HTML baseline and detect regressions
  contentType: action-doc
  runbook: |
  action:
    establish-baseline:
      description: "Discover all .cog.html files and establish comprehensive baseline"
      command: "npm run audit:html:baseline"
      inputs: []
      outputs:
        - "mx-outputs/html/audit/baselines/YYYY-MM-DD-HH-MM-SS/index.json"
        - "Per-file audit data in subdirectories"
      exit-codes:
        0: "All files successfully audited"
        1: "Some files failed (check index.json)"

    detect-regressions:
      description: "Compare current HTML state against latest baseline"
      command: "npm run audit:html:compare"
      inputs:
        - "Latest baseline from mx-outputs/html/audit/baselines/"
      outputs:
        - "mx-outputs/md/audit/comparison-YYYY-MM-DD.json"
        - "mx-outputs/md/audit/comparison-YYYY-MM-DD.md"
      exit-codes:
        0: "No regressions detected"
        1: "Regressions detected (review required)"
        2: "Error (no baseline or audit failed)"

    check-cogify:
      description: "Verify cogify (enhanced audit) is installed"
      command: "npm run cogify:check"
      outputs:
        - "JSON with cache validity status"

    install-cogify:
      description: "Install cogify and Playwright dependencies"
      command: "npm run cogify:install"
      outputs:
        - "Playwright chromium browser installed"

  definition:
    standards:
      - name: "MX Cog Standard"
        version: "2.1"
        authority: "The Gathering"
        compliance: "full"
      - name: "Enhanced Audit System"
        version: "2.0"
        authority: "Cog-Nova-MX"
        compliance: "full"

    comparison-thresholds:
      visual:
        minor: "1% pixels changed"
        medium: "5% pixels changed"
        major: "10% pixels changed"
      structural:
        element-count: "5% change"
        depth: "2 levels change"
      styles:
        colors: "Any color added/removed"
        fonts: "Any font added/removed"
      metadata:
        version: "Any version change"
        compliance: "Any level change"

  policy:
    merging: mixin
    inheritance: soft
    automation:
      ci-cd: "recommended"
      pre-commit: "recommended"
      manual: "required for baseline establishment"

  security:
    execution: local
    network: "Required (local HTTP server for file:// URLs)"
    file-access: "read-write (baseline storage)"

  provenance:
    source:
      scripts:
        - "scripts/lib/html-audit-utils.js"
        - "scripts/audit-html-baseline.js"
        - "scripts/audit-html-compare.js"
      npm-scripts:
        - "audit:html:baseline"
        - "audit:html:compare"
    dependencies:
      - "Enhanced Audit System (npm run cogify)"
      - "glob (file discovery)"
      - "http-server (local file serving)"
      - "js-yaml (YAML parsing)"
---

# HTML Baseline Audit & Regression Detection

Automated workflow for establishing HTML baselines and detecting regressions across all `.cog.html` files in the repository.

## Quick Reference

**Establish baseline:**

```bash
npm run audit:html:baseline
```

**Detect regressions:**

```bash
npm run audit:html:compare
```

## How It Works

### 1. Baseline Establishment

```text
glob **/*.cog.html
→ Start HTTP server (local files)
→ For each file:
    Run cogify --target=URL
    Copy outputs to baseline/TIMESTAMP/
→ Generate index.json summary
→ Stop HTTP server
```

### 2. Regression Detection

```text
Load latest baseline index.json
→ Run fresh baseline audit
→ For each file:
    Compare screenshots (pixel diff)
    Compare structure (elements, depth, sections)
    Compare styles (colors, fonts, CSS properties)
    Compare metadata (YAML frontmatter)
→ Generate comparison report
→ Exit with code (0=pass, 1=fail, 2=error)
```

## Regression Types

### Visual

- **Pixel comparison** of screenshots
- Threshold: >1% pixels changed
- Severity: LOW (<5%), MEDIUM (5-10%), HIGH (>10%)

### Structural

- **Element count** changes (>5%)
- **Max depth** changes (±2 levels)
- **Sections** added/removed
- **Landmarks** added/removed

### Style

- **Colors** added/removed
- **Fonts** added/removed
- **Custom properties** count changes

### Metadata

- **Version** changes (YAML frontmatter)
- **Compliance level** changes
- **Required fields** missing

## Integration Points

### With step-commit

Add to step-commit workflow:

```bash
# Before creating commit
npm run audit:html:compare

# If regressions detected, prompt user:
# - Fix regressions and retry
# - Establish new baseline (if intentional)
# - Skip (with warning)
```

### With CI/CD

GitHub Actions workflow:

```yaml
- name: HTML Regression Check
  run: npm run audit:html:compare
  # Exit code 1 fails the build
```

### With development workflow

Pre-commit hook:

```bash
# .git/hooks/pre-commit
npm run audit:html:compare || {
  echo "HTML regressions detected!"
  echo "Review: mx-outputs/md/audit/comparison-*.md"
  exit 1
}
```

## Outputs

### Baseline Index (index.json)

```json
{
  "mx": {
    "name": "html-baseline-audit-index",
    "timestamp": "2026-02-21T15:30:00Z"
  },
  "baseline": {
    "established": "2026-02-21T15:30:00Z",
    "totalFiles": 12,
    "successful": 12
  },
  "files": [...]
}
```

### Comparison Report (comparison-*.md)

```markdown
# HTML Baseline Comparison Report

**Baseline:** 2026-02-21T15:30:00Z (12 files)
**Current:** 2026-02-21T16:45:00Z

## Summary

| Metric | Count |
|--------|-------|
| Total files | 12 |
| Unchanged | 10 |
| Visual regressions | 1 |
| Structural regressions | 1 |

## Regressions Detected

### ⚠️ file.cog.html

**Structural Changes:**
- Element count: 166 → 158 (-8 elements, -4.8%)
- Sections removed: ["contacto"]

**Style Changes:**
- Missing color: #d4704b (coral)
```

## Error Handling

### No baseline found

```bash
Error: No baseline found
Run this first: npm run audit:html:baseline
```

**Resolution:** Establish baseline first

### Cogify not installed

```bash
Error: cogify command not found
```

**Resolution:** `npm run cogify:install`

### Audit failed

```bash
Error: Current audit failed
```

**Resolution:** Check Playwright installation, network connectivity

## Best Practices

1. **Establish baseline on stable state** - Don't baseline mid-development
2. **Commit baselines to git** - Share baseline across team
3. **Review regressions carefully** - Don't blindly re-baseline
4. **Use in CI/CD** - Catch regressions before merge
5. **Re-baseline intentionally** - After approved HTML changes
6. **Use partnership tone in reports** - All comparison reports generated with constructive, collaborative language

## Partnership Reporting

Comparison reports are automatically generated using **partnership tone** rather than critical/technical tone:

**Tone Framework:**

- **Strengths first:** "✅ Baseline Compliance" section before change patterns
- **Constructive framing:** "Changes detected - review to determine if intentional" rather than "Regressions found"
- **Opportunity language:** "Pattern count" rather than "Violation count"
- **Actionable guidance:** Clear next steps for both intentional and unintentional changes

**Why This Matters:**

Reports may be shared with clients, partners, or stakeholders. Partnership tone:

- Opens collaboration conversations
- Demonstrates professionalism
- Positions findings as service opportunities
- Aligns with Cog-Nova-MX' consultative approach

**Complete Guidelines:**

- **Partnership Reporting Manual:** `mx-canon/mx-maxine-lives/manuals/manual-partnership-reporting.cog.md`

## Related Documentation

- **Manual:** `mx-canon/mx-maxine-lives/manuals/manual-html-baseline-audit.cog.md`
- **Enhanced Audit:** `mx-canon/mx-maxine-lives/manuals/manual-enhanced-audit.cog.md`
- **Partnership Reporting:** `mx-canon/mx-maxine-lives/manuals/manual-partnership-reporting.cog.md`

---

**Version:** 1.0
**Runtime:** Node.js
**Status:** Production Ready
