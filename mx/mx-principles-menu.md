---
title: "Machine Experience: The Core Principles"
author: "Tom Cranstoun"
created: "2026-02-03"
description: "Quick reference menu listing the core Machine Experience principles for building digital products that work for everyone."
tags:
  - machine-experience
  - design-principles
  - quick-reference
  - menu
  - core-principles

mx:
  contentType: "reference-page"
  state: "published"
  version: "1.1"
  lastUpdated: "2026-02-04"

  runbook: |
    This is a simple menu-style reference page listing the core
    Machine Experience principles. Designed for quick scanning and navigation.

    Format: Menu-style with principle names and brief descriptions.
    Purpose: Quick reference for practitioners.

  audience: ["humans", "machines"]

  ai:
    contextProvides:
      - "mx-principles-overview"
      - "quick-reference-menu"
      - "core-principles-list"

    contextRequired:
      - "PRINCIPLES.md"

  related:
    - "PRINCIPLES.md"
    - "mx-principles-blog.md"

co:
  workflow: "published"
  reviewRequired: false
---

# Machine Experience: The Core Principles

Making the web work for everyone and everything that uses it.

---

## The Principles

### 1. Design for Both

Every design decision should optimize for both human developers and AI agents simultaneously. The best solutions serve both audiences without compromise.

### 2. Metadata-Driven Architecture

Use structured metadata to make content and code maximally machine-readable whilst remaining human-readable. Implement at repository, directory, file, and code levels.

### 3. Context Declaration

Files explicitly declare what context they provide and what context they require. Enables AI agents to understand dependencies and prevents errors from incomplete understanding.

### 4. Universal Accessibility

Content must be accessible to all types of AI agents regardless of their capabilities. Plain text formats, explicit markup, and declared relationships serve both disabled users and automated systems.

### 5. Context-Preserving References

Links and references must remain meaningful when documents are separated from their repository context. Works in IDEs, PDFs, extracted files, and AI context windows.

### 6. Size-Neutral Documentation

Avoid hard-coded counts in documentation. Use descriptive language that remains accurate as collections grow or shrink. Reduces maintenance burden and prevents documentation drift.

### 7. Executable Documentation

Documents contain their own generation instructions, enabling self-documenting specifications with executable build logic. Single source of truth that serves as both documentation and implementation guide.

### 8. WCAG-Informed Design

Align design decisions with Web Content Accessibility Guidelines (WCAG) standards. Accessibility requirements for disabled users provide proven patterns that also benefit machine readability. Demonstrates convergence: patterns optimized for disabled users also optimize for machines.

---

## Core Philosophy

**Design for both audiences simultaneously, not one at the expense of the other.**

When you make meaning explicit rather than implicit, you help everyone. When you structure information semantically rather than just visually, you serve all users regardless of their capabilities or access methods.

---

## Implementation Layers

Machine Experience operates at four distinct layers:

**Repository Level** - Project context and conventions

**Directory Level** - Package-specific context

**File Level** - Document purpose and audience

**Code Level** - Function behavior declarations

---

## Required Metadata

Every MX-compliant file includes:

**purpose** - What this file does

**audience** - human, machine, or both

**stability** - experimental, unstable, stable, frozen

**contextProvides** - Topics this file establishes

**related_files** - Cross-references to related content

---

## The Convergence Principle

Patterns that optimize for machine comprehension simultaneously improve human accessibility and comprehension. This isn't a trade-off—it's convergence on the fundamental principle of explicit, semantic communication.

---

## Benefits

**For AI Agents**: Complete context, clear permissions, reduced errors, faster navigation

**For Humans**: Self-documenting code, clear structure, reduced onboarding, better tooling

**For Projects**: Maintainability, discoverability, consistency, future-proofing

---

**Source**: This menu synthesizes the core principles from the comprehensive MX Principles documentation. For complete technical specifications and detailed implementation guidance, see the forthcoming "MX the bible".

MX Technologies Ltd - Making the web work for everyone and everything that uses it.

**Version**: 1.1
**Last Updated**: 2026-02-04
**Status**: Published
