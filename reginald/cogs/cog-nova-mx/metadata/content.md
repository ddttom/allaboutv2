---
name: metadata
version: 0.1.0
description: Extract and validate page metadata (Open Graph, Twitter Cards, meta tags)

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [schema, semantic-html]
tags: [metadata, opengraph, twitter-cards, seo, social]

execute:
  runtime: runbook
  command: mx cog metadata
  actions:
    - name: extract
      description: Extract all metadata from a page
      usage: mx cog metadata extract <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to extract metadata from
      outputs:
        - name: metadata
          type: object
          description: All extracted metadata organized by type
    
    - name: validate
      description: Validate metadata completeness
      usage: mx cog metadata validate <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to validate
      outputs:
        - name: validation
          type: object
          description: Validation results with missing/invalid fields
    
    - name: preview
      description: Preview how page appears in social shares
      usage: mx cog metadata preview <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to preview
        - name: platform
          type: string
          required: false
          description: Platform (twitter, facebook, linkedin, slack)
      outputs:
        - name: previews
          type: object
          description: Rendered preview data for each platform
    
    - name: suggest
      description: Suggest metadata improvements
      usage: mx cog metadata suggest <url>
      inputs:
        - name: url
          type: string
          required: true
          description: URL to analyze
      outputs:
        - name: suggestions
          type: array
          description: Recommended improvements

requires:
  bins: []
  cogs: [schema]

mx:
  contentType: "action-doc"
  runbook: "mx exec metadata"
  convergence: true
  accessibility: true
  semantic: true
---

# metadata

Extract and validate page metadata (Open Graph, Twitter Cards, meta tags).

## Purpose

Metadata tells machines about your content before they read it. Good metadata means:

- **AI agents** understand context immediately
- **Social platforms** display rich previews
- **Search engines** show accurate snippets
- **Screen readers** announce meaningful titles

Poor metadata = AI guessing, broken previews, missed context.

## Usage

### Extract

```bash
mx cog metadata extract https://example.com/article
```

**Output:**

```json
{
  "basic": {
    "title": "How to Build for the Robot-First Web",
    "description": "A guide to making your website AI-ready",
    "author": "Tom Cranstoun",
    "canonical": "https://example.com/article"
  },
  "openGraph": {
    "og:title": "How to Build for the Robot-First Web",
    "og:description": "A guide to making your website AI-ready",
    "og:image": "https://example.com/images/robot-web.jpg",
    "og:type": "article",
    "og:url": "https://example.com/article"
  },
  "twitter": {
    "twitter:card": "summary_large_image",
    "twitter:title": "How to Build for the Robot-First Web",
    "twitter:description": "A guide to making your website AI-ready",
    "twitter:image": "https://example.com/images/robot-web.jpg"
  },
  "schema": {
    "@type": "Article",
    "headline": "How to Build for the Robot-First Web",
    "author": {"@type": "Person", "name": "Tom Cranstoun"}
  }
}
```

### Validate

```bash
mx cog metadata validate https://example.com/article
```

**Output:**

```json
{
  "score": 85,
  "missing": [
    "og:locale",
    "twitter:creator",
    "article:published_time"
  ],
  "invalid": [],
  "warnings": [
    "og:image smaller than recommended (1200x630)",
    "description longer than 160 characters"
  ]
}
```

### Social Preview

```bash
mx cog metadata preview https://example.com/article
mx cog metadata preview https://example.com/article --platform twitter
```

### Suggest Improvements

```bash
mx cog metadata suggest https://example.com/article
```

## Required Metadata

### Minimum (All Pages)

```html
<title>Page Title</title>
<meta name="description" content="Page description">
<link rel="canonical" href="https://example.com/page">
```

### Open Graph (Social Sharing)

```html
<meta property="og:title" content="Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

## Image Requirements

| Platform | Minimum | Recommended | Aspect |
|----------|---------|-------------|--------|
| Open Graph | 200x200 | 1200x630 | 1.91:1 |
| Twitter | 144x144 | 1200x628 | ~2:1 |
| LinkedIn | 1200x627 | 1200x627 | 1.91:1 |

## Related

- [schema cog](schema.md)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
