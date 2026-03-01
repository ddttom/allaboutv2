---
name: schema
version: 0.1.0
description: Validate and generate Schema.org structured data markup

created: 2026-02-06T12:19:00Z
modified: 2026-02-06T12:19:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [metadata, pricing, semantic-html]
tags: [schema.org, json-ld, structured-data, seo, accessibility]

execute:
  runtime: runbook
  command: mx cog schema
  actions:
    - name: validate
      description: Validate Schema.org markup on a page
      usage: mx cog schema validate <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to validate
      outputs:
        - name: report
          type: object
          description: Validation results with schema types found, errors, warnings
    
    - name: extract
      description: Extract structured data from a page
      usage: mx cog schema extract <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to extract from
      outputs:
        - name: schemas
          type: array
          description: Array of JSON-LD objects found
    
    - name: suggest
      description: Suggest Schema.org types for content
      usage: mx cog schema suggest <url|content>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or content to analyze
      outputs:
        - name: suggestions
          type: array
          description: Recommended schema types and properties

requires:
  bins: []
  cogs: []

mx:
  contentType: "action-doc"
  runbook: "mx exec schema"
  convergence: true
  accessibility: true
  semantic: true
---

# schema

Validate and generate Schema.org structured data markup.

## Purpose

Schema.org markup helps both AI agents and search engines understand content. This cog validates existing markup and suggests improvements.

## Usage

### Validate

```bash
mx cog schema validate https://example.com
```

### Extract

```bash
mx cog schema extract https://example.com
```

### Suggest

```bash
mx cog schema suggest https://example.com
mx cog schema suggest "Article about Robot-First Web design principles"
```

## Related

- [Schema.org](https://schema.org)
- [Google Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool)
- [JSON-LD Playground](https://json-ld.org/playground/)
