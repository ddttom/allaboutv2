---
name: semantic-html
version: 0.1.0
description: Validate HTML semantics — structure precedes presentation

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [a11y, metadata, schema]
tags: [html, semantic, structure, accessibility, validation]

execute:
  runtime: runbook
  command: mx cog semantic-html
  actions:
    - name: validate
      description: Validate semantic HTML structure
      usage: mx cog semantic-html validate <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to validate
      outputs:
        - name: report
          type: object
          description: Validation results with semantic score and issues
    
    - name: outline
      description: Generate document outline from headings
      usage: mx cog semantic-html outline <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to analyze
      outputs:
        - name: outline
          type: object
          description: Hierarchical document outline
    
    - name: landmarks
      description: Extract ARIA landmarks and HTML5 sections
      usage: mx cog semantic-html landmarks <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to analyze
      outputs:
        - name: landmarks
          type: array
          description: List of landmarks with roles and labels
    
    - name: suggest
      description: Suggest semantic improvements
      usage: mx cog semantic-html suggest <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to analyze
      outputs:
        - name: suggestions
          type: array
          description: List of suggested improvements

requires:
  bins: []
  cogs: []

mx:
  contentType: "action-doc"
  runbook: "mx exec semantic-html"
  convergence: true
  accessibility: true
  semantic: true
---

# semantic-html

Validate HTML semantics — structure precedes presentation.

## Purpose

Semantic HTML is the foundation of both accessibility and machine-readability. When content has meaning encoded in markup, everyone benefits:

- **Screen readers** navigate by landmarks and headings
- **AI agents** parse structure reliably
- **Search engines** understand content hierarchy
- **Humans** get consistent, predictable interfaces

The "Design by Engineer Trap": websites built as text/image boxes without semantic meaning. This cog detects and fixes that.

## Usage

### Validate

```bash
mx cog semantic-html validate https://example.com
```

**Output:**

```json
{
  "score": 72,
  "issues": [
    {"severity": "error", "message": "No <main> element found"},
    {"severity": "warning", "message": "Navigation not wrapped in <nav>"},
    {"severity": "info", "message": "Consider using <article> for blog posts"}
  ]
}
```

### Document Outline

```bash
mx cog semantic-html outline https://example.com
```

**Output:**

```
h1: Welcome to Example
  h2: About Us
    h3: Our Team
    h3: Our Mission
  h2: Services
    h3: Consulting
    h3: Development
  h2: Contact
```

### Landmarks

```bash
mx cog semantic-html landmarks https://example.com
```

**Output:**

```json
[
  {"role": "banner", "element": "header", "label": null},
  {"role": "navigation", "element": "nav", "label": "Main navigation"},
  {"role": "main", "element": "main", "label": null},
  {"role": "contentinfo", "element": "footer", "label": null}
]
```

### Suggest Improvements

```bash
mx cog semantic-html suggest https://example.com
```

## What It Checks

### Required Elements

- `<main>` — Primary content
- `<header>` — Banner/header
- `<footer>` — Footer content
- `<nav>` — Navigation regions

### Content Structure

- Proper heading hierarchy (h1 → h2 → h3)
- Single h1 per page
- Headings not skipped

### Semantic Elements

- `<article>` for standalone content
- `<section>` for thematic groups
- `<aside>` for tangential content
- `<figure>` and `<figcaption>` for images

### Anti-Patterns

- `<div>` soup (divs for everything)
- Headings for styling (not structure)
- Missing landmark roles
- Generic link text ("click here")

## The Scoring

| Score | Rating |
|-------|--------|
| 90-100 | Excellent — fully semantic |
| 70-89 | Good — minor improvements needed |
| 50-69 | Fair — significant issues |
| 0-49 | Poor — needs restructuring |

## Related

- [a11y cog](a11y.md)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements)
- [ARIA Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
