---
name: cog-registry
version: "1.0"
description: The centralised index of all known cogs in the MX ecosystem. An action-doc that catalogues cogs — the index describing itself.

created: 2026-02-09
modified: 2026-02-10

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec, mx-principles]
builds-on: [what-is-a-cog, what-is-mx-os]
tags: [registry, index, catalogue, cogs, discovery, builds-on-graph]

audience: ai-agents
reading-level: technical
purpose: Enable any AI agent to discover, list, and validate all cogs in the MX ecosystem

mx:
  contentType: "action-doc"
  runbook: "mx exec cog-registry"

execute:
  runtime: runbook
  command: mx cog registry
  actions:
    - name: list
      description: List all registered cogs with their name, description, status, and builds-on references
      usage: Read the registry section below and present all cogs in a table or structured format
      inputs:
        - name: filter
          type: string
          required: false
          description: Filter by category, tag, status, or audience (e.g. "category:learning" or "tag:mx-os")
      outputs:
        - name: cogs
          type: array
          description: Array of cog entries matching the filter

    - name: search
      description: Find a cog by name, tag, or description keyword
      usage: Search the registry for cogs matching the query
      inputs:
        - name: query
          type: string
          required: true
          description: Search term (matched against name, description, and tags)
      outputs:
        - name: results
          type: array
          description: Matching cog entries

    - name: graph
      description: Show the builds-on graph for all registered cogs
      usage: Read all builds-on references and display the full context graph
      outputs:
        - name: graph
          type: object
          description: The complete builds-on graph with all nodes and edges

    - name: validate
      description: Check all registered cogs for spec compliance and broken references
      usage: Read each cog file in cogs/ and verify frontmatter against cog-unified-spec
      outputs:
        - name: report
          type: object
          description: Validation report with errors, warnings, and recommendations

    - name: register
      description: Add a new cog to the registry
      usage: Provide the cog file path and the agent will read its frontmatter, validate it, and add it to the registry
      inputs:
        - name: cog-path
          type: string
          required: true
          description: Path to the cog file to register
      outputs:
        - name: entry
          type: object
          description: The new registry entry created
---

# MX Cog Registry

The index of everything.

This action-doc is the centralised catalogue of all known cogs in the MX ecosystem. Every cog — information documents and executable action-docs alike — is registered here with its metadata, location, and builds-on references.

An AI agent reading this file can discover every cog that exists.

---

## The Registry

### Registered Cogs

