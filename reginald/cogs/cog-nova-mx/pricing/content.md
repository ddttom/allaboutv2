---
name: pricing
version: 0.1.0
description: Validate pricing data to catch range errors and formatting issues

created: 2026-02-06T12:19:00Z
modified: 2026-02-06T12:19:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [schema]
tags: [pricing, validation, range-check, formatting, trust]

execute:
  runtime: runbook
  command: mx cog pricing
  actions:
    - name: validate
      description: Validate pricing data for range errors and formatting issues
      usage: mx cog pricing validate <url|file>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or file containing pricing
        - name: currency
          type: string
          required: false
          description: Expected currency (GBP, USD, EUR)
        - name: range
          type: object
          required: false
          description: Expected price range {min, max}
      outputs:
        - name: report
          type: object
          description: Validation results with detected prices, anomalies, warnings
    
    - name: extract
      description: Extract pricing data from a page
      usage: mx cog pricing extract <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to extract pricing from
      outputs:
        - name: prices
          type: array
          description: Array of detected prices with context

requires:
  bins: []
  cogs: [schema]

contentType: "action-doc"
runbook: "mx exec pricing"
convergence: true
accessibility: true
semantic: true
---

# pricing

Validate pricing data to catch range errors and formatting issues.

## Purpose

Catch the £200,000 errors before they erode trust. AI agents can misparse European number formatting, missing decimal points, or prices without proper Schema.org markup.

## The Problem

Tom's example: AI researching river cruises returned prices £200,000+ per person. Actual prices: £2,000-£4,000.

**Root causes:**

- European number formatting (1.000,00 vs 1,000.00)
- Missing range validation
- No structured pricing data (Schema.org)
- Delivered with same confidence as verified information

**Result:** Trust erosion through small, plausible errors delivered authoritatively.

## Usage

### Validate

```bash
mx cog pricing validate https://example.com/products
mx cog pricing validate ./prices.json --currency GBP --range '{"min": 100, "max": 10000}'
```

### Extract

```bash
mx cog pricing extract https://example.com/products
```

## What It Checks

- **Format consistency**: Decimal/thousand separators
- **Currency detection**: Symbol, code, positioning
- **Range plausibility**: Flag outliers based on context
- **Schema.org**: Proper Offer/PriceSpecification markup
- **Comparison**: Cross-reference multiple sources

## Related

- [Schema.org Offer](https://schema.org/Offer)
- [Schema.org PriceSpecification](https://schema.org/PriceSpecification)
