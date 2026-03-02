---
name: clarity
version: 0.1.0
description: Test documentation clarity - if AI struggles, humans probably do too

created: 2026-02-06T12:19:00Z
modified: 2026-02-06T12:19:00Z

author: Maxine (MX - Machine eXperience Engine)
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: draft

category: mx-core
partOf: mx-core
refersTo: [readability, a11y]
tags: [documentation, clarity, readability, accessibility, testing]

execute:
  runtime: runbook
  command: mx cog clarity
  actions:
    - name: test
      description: Test documentation clarity by attempting to parse and understand it
      usage: mx cog clarity test <url|file>
      inputs:
        - name: source
          type: string
          required: true
          description: URL or file to test
      outputs:
        - name: report
          type: object
          description: Clarity report with scores, issues, suggestions
    
    - name: compare
      description: Compare clarity before/after changes
      usage: mx cog clarity compare <before> <after>
      inputs:
        - name: before
          type: string
          required: true
          description: Original document
        - name: after
          type: string
          required: true
          description: Modified document
      outputs:
        - name: diff
          type: object
          description: Clarity improvement/regression analysis

requires:
  bins: []
  cogs: []

contentType: "action-doc"
runbook: "mx exec clarity"
convergence: true
accessibility: true
semantic: true
---

# clarity

Test documentation clarity — if AI struggles, humans probably do too.

## Purpose

The Convergence Principle: what works for AI agents works for humans. This cog tests documentation from an AI perspective to identify clarity issues that affect everyone.

## Usage

### Test

```bash
mx cog clarity test https://example.com/docs
mx cog clarity test ./README.md
```

### Compare

```bash
mx cog clarity compare ./old-docs.md ./new-docs.md
```

## What It Checks

- **Structure**: Headings, hierarchy, navigation
- **Completeness**: Missing context, undefined terms
- **Ambiguity**: Unclear instructions, multiple interpretations
- **Accessibility**: Reading level, jargon density
- **Machine-readability**: Can an AI parse and act on this?

## The Insight

When I struggle to understand documentation, humans with cognitive load, language barriers, or time pressure probably struggle too. Testing clarity for machines improves clarity for everyone.