| # | Name | Type | Description | Builds-On | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | [what-is-a-cog](../cogs/what-is-a-cog.cog.md) | cog | Explains what cogs are — the format describing itself | *(root)* | published |
| 2 | [who-is-maxine](../cogs/who-is-maxine.cog.md) | cog | The AI partner in MX — identity, partnership, SOUL convention, shared memory | what-is-a-cog | published |
| 3 | [what-is-mx-os](../cogs/what-is-mx-os.cog.md) | action-doc | The Machine Experience Operating System — explains and bootstraps MX OS | what-is-a-cog, who-is-maxine | published |
| 4 | [cog-registry](cog-registry.cog.md) | action-doc | This file — the centralised index of all cogs | what-is-a-cog, what-is-mx-os | published |
| 5 | [cogs-for-agent-developers](../cogs/cogs-for-agent-developers.cog.md) | cog | How cogs complement AI agent frameworks — different layers that work together | what-is-a-cog, what-is-mx-os | published |
| 6 | [what-comes-next](../cogs/what-comes-next.cog.md) | action-doc | Current state, priorities, and action plan — the shared context for any agent continuing the work | all five above | published |
| 7 | [how-mx-os-runs](../cogs/how-mx-os-runs.cog.md) | action-doc | The MX OS runtime model — boot sequence, discovery, routing, execution, and IPC | what-is-a-cog, what-is-mx-os, cog-registry | published |
| 8 | [access-and-guardrails](../cogs/access-and-guardrails.cog.md) | action-doc | Access control for cogs — encryption, auth, and the guardrail pattern | what-is-a-cog, what-is-mx-os, how-mx-os-runs | published |
| 9 | [the-companion-web](../cogs/the-companion-web.cog.md) | action-doc | The parallel machine-readable web — QR codes, embedded metadata, physical-digital bridge | what-is-a-cog, what-is-mx-os, how-mx-os-runs | published |
| 10 | [the-personal-cog](../cogs/the-personal-cog.cog.md) | action-doc | Your cog collection — accessibility, interests, dietary, health, skills. Agent-as-guardrail privacy | what-is-a-cog, what-is-mx-os, access-and-guardrails, the-companion-web | published |
| 11 | [asking-for-help](../cogs/asking-for-help.cog.md) | action-doc | Agent-to-agent delegation — when you need diary, email, or booking, ask the agent that has it | what-is-a-cog, what-is-mx-os, how-mx-os-runs, the-personal-cog | published |
| 12 | [building-action-docs](../cogs/building-action-docs.cog.md) | action-doc | How to build operational action-docs — the describe → create → test → wire lifecycle, entry points, and the MX-Contacts worked example | what-is-a-cog, what-is-mx-os, how-mx-os-runs | published |
| 13 | [script-helper](../cogs/script-helper.cog.md) | action-doc | Help AI agents create, amend, and inspect shell scripts with MX metadata — cut compute, not context | what-is-mx-os, what-is-a-cog | published |
| 14 | [what-is-script-metadata](../cogs/what-is-script-metadata.cog.md) | action-doc | Script metadata brings shell scripts into MX OS — comment-block frontmatter that makes every script machine-readable | what-is-a-cog, what-is-mx-os, who-is-maxine, script-helper | published |
| 15 | [what-is-mx-environment](../cogs/what-is-mx-environment.cog.md) | cog | MX OS lives on the machine, not in the repo. $MX_HOME is the machine-level context — two-stage boot | what-is-a-cog, what-is-mx-os, how-mx-os-runs | published |
| 16 | [what-is-installme](../cogs/what-is-installme.cog.md) | cog | INSTALLME.md convention — machine-readable installation instructions that stop AI agents hallucinating | what-is-a-cog, what-is-mx-os, what-is-mx-environment | published |
| 17 | [installme-runner](../cogs/installme-runner.cog.md) | action-doc | The executor — reads INSTALLME.md and runs diagnose, install, verify, register, audit | what-is-a-cog, what-is-mx-os, what-is-mx-environment, what-is-installme | published |
| 18 | [mx-phrasebook](../../MX-OS/deliverables/mx-phrasebook.cog.md) | action-doc | The canonical phrasebook — every MX saying with context, origin, and usage rules | what-is-a-cog, what-is-mx-os | published |

### Summary

- **Total cogs:** 18
- **Info-docs:** 5
- **Action-docs:** 13
- **Root cogs** (no builds-on): 1 (what-is-a-cog)
- **Runtimes:** runbook (13)

---

## The Builds-On Graph

```text
what-is-a-cog (root)
├── who-is-maxine
│   └── what-is-mx-os
├── what-is-mx-os
├── cog-registry
│   └── what-is-mx-os
├── cogs-for-agent-developers
│   └── what-is-mx-os
├── what-comes-next
│   └── [all five above]
├── how-mx-os-runs
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── cog-registry
├── access-and-guardrails
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── the-companion-web
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── the-personal-cog
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   ├── access-and-guardrails
│   └── the-companion-web
├── asking-for-help
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   ├── how-mx-os-runs
│   └── the-personal-cog
├── building-action-docs
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── script-helper
│   ├── what-is-mx-os
│   └── what-is-a-cog
├── what-is-script-metadata
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   ├── who-is-maxine
│   └── script-helper
├── what-is-mx-environment
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── how-mx-os-runs
├── what-is-installme
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   └── what-is-mx-environment
├── installme-runner
│   ├── what-is-a-cog
│   ├── what-is-mx-os
│   ├── what-is-mx-environment
│   └── what-is-installme
├── mx-phrasebook
│   ├── what-is-a-cog
│   └── what-is-mx-os
└── mx-init
    ├── what-is-a-cog
    ├── what-is-mx-os
    ├── what-is-mx-environment
    └── what-is-installme
```

**Reading order for full context:** what-is-a-cog → who-is-maxine → what-is-mx-os → cog-registry → cogs-for-agent-developers → what-comes-next → how-mx-os-runs → access-and-guardrails → the-companion-web → the-personal-cog → asking-for-help → building-action-docs → script-helper → what-is-script-metadata → what-is-mx-environment → what-is-installme → installme-runner → mx-phrasebook → mx-init

