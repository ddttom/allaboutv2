---
version: 0.1.0
description: Generate and validate llms.txt files for Robot-First Web compliance

created: 2026-02-06T12:19:00Z
modified: 2026-02-06T12:19:00Z

author: Maxine (MX - Machine eXperience Engine)

mx:
  name: llms-txt
  maintainer: mx.machine.experience@gmail.com
  license: proprietary
  status: draft

  category: mx-core
  partOf: mx-core
  refersTo: [robots-txt, sitemap, link-checker]
  tags: [llms-txt, robot-first, validation, generation]

  execute:
    runtime: runbook
    command: mx cog llms-txt
    actions:
      - name: generate
        description: Generate llms.txt from a website
        usage: mx cog llms-txt generate <url>
        inputs:
          - name: url
            type: string
            required: true
            description: Website URL to analyze
        outputs:
          - name: llms.txt
            type: file
            description: Generated llms.txt content

      - name: validate
        description: Validate an existing llms.txt
        usage: mx cog llms-txt validate <url|file>
        inputs:
          - name: source
            type: string
            required: true
            description: URL or local file path
        outputs:
          - name: report
            type: object
            description: Validation results with errors/warnings

  requires:
    bins: []
    cogs: []

  contentType: "action-doc"
  runbook: "mx exec llms-txt"
  convergence: true
  accessibility: true
  semantic: true
---

# llms-txt

Generate and validate llms.txt files for the Robot-First Web.

## Purpose

Help websites become AI-ready by creating proper llms.txt files that guide AI agents to relevant content.

## Usage

### Generate

```bash
mx cog llms-txt generate https://example.com
```

### Validate

```bash
mx cog llms-txt validate https://example.com/llms.txt
mx cog llms-txt validate ./llms.txt
```

## Related

- [llms.txt specification](https://llmstxt.org)
- [Tom's llms.txt guide](https://allabout.network/blogs/ddt/creating-an-llms-txt)
- [Anthropic's llms.txt](https://www.anthropic.com/llms.txt)
