---
name: robots-txt
version: 0.1.0
description: Analyze robots.txt — understand the old exclusion model

created: 2026-02-06T12:31:00Z
modified: 2026-02-06T12:31:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [llms-txt, sitemap]
tags: [robots-txt, crawlers, exclusion, seo, llms-txt]

execute:
  runtime: runbook
  command: mx cog robots-txt
  actions:
    - name: analyze
      description: Analyze robots.txt file
      usage: mx cog robots-txt analyze <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Website URL (robots.txt auto-appended)
      outputs:
        - name: analysis
          type: object
          description: Parsed rules, user-agents, allowed/disallowed paths
    
    - name: check
      description: Check if a path is allowed for a user-agent
      usage: mx cog robots-txt check <url> --path <path> --agent <agent>
      inputs:
        - name: url
          type: string
          required: true
          description: Website URL
        - name: path
          type: string
          required: true
          description: Path to check
        - name: agent
          type: string
          required: false
          description: User-agent to check for
          default: "*"
      outputs:
        - name: allowed
          type: boolean
          description: Whether path is allowed
    
    - name: compare
      description: Compare robots.txt with llms.txt
      usage: mx cog robots-txt compare <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Website URL
      outputs:
        - name: comparison
          type: object
          description: Side-by-side comparison of exclusion vs inclusion
    
    - name: ai-stance
      description: Analyze stance on AI crawlers
      usage: mx cog robots-txt ai-stance <url>
      inputs:
        - name: url
          type: string
          required: true
          description: Website URL
      outputs:
        - name: stance
          type: object
          description: AI crawler policies (GPTBot, Claude, Bard, etc.)

requires:
  bins: []
  cogs: [llms-txt]

contentType: "action-doc"
runbook: "mx exec robots-txt"
convergence: true
accessibility: false
semantic: true
---

# robots-txt

Analyze robots.txt — understand the old exclusion model.

## Purpose

robots.txt is the "Do Not Enter" sign of the web. For 30 years, it's been a gentlemen's agreement between websites and crawlers.

But the AI era changes things:

- **robots.txt** = exclusion (don't crawl this)
- **llms.txt** = inclusion (here's how to understand us)

This cog analyzes robots.txt to understand a site's crawler policy, especially regarding AI agents.

## Usage

### Analyze

```bash
mx cog robots-txt analyze https://example.com
```

**Output:**

```json
{
  "url": "https://example.com/robots.txt",
  "userAgents": ["*", "Googlebot", "GPTBot"],
  "rules": [
    {"agent": "*", "allow": ["/"], "disallow": ["/private/"]},
    {"agent": "GPTBot", "disallow": ["/"]}
  ],
  "sitemaps": ["https://example.com/sitemap.xml"],
  "crawlDelay": null
}
```

### Check Path

```bash
mx cog robots-txt check https://example.com --path /blog --agent Googlebot
mx cog robots-txt check https://example.com --path /api --agent GPTBot
```

### Compare with llms.txt

```bash
mx cog robots-txt compare https://example.com
```

**Output:**

```json
{
  "robotsTxt": {
    "exists": true,
    "aiBlocked": ["GPTBot", "Claude-Web"],
    "aiAllowed": ["Googlebot"]
  },
  "llmsTxt": {
    "exists": true,
    "sections": 4,
    "links": 12
  },
  "analysis": "Site blocks AI crawlers but provides llms.txt guidance — selective AI engagement"
}
```

### AI Stance

```bash
mx cog robots-txt ai-stance https://example.com
```

**Output:**

```json
{
  "overall": "restrictive",
  "crawlers": {
    "GPTBot": "blocked",
    "Claude-Web": "blocked",
    "Google-Extended": "blocked",
    "Googlebot": "allowed",
    "Bingbot": "allowed"
  },
  "hasLlmsTxt": true,
  "interpretation": "Blocks training crawlers, allows search crawlers, provides llms.txt for direct AI queries"
}
```

## Known AI Crawlers

| Crawler | Company | Purpose |
|---------|---------|---------|
| GPTBot | OpenAI | Training & browsing |
| ChatGPT-User | OpenAI | ChatGPT browsing |
| Claude-Web | Anthropic | Claude browsing |
| Google-Extended | Google | Bard/Gemini training |
| Amazonbot | Amazon | Alexa training |
| CCBot | Common Crawl | Dataset building |
| FacebookBot | Meta | AI training |

## The Evolution

**1994-2020s:** robots.txt as binary permission

- Crawl or don't crawl
- Honor system
- Simple exclusion

**2024+:** Nuanced AI policies

- Block training, allow search
- Provide llms.txt for guidance
- Selective engagement

## Related

- [llms-txt cog](llms-txt.md)
- [sitemap cog](sitemap.md)
- [robots.txt specification](https://www.robotstxt.org/)