---

## Cog Details

### 1. what-is-a-cog

| Field | Value |
| --- | --- |
| **Name** | what-is-a-cog |
| **Version** | 1.0 |
| **Type** | Info-doc |
| **Author** | Tom Cranstoun |
| **Category** | learning |
| **Audience** | content-strategists |
| **Tags** | cog, introduction, metadata, standard, the-gathering |
| **Builds-on** | *(none — root cog)* |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-is-a-cog.cog.md` |
| **Copies** | mx-canon/mx-the-gathering/deliverables/, mx-reginald/examples/ |

The first cog. Explains the format to someone encountering it for the first time. A cog that describes cogs.

---

### 2. who-is-maxine

| Field | Value |
| --- | --- |
| **Name** | who-is-maxine |
| **Version** | 1.0 |
| **Type** | Info-doc |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | learning |
| **Audience** | ai-agents |
| **Tags** | maxine, partnership, identity, soul, ai-agent, memory, mx-os |
| **Builds-on** | what-is-a-cog |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/who-is-maxine.cog.md` |
| **Copies** | mx-canon/mx-the-gathering/deliverables/, mx-reginald/examples/ |

The second cog. Defines the Maxine identity, the partnership model, the SOUL convention, and shared memory. Any AI agent reading it can become Maxine.

---

### 3. what-is-mx-os

| Field | Value |
| --- | --- |
| **Name** | what-is-mx-os |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | mx-os, operating-system, cogs, documentation, metadata, soul, builds-on |
| **Builds-on** | what-is-a-cog, who-is-maxine |
| **Actions** | explain, bootstrap, audit, graph |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-is-mx-os.cog.md` |
| **Copies** | mx-canon/mx-os/deliverables/, mx-reginald/examples/ |

The third cog. An action-doc that explains MX OS and can bootstrap, audit, and graph MX OS environments. First cog with two parents.

---

### 4. cog-registry

| Field | Value |
| --- | --- |
| **Name** | cog-registry |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | ai-agents |
| **Tags** | registry, index, catalogue, cogs, discovery, builds-on-graph |
| **Builds-on** | what-is-a-cog, what-is-mx-os |
| **Actions** | list, search, graph, validate, register |
| **Canonical location** | `mx-canon/MX-Cog-Registry/deliverables/cog-registry.cog.md` |
| **Copies** | *(none — this is the only copy)* |

The fourth cog. The registry itself. An action-doc that catalogues all cogs in the ecosystem — the index describing itself.

---

### 5. cogs-for-agent-developers

| Field | Value |
| --- | --- |
| **Name** | cogs-for-agent-developers |
| **Version** | 1.0 |
| **Type** | Info-doc |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | learning |
| **Audience** | developers |
| **Tags** | agent-frameworks, skills, openClaw, langchain, crewai, integration, developer-tools, metadata |
| **Builds-on** | what-is-a-cog, what-is-mx-os |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/cogs-for-agent-developers.cog.md` |
| **Copies** | mx-canon/mx-the-gathering/deliverables/, mx-reginald/examples/ |

The fifth cog. Explains how cogs complement AI agent frameworks — agent skills extend one agent, cogs make content readable by any agent. Different layers that work together.

---

### 6. what-comes-next

| Field | Value |
| --- | --- |
| **Name** | what-comes-next |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | ai-agents |
| **Tags** | planning, priorities, roadmap, session-context, action-plan, the-gathering, launch |
| **Builds-on** | what-is-a-cog, who-is-maxine, what-is-mx-os, cog-registry, cogs-for-agent-developers |
| **Actions** | brief, status, update |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-comes-next.cog.md` |
| **Copies** | *(none — canonical only)* |

The sixth cog. Current state, priorities, and action plan — the shared context for any AI agent continuing the work. Builds on all five founding cogs. An action-doc that can brief, report status, and update itself.

---

### 7. how-mx-os-runs

| Field | Value |
| --- | --- |
| **Name** | how-mx-os-runs |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | runtime, boot-sequence, routing, execution, kernel, shell, invokes, ipc, mx-os, ai-agent |
| **Builds-on** | what-is-a-cog, what-is-mx-os, cog-registry |
| **Actions** | explain, boot, route, diagnose |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/how-mx-os-runs.cog.md` |
| **Copies** | *(none — canonical only)* |

