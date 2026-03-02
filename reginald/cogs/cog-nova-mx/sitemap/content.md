---
name: sitemap
version: 0.1.0
description: Analyze sitemaps and compare with llms.txt coverage

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [llms-txt, robots-txt, link-checker]
tags: [sitemap, xml, seo, llms-txt, coverage]

execute:
  runtime: runbook
  command: mx cog sitemap
  actions:
    - name: analyze
      description: Analyze sitemap structure and content
      usage: mx cog sitemap analyze <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Sitemap URL or website URL
      outputs:
        - name: analysis
          type: object
          description: Sitemap statistics and structure
    
    - name: compare
      description: Compare sitemap coverage with llms.txt
      usage: mx cog sitemap compare <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Website URL
      outputs:
        - name: comparison
          type: object
          description: Coverage comparison and gaps
    
    - name: validate
      description: Validate sitemap XML format
      usage: mx cog sitemap validate <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Sitemap URL
      outputs:
        - name: validation
          type: object
          description: Validation results with errors/warnings
    
    - name: freshness
      description: Check sitemap freshness and update frequency
      usage: mx cog sitemap freshness <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Sitemap URL
      outputs:
        - name: freshness
          type: object
          description: Last modified dates and update patterns

requires:
  bins: []
  cogs: [llms-txt, robots-txt]

contentType: "action-doc"
runbook: "mx exec sitemap"
convergence: true
accessibility: false
semantic: true
---

# sitemap

Analyze sitemaps and compare with llms.txt coverage.

## Purpose

Sitemaps tell search engines what pages exist. llms.txt tells AI agents what pages matter. This cog analyzes both to ensure comprehensive coverage.

A sitemap without llms.txt = search engines find you, AI doesn't understand you.
llms.txt without sitemap reference = AI understands you, but may miss pages.

## Usage

### Analyze

```bash
mx cog sitemap analyze https://example.com
mx cog sitemap analyze https://example.com/sitemap.xml
```

**Output:**

```json
{
  "url": "https://example.com/sitemap.xml",
  "type": "sitemapindex",
  "sitemaps": [
    {"url": "https://example.com/sitemap-posts.xml", "count": 150},
    {"url": "https://example.com/sitemap-pages.xml", "count": 25}
  ],
  "totalUrls": 175,
  "lastModified": "2026-02-01T10:00:00Z"
}
```

### Compare with llms.txt

```bash
mx cog sitemap compare https://example.com
```

**Output:**

```json
{
  "sitemap": {
    "totalUrls": 175,
    "categories": ["posts", "pages", "products"]
  },
  "llmsTxt": {
    "totalLinks": 12,
    "categories": ["docs", "blog", "about"]
  },
  "coverage": {
    "inBoth": 8,
    "sitemapOnly": 167,
    "llmsTxtOnly": 4
  },
  "gaps": [
    "Products not mentioned in llms.txt",
    "API docs in llms.txt but not in sitemap"
  ],
  "recommendation": "Add key product pages to llms.txt for AI visibility"
}
```

### Validate

```bash
mx cog sitemap validate https://example.com/sitemap.xml
```

**Output:**

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    "3 URLs return 404",
    "lastmod dates older than 1 year for 12 URLs"
  ]
}
```

### Freshness Check

```bash
mx cog sitemap freshness https://example.com
```

**Output:**

```json
{
  "sitemapLastModified": "2026-02-01T10:00:00Z",
  "urlFreshness": {
    "last24h": 5,
    "lastWeek": 23,
    "lastMonth": 45,
    "older": 102
  },
  "staleUrls": 15,
  "recommendation": "Update sitemap more frequently"
}
```

## Sitemap vs llms.txt

| Aspect | sitemap.xml | llms.txt |
|--------|-------------|----------|
| Audience | Search engines | AI agents |
| Purpose | Discovery | Understanding |
| Content | All URLs | Key URLs |
| Format | XML | Markdown |
| Metadata | lastmod, priority | Context, descriptions |

## Best Practice

1. **sitemap.xml** — List all indexable pages
2. **llms.txt** — Highlight key content with context
3. **Cross-reference** — Link sitemap from llms.txt
4. **Keep fresh** — Update both regularly

## Related

- [llms-txt cog](llms-txt.md)
- [robots-txt cog](robots-txt.md)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
