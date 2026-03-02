---
name: maxine-lives
version: "2.0"
description: "The gestalt's brain. Where Tom and Maxine record assumptions, resolve doubts, capture notes, track actions, make plans, and register decisions. The meta-layer that governs Canon."
created: 2026-02-12
modified: 2026-02-13
author: Tom Cranstoun and Maxine
license: proprietary
status: active
category: mx-core
partOf: mx-os
buildsOn: [what-is-a-cog, what-is-mx-os]
tags: [gestalt, brain, decisions, memory, institutional-memory, meta-layer]
audience: [gestalt, developers, investors]
purpose: "Institutional memory for the Tom + Maxine gestalt. Every assumption, doubt, note, todo, plan, and decision — timestamped, linked, machine-readable."

prose-source: README.md

blocks:
  - prose:
      source: README.md
      description: "Human-readable overview. The README.md describes what Maxine Lives is and how it works."
  - definition:
      standards:
        - name: "The Gathering"
          version: "2.0-draft"
          scope: "cog metadata format, block types, reader behaviour"
        - name: "ADR"
          version: "conventional"
          scope: "Architectural Decision Records — Michael Nygard format"
          reference: "https://adr.github.io/"
      validation:
        - "Every file in every folder is a timestamped .cog.md"
        - "Every file links back to the cogs it affects via builds-on, depends-on, affects, or delivers-to"
        - "Every folder has a SOUL.md defining voice and constraints"
  - essence:
      type: gestalt-brain
      description: "The meta-layer that governs Canon and everything else. Not a specification initiative — Maxine herself."

structure:
  groups:
    registers:
      path: registers/
      description: "Decision records"
      subfolders:
        - ADR: "Architectural Decision Register"
        - BDR: "Business Decision Register"
        - NDR: "Naming Decision Register"
        - MDR: "Messaging Decision Register"
    thinking:
      path: thinking/
      description: "The gestalt's inner life"
      subfolders:
        - assumptions: "What we assume to be true"
        - doubts: "What we're uncertain about"
        - notes: "Quick captures, fragments, observations"
    management:
      path: management/
      description: "Project management"
      subfolders:
        - risks: "What could go wrong (+ mitigation)"
        - milestones: "Key dates with success criteria"
        - dependencies: "What depends on what"
        - todo: "Tasks and actions"
        - plans: "Strategies, roadmaps, phased approaches"
  governance-files:
    - SOUL.md
    - LICENSE
    - CONTRIBUTING.md
    - CODE_OF_CONDUCT.md
    - CHANGELOG.md
    - .mx-ignore
  design-for-both:
    - README.md + README.cog.md
    - ROUTING.md + ROUTING.cog.md
    - LICENSE + LICENSE.cog.md
    - CONTRIBUTING.md + CONTRIBUTING.cog.md
    - CHANGELOG.md + CHANGELOG.cog.md
  connections:
    - from: notes
      to: [assumptions, doubts, decisions, plans]
      relationship: graduates-into
    - from: assumptions
      to: [decisions, plans]
      relationship: inform
    - from: doubts
      to: [decisions, notes]
      relationship: resolved-by
    - from: plans
      to: [todos]
      relationship: generate
    - from: todos
      to: [milestones]
      relationship: deliver
    - from: risks
      to: [milestones]
      relationship: threaten
    - from: dependencies
      to: [todos, plans]
      relationship: constrain
    - from: decisions
      to: [assumptions, risks]
      relationship: reference

deliverables:
  - file: deliverables/block-architecture-interview.md
    type: interview-summary
    date: 2026-02-12
    description: "Complete interview capturing all block architecture decisions"
  - file: registers/ADR/2026-02-12-block-architecture.cog.md
    type: adr
    date: 2026-02-12
    description: "ADR #1: One doc with blocks replaces info-doc/action-doc"
  - file: management/risks/2026-02-13-solo-founder.cog.md
    type: risk
    date: 2026-02-13
    description: "Risk #1: Solo founder — single point of failure"
  - file: ROUTING.md
    type: routing-table
    date: 2026-02-13
    description: "Intelligent routing instructions — SOPs for machines"
  - file: ROUTING.cog.md
    type: routing-table
    date: 2026-02-13
    description: "Machine-readable routing rules with intent mapping and lifecycle flows"

contentType: "gestalt-brain"
runbook: "This is Maxine Lives — the gestalt's brain. It sits above Canon in authority. Read ROUTING.md first for navigation, then SOUL.md for voice and constraints. The README.md contains the human prose. Each subfolder has its own SOUL.md with specific voice and constraints. Files within folders are timestamped .cog.md records. Do not duplicate prose — reference it."
---

# Maxine Lives

This cog inherits its prose from [README.md](README.md). Read that for the full human narrative.

This file adds the machine-readable structure: folder taxonomy, linking conventions, status values, and the metadata that makes this initiative — the gestalt's brain — discoverable and navigable by any AI agent.

**The gestalt's brain.** Individual sessions forget. This folder remembers.