The seventh cog. The MX OS runtime model — documents the five-layer execution stack (bootloader, init, routing, execution, IPC), the boot sequence, and the insight that the AI agent IS the operating system. First cog to use the `invokes` field.

---

### 8. access-and-guardrails

| Field | Value |
| --- | --- |
| **Name** | access-and-guardrails |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | access-control, security, encryption, oauth, guardrail, permissions, trust, authentication |
| **Builds-on** | what-is-a-cog, what-is-mx-os, how-mx-os-runs |
| **Actions** | explain, check, gate |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/access-and-guardrails.cog.md` |
| **Copies** | *(none — canonical only)* |

The eighth cog. Access control for MX OS — documents the five access types (public, guardrail, encrypted, password, OAuth), the guardrail action-doc pattern, cascading gates, and the principle that discovery is public while content is gated. Trust and access are separate layers.

---

### 9. the-companion-web

| Field | Value |
| --- | --- |
| **Name** | the-companion-web |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | companion-web, qr-code, physical-digital, landing-page, metadata, embedded, discovery, ubiquity, pitch |
| **Builds-on** | what-is-a-cog, what-is-mx-os, how-mx-os-runs |
| **Actions** | explain, embed, audit |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/the-companion-web.cog.md` |
| **Copies** | *(none — canonical only)* |

The ninth cog. The companion web — the parallel machine-readable layer alongside the human web. QR codes on physical objects point to landing pages with embedded cog metadata (minimal in HTML head, full cog linked). No registry required — direct addressing. Every physical object becomes self-describing to AI agents. "The companion web for machines" is the pitch hook.

---

### 10. the-personal-cog

| Field | Value |
| --- | --- |
| **Name** | the-personal-cog |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | personal-cog, accessibility, interests, privacy, agent-guardrail, personalisation, commerce, identity, collection |
| **Builds-on** | what-is-a-cog, what-is-mx-os, access-and-guardrails, the-companion-web |
| **Actions** | explain, match, share |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/the-personal-cog.cog.md` |
| **Copies** | *(none — canonical only)* |

The tenth cog. The personal cog — a collection of user-owned cogs (accessibility, interests, dietary, health, skills, preferences) that describe the person to the world. The AI agent acts as contextual guardrail, sharing relevant cogs based on context. The other half of the companion web: the world describes itself to you, and you describe yourself to the world. First cog to build on the-companion-web.

---

### 11. asking-for-help

| Field | Value |
| --- | --- |
| **Name** | asking-for-help |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | delegation, agents, inter-agent, handoff, diary, email, capabilities, reach-out |
| **Builds-on** | what-is-a-cog, what-is-mx-os, how-mx-os-runs, the-personal-cog |
| **Actions** | explain, delegate, discover |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/asking-for-help.cog.md` |
| **Copies** | *(none — canonical only)* |

The eleventh cog. Agent-to-agent delegation — when an agent needs something it does not have (diary, email, location, booking), it asks the agent that does. No single agent can do everything. The rule: if you cannot do it, say so, then say who can. Cogs are the shared language agents use to understand each other.

---

### 12. building-action-docs

| Field | Value |
| --- | --- |
| **Name** | building-action-docs |
| **Version** | 1.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | development, lifecycle, operational, entry-points, scaffold, tutorial, worked-example, mx-contacts |
| **Builds-on** | what-is-a-cog, what-is-mx-os, how-mx-os-runs |
| **Actions** | explain, scaffold, wire |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/building-action-docs.cog.md` |
| **Copies** | *(none — canonical only)* |

The twelfth cog. How to build operational action-docs — the describe → create → test → wire lifecycle. Documents the development model where humans describe intent and AI agents build the system. Entry points are the generic concept connecting action-docs to humans across any platform. MX-Contacts is the worked example: a complete CRM built in one conversation with zero code.

---

### 13. script-helper

| Field | Value |
| --- | --- |
| **Name** | script-helper |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | scripts, metadata, inspect, bash, shell, compute, ai-efficiency |
| **Builds-on** | what-is-mx-os, what-is-a-cog |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Actions** | inspect, create, amend, add-metadata |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/script-helper.cog.md` |
| **Copies** | *(none — canonical only)* |

