---
title: "BDR: Hub Repository as Mount Table — Git Repos as Trackable Filesystems"
description: "BDR: MX-hub as a template where submodules are categorised mounts (personal, team, product, standard) any MX business can swap for their workspace."
version: "1.0"
created: 2026-03-01
modified: 2026-03-02
author: Tom Cranstoun and Maxine

mx:
  status: accepted
  category: decision-record
  tags: [architecture, submodules, mount-table, filesystem, git, hub, template, mx-os]
  bdr:
    number: 3
    title: "Hub Repository as Mount Table — Git Repos as Trackable Filesystems"
    status: accepted
    date: 2026-03-01
    context: "MX-hub has grown organically with submodules but lacks a formal model for which repos are personal, which are shared products, and which are team-specific. As MX moves toward multiple businesses and team members, the hub must be understood as a template, not a monolith."
    decision: "Establish MX-hub as a mount-table template. Categorise all submodules as personal, team, product, or standard. Any git repo with .mx.yaml becomes a trackable filesystem. Any git host is valid."
    consequences: "Each submodule gains x-mx-mount-type metadata (Cog-Nova-MX vendor extension). New businesses clone the hub and swap personal repos. Canon forks per business with upstream sync from The Gathering standard. The architecture is documented for team onboarding and investor due diligence."
  runbook: "This is a business decision record. It documents the architectural model for MX-hub as a mount-table template where git repositories serve as trackable filesystems."
---

# BDR 003: Hub Repository as Mount Table

## Context

MX-hub contains submodules that serve fundamentally different purposes. Some hold personal data (Tom's CRM, Tom's build artefacts, Tom's website). Some are shared products (the audit tool, Reginald, Maxine). Some are team collaboration spaces. Some carry the open standard.

As MX grows beyond a single-person operation — with Scott, Helen, Eleanor, and eventually customers — the hub cannot remain "Tom's workspace." It must become a **template** that anyone can clone and configure for their own business.

The insight: **git repositories are trackable filesystems.** Version-controlled, auditable, mountable, swappable. The hub's `.gitmodules` file is effectively a mount table — it declares what is attached and where. MX OS metadata (`.mx.yaml`) makes every mounted repo navigable by AI agents.

This is not limited to GitHub. Any git host — GitHub, GitLab, Bitbucket, self-hosted — produces valid mounts. The mount table does not care about the host, only that the repo is git-managed and carries `.mx.yaml` metadata.

## Decision

### 1. Categorise all submodules by mount type

Every submodule in MX-hub belongs to one of four categories:

| Mount type | Description | Swapped per business? | Examples |
| ---------- | ----------- | --------------------- | -------- |
| **personal** | Belongs to one person or business. Contains their data, their outputs, their site. | Yes — each person/business mounts their own | mx-crm, mx-outputs, allaboutv2 |
| **team** | Shared within a project team. Collaboration space for humans and agents. | Yes — each team has their own | mx-collaboration |
| **product** | Cog-Nova-MX products. Shared across all MX-powered businesses. | No — same repo, mounted by customers | mx-audit, mx-reginald, mx-maxine-app |
| **standard** | The Gathering open standard. Forked per business with upstream sync. | Fork — upstream standard + local cogs | mx-canon |

### 2. Hub is the template

A new MX-powered business would:

1. Clone MX-hub as their starting point
2. Keep product submodules (mx-audit, mx-reginald, mx-maxine-app) — same repos
3. Fork Canon — inherits The Gathering standard, adds their own business-specific cogs, can pull upstream updates
4. Swap personal submodules — mount their own CRM, their own outputs, their own website
5. Create or join a team collaboration repo

### 3. Canon forks with upstream sync

When a business forks mx-canon:

- They receive all Gathering standard cogs (the open standard layer)
- They add their own business-specific cogs alongside the standard
- They can pull upstream updates when The Gathering releases new standard cogs
- The standard layer updates independently from business-specific content

This follows the MX OS inheritance model: standard → business → personal.

### 4. Any git repo is a filesystem

The vision extends beyond MX-hub submodules:

- Any git repository with `.mx.yaml` metadata becomes a trackable filesystem
- AI agents can navigate it using the metadata hierarchy
- The hub's submodule list is one mount table, but any project can define its own
- Git hosts are interchangeable — the mount table declares a URL, not a platform

### 5. Self-describing mount table

Each submodule's `.mx.yaml` must declare its mount type so the mount table is machine-readable:

```yaml
x-mx-mount-type: personal | team | product | standard
x-mx-mount-swappable: true | false
x-mx-mount-upstream: "URL" # for standard type — where to pull upstream updates from
```

These fields use the `x-mx-` vendor extension prefix per the established namespace policy (ADR: vendor-extensions-policy). They are Cog-Nova-MX public extensions — visible in published cogs, not part of The Gathering's open standard.

## Current Mount Table

| Submodule | Mount type | Swappable | Notes |
| --------- | ---------- | --------- | ----- |
| allaboutv2 | personal | yes | Tom's website |
| mx-audit | product | no | Web audit tooling |
| mx-collaboration | team | yes | Project collaboration |
| mx-crm | personal | yes | Tom's CRM — Scott and Helen will have their own |
| mx-outputs | personal | yes | Tom's build artefacts |
| mx-canon | standard | fork | The Gathering standard + MX business cogs |

Non-submodule directories in the hub (datalake, mx-corporate, mx-maxine, mx-reginald, mx-maxine-app, scripts) remain part of the hub template itself.

## Consequences

### For team onboarding

- Scott and Helen understand immediately which repos are "theirs" to create
- Onboarding becomes: "Clone the hub, fork Canon, create your CRM repo, mount it"

### For investors

- The architecture demonstrates scalability — not a single-user tool, but a replicable business template
- Each customer deployment is a hub clone with swapped mounts
- Network effects: product repos are shared, standard repos sync upstream

### For the product

- Maxine understands mount types and can route operations accordingly
- Personal repos get different privacy treatment than product repos
- The mount table becomes part of MX OS boot — Maxine reads `.gitmodules` + `.mx.yaml` to understand the workspace

### For revenue

- Licensing model maps to mount types: product repos are licensed, personal repos are the customer's own
- Reginald (the registry) is a product mount — every business that deploys MX mounts it
- Training and consulting revenue from helping businesses set up their hub

## Revenue Impact

Direct. This architecture is the deployment model for MX as a product. Every customer gets a hub. Every hub mounts Cog-Nova-MX products. Products are licensed. The mount table is the billing surface.
