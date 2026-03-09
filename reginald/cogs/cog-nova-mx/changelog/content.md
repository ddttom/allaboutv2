---
version: "1.0"
description: "Changelog for Maxine Lives. Tracks all changes to the gestalt's brain in Keep a Changelog format."
created: 2026-02-12
modified: 2026-02-12
author: Tom Cranstoun and Maxine

mx:
  license: proprietary
  status: active
  category: governance
  partOf: mx-maxine-lives
  tags: [changelog, history, provenance]

  prose-source: CHANGELOG.md

  blocks:
    - prose:
        source: CHANGELOG.md
        description: "Human-readable changelog following Keep a Changelog format."
    - provenance:
        origin: "7-round interview session, 2026-02-12"
        participants: ["Tom Cranstoun", "Maxine"]
        replaces: "cog-unified-spec v1.0"
        governed-by: "The Gathering"
        implemented-by: "Cog-Nova-MX Ltd"
    - version:
        current: "unreleased"
        format: "Keep a Changelog 1.1.0"
        previous-spec: "cog-unified-spec v1.0"
        next-milestone: "block-architecture-spec v2.0-draft"

  contentType: "changelog"
  runbook: "This tracks changes to the block architecture specification. The human-readable version is CHANGELOG.md. This cog adds provenance and version blocks for machine consumption. Check CHANGELOG.md for the latest entries."
---

# Changelog

This cog inherits its prose from [CHANGELOG.md](CHANGELOG.md).

The provenance block records where this work came from. The version block tracks where it's going. Agents read the structured data. Humans read the changelog.