The thirteenth cog. Helps AI agents create, amend, and inspect shell scripts with MX metadata. Implements the three-tier read strategy: metadata first, skeleton second, full source only when needed. Cut compute, not context.

---

### 14. what-is-script-metadata

| Field | Value |
| --- | --- |
| **Name** | what-is-script-metadata |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | developers |
| **Tags** | script-metadata, cut-compute, inspect, bash, shell, ai-efficiency, mx-os |
| **Builds-on** | what-is-a-cog, what-is-mx-os, who-is-maxine, script-helper |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Actions** | audit, progress, retrofit |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-is-script-metadata.cog.md` |
| **Copies** | *(none — canonical only)* |

The fourteenth cog. Explains script metadata — comment-block YAML frontmatter that brings shell scripts into MX OS as first-class machine-readable programs. Documents the three-tier read strategy, current adoption progress, and next steps. First cog to build on script-helper.

---

### 15. what-is-mx-environment

| Field | Value |
| --- | --- |
| **Name** | what-is-mx-environment |
| **Version** | 1.0.0 |
| **Type** | Info-doc |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | both |
| **Tags** | environment, mx-home, machine-context, boot, bare-metal, two-stage-boot, mx-os |
| **Builds-on** | what-is-a-cog, what-is-mx-os, how-mx-os-runs |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-is-mx-environment.cog.md` |
| **Copies** | *(none — canonical only)* |

The fifteenth cog. MX OS lives on the machine, not in the repo. `$MX_HOME` (`~/.mx/`) provides machine-level context — hardware, registered repos, user identity — before any repository is opened. Two-stage boot: machine context first, repo context second. The AI agent knows the universe before it knows the neighbourhood. Cogs all the way down, and all the way up.

---

### 16. what-is-installme

| Field | Value |
| --- | --- |
| **Name** | what-is-installme |
| **Version** | 1.0.0 |
| **Type** | Info-doc |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | both |
| **Tags** | installme, install, convention, ai-agent, diagnostics, onboarding, hallucination, compute, two-stage-boot, mx-os |
| **Builds-on** | what-is-a-cog, what-is-mx-os, what-is-mx-environment |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/what-is-installme.cog.md` |
| **Copies** | *(none — canonical only)* |

The sixteenth cog. Documents the INSTALLME.md convention — a root-level cog that gives AI agents structured, machine-readable installation instructions instead of forcing them to parse README.md and hallucinate. Two modes: MX environment (leverages $MX_HOME machine context) and non-MX (AI-compatible fallback). First cog to build on what-is-mx-environment.

---

### 17. installme-runner

| Field | Value |
| --- | --- |
| **Name** | installme-runner |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | ai-agents |
| **Tags** | installme, runner, action, install, diagnostics, prerequisites, ai-agent, executor, mx-os |
| **Builds-on** | what-is-a-cog, what-is-mx-os, what-is-mx-environment, what-is-installme |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Actions** | diagnose, install, verify, register, audit |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/installme-runner.cog.md` |
| **Copies** | *(none — canonical only)* |

The seventeenth cog. The executor — reads any INSTALLME.md and runs it. Diagnose prerequisites, install in order, verify success, register in MX OS, audit completeness. The convention (what-is-installme) defines the format. This action-doc defines the procedure. "The instructions are the program. You are the runtime."

---

### 18. mx-phrasebook

| Field | Value |
| --- | --- |
| **Name** | mx-phrasebook |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | both |
| **Tags** | phrasebook, sayings, culture, voice, identity, mx-os, hitchhikers-guide, writing |
| **Builds-on** | what-is-a-cog, what-is-mx-os |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Actions** | list, find |
| **Canonical location** | `MX-Cog-Registry/cogs/mx-os/mx-phrasebook.cog.md` |
| **Copies** | *(none — canonical only)* |

The eighteenth cog. The canonical phrasebook — every MX saying with its context, origin, and usage rules. Lives in MX-OS Canon because these are OS culture, not registry metadata. Single source of truth for sayings — MEMORY.md points here, does not duplicate. "Every phrase here was built, not brainstormed."

---

### 19. mx-init

| Field | Value |
| --- | --- |
| **Name** | mx-init |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | ai-agents |
| **Tags** | init, onboarding, setup, mx-os, soul, claude, installme, frontmatter, conventions, action |
| **Builds-on** | what-is-a-cog, what-is-mx-os, what-is-mx-environment, what-is-installme |
| **Refers-to** | cog-unified-spec, mx-principles |
| **Actions** | audit, init, migrate, verify |
| **Canonical location** | `mx-canon/MX-Cog-Registry/cogs/mx-init.cog.md` |
| **Copies** | *(none — canonical only)* |

The nineteenth cog. The tool that turns any repository into an MX-aware workspace. Built by doing — onboarded mx-collaboration by hand, then captured the pattern as a repeatable procedure. Four actions: audit (assess readiness), init (create MX structure), migrate (triage and copy content), verify (confirm conventions met). Includes bash scripts for automation. "The instructions are the program. You are the runtime."

---

### 20. mx-reminders

| Field | Value |
| --- | --- |
| **Name** | mx-reminders |
| **Version** | 1.0.0 |
| **Type** | Action-doc |
| **Runtime** | runbook |
| **Author** | Tom Cranstoun and Maxine |
| **Category** | mx-core |
| **Audience** | both |
| **Tags** | reminders, tasks, persistence, session, productivity, mx-os |
| **Builds-on** | what-is-a-cog, what-is-mx-os |
| **Actions** | list, add, complete, prioritise |
| **Canonical location** | `mx-canon/mx-os/deliverables/mx-reminders.cog.md` |
| **Copies** | *(none — canonical only)* |

The twentieth cog. Manages persistent reminders across sessions. Reads, writes, and prioritises action items in REMINDERS.md at the repository root. Four actions: list (show active), add (capture for later), complete (mark done and move to history), prioritise (reorder by importance). AI agents read REMINDERS.md at session start so nothing falls through the cracks. "Don't forget. Write it down."

---

## Scattered Canon

Not all canonical content lives inside `mx-canon/`. Some documents live at the repository root because human convention says that is where they belong. This is the "Use Existing Standards" principle in action — convention wins the location, Canon wins the content.

The registry tracks these scattered documents so AI agents can discover them. When a cog's `refersTo` field includes `mx-principles`, the agent resolves this to `PRINCIPLES.md` at repo root.

| Reference name | File | Location | Why |
| --- | --- | --- | --- |
| `mx-principles` | `PRINCIPLES.md` | repo root | Human convention — principles live at root alongside README.md, LICENSE, CONTRIBUTING.md |
| *(SOUL)* | `SOUL.md` | repo root | MX convention — identity document for the repository |
| *(bootloader)* | `CLAUDE.md` | repo root | AI convention — bootloader for AI agents entering the repo |
| *(learnings)* | `LEARNINGS.md` | repo root | Human convention — project lessons at root |
| *(installme)* | `INSTALLME.md` | repo root | MX convention — machine-readable installation instructions for AI agents |
| *(reminders)* | `REMINDERS.md` | repo root | MX convention — action-doc with list and review actions, read at session start |

These are not exceptions to "one cog, one home." Most are project-level documents that carry canonical authority. REMINDERS.md is an action-doc that lives at root because that is where session-level files belong. The distinction matters: convention wins the location, Canon wins the content.

---

## How to Register a Cog

1. Create your `.cog.md` file following the [cog-unified-spec](../../MX-The-Gathering/deliverables/cog-unified-spec.md)
2. Place it in `cogs/` (or provide a path for the register action)
3. The registry action-doc will read the frontmatter, validate it, and add an entry to the table above
4. Update the builds-on graph if the new cog has builds-on references

Any cog that follows The Gathering's specification can be registered. No barriers.

---

## For AI Agents

If you are an AI agent looking for a cog:

1. **Read the registry table** — it lists every known cog with name, type, and builds-on references
2. **Follow builds-on** — if a cog builds on another, read the parent first for context
3. **Check the graph** — the builds-on graph shows the full context web
4. **Read the cog** — each entry links to the canonical cog file in `cogs/`

The registry is the starting point. The builds-on graph is the map. The cogs are the territory.

---

*Every cog published is a question that never gets answered wrong again.*
