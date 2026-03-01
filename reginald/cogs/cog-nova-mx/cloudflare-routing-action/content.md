---
name: "cloudflare-routing-action"
title: "MX Cloudflare Routing Plan"
description: "A complete routing and canonicalisation strategy for all MX-related domains using Cloudflare Workers, aligned with MX's trust-first, non-AI brand architecture."
version: "1.0.0"
created: "2026-02-15"
modified: "2026-02-15"
author: "Tom Cranstoun / Copilot"
license: "Private — Cog-Nova-MX Ltd"
status: "active"
category: "infrastructure"
partOf: ["MX Brand–Domain Master Architecture", "MX Business Operations", "MX Infrastructure", "MX Governance Framework"]
purpose: |
    Provide a unified, authoritative routing plan for all MX domains. This cog
    defines canonical domains, redirect rules, Worker behaviour, and operational
    sequencing. It ensures MX presents a consistent, trust-first identity while
    retaining defensive ownership of .ai domains without using them publicly.

tags: [cloudflare, routing, dns, workers, infrastructure]
audience: ["business", "operations"]
refersTo:
    - "MX Brand–Domain Master Architecture Cog"
    - "Domain Portfolio Registry Cog"
    - "MX Branding & Naming Framework Cog"

mx:
  updateInstructions:
    summary: "Update this routing plan whenever canonical domains or redirect targets change."
    frequency: "Before each major launch or DNS change"
    method: |
      1. Retrieve the latest canonical domains and redirect rules from:
         - MX Brand–Domain Master Architecture Cog
         - Domain Portfolio Registry Cog
      2. Confirm which domains:
         - serve primary content
         - are redirect-only
         - are legacy or to be retired
      3. Update the Routing Tables below to reflect:
         - new domains
         - changed canonical targets
         - retired domains
      4. Ensure that:
         - every owned domain appears in at least one routing table row
         - there is exactly one canonical target per brand
      5. Update Worker behaviour specification if routing logic changes.
      6. Increment version number (patch for rule changes, minor for structural changes).
    toolsRequired:
      - "Cloudflare dashboard or API"
      - "Domain Portfolio Registry Cog"
      - "MX Brand–Domain Master Architecture Cog"

  styleRules:
    - "British English"
    - "Clear, declarative routing rules"
    - "No AI-centric language"
    - "Tables for mappings, prose for rationale"
---

# **1. Routing Principles**

## **1. Single canonical domain per brand**

Every brand family has one public “home”; all other domains redirect there.

## **2. .ai domains are defensive only**

They are owned but never used publicly.

## **3. Cloudflare is the single control plane**

All MX domains should move DNS to Cloudflare.

## **4. No GoDaddy parking or for-sale pages**

All domains must resolve cleanly or redirect.

---

# **2. Canonical Domains**

| Brand Family        | Canonical Domain (Target)   | Notes |
|---------------------|-----------------------------|-------|
| **Cog-Nova-MX** | `mxtechnologies.tech`*      | Future corporate home, neutral and trust-first |
| **MX: The Gathering** | `mx-thegathering.org`     | Community, governance, event identity |
| **Allabout (DDT)** | `allabout.network`          | Active consultancy site |
| **MX Commons (future)** | `mxcommons.org`*        | Governance and standards |

\*Intended canonical domain if not yet registered.

---

# **3. Routing Tables (Worker Logic)**

These tables define the exact behaviour a Worker should implement.

---

## **3.1 Cog-Nova-MX**

| Source Host              | Action        | Target URL                          | Rationale |
|--------------------------|--------------|-------------------------------------|-----------|
| `mxtechnologies.ai`      | Redirect     | `https://mxtechnologies.tech/`      | Defensive `.ai` → canonical |
| `cog-nova-mx.ai`     | Redirect     | `https://mxtechnologies.tech/`      | Hyphen variant → canonical |
| `mxtechnologies.co.uk`   | Redirect     | `https://mxtechnologies.tech/`      | UK → global |
| `mxtechnologies.tech`    | Pass-through | Serve origin content                | Primary corporate site |

---

## **3.2 MX: The Gathering**

| Source Host                 | Action        | Target URL                             | Rationale |
|-----------------------------|--------------|----------------------------------------|-----------|
| `mx-thegathering.org`       | Pass-through | Serve origin content                   | Canonical |
| `mx-thegathering.net`       | Redirect     | `https://mx-thegathering.org/`         | Legacy → canonical |
| `mx-thegathering.com`       | Redirect     | `https://mx-thegathering.org/`         | Expected domain |
| `mx-thegathering.ai`        | Redirect     | `https://mx-thegathering.org/`         | Defensive `.ai` |
| `mx-thegathering.co.uk`     | Redirect     | `https://mx-thegathering.org/`         | UK → global |
| `mx-thegathering.info`      | Redirect     | `https://mx-thegathering.org/`         | Consolidation |
| `mx-thegathering.xyz`       | Redirect     | `https://mx-thegathering.org/`         | Consolidation |
| `mx-thegathering.store`     | Redirect     | `https://mx-thegathering.org/`         | Future merch, canonical for now |

---

## **3.3 Allabout (DDT)**

| Source Host           | Action        | Target URL                        | Rationale |
|-----------------------|--------------|-----------------------------------|-----------|
| `allabout.network`    | Pass-through | Serve origin content              | Active site |
| `allabout.expert`     | Redirect     | `https://allabout.network/`       | Consolidation |
| `allabout.mx.uk`      | Redirect*    | `https://allabout.network/`       | Placeholder → canonical |
| `allabout.ltd`        | Redirect*    | `https://allabout.network/`       | TLS issues → canonical |

\*Once DNS/TLS is fixed.

---

## **3.4 Credo & Miscellaneous**

| Source Host             | Action      | Target URL                        | Rationale |
|-------------------------|------------|-----------------------------------|-----------|
| `credoplus.com`         | Redirect*  | `https://allabout.network/`       | Legacy → consultancy |
| `credopublishpro.com`   | Redirect*  | `https://allabout.network/`       | Legacy → consultancy |
| `credoqpro.co.uk`       | Redirect*  | `https://allabout.network/`       | Legacy → consultancy |
| `allabouteverything.me` | Redirect*  | `https://allabout.network/`       | Misc → consultancy |
| `alzamngrp.com`         | Redirect*  | `https://allabout.network/`       | Historic → consultancy |

\*If you choose not to retire them.

---

# **4. Worker Behaviour Specification (Prose)**

A Cloudflare Worker implementing this plan should:

## **1. Inspect the incoming hostname**

Use the `Host` header to determine which domain was called.

## **2. Match the hostname against the routing table**

- If **Pass-through**, forward to origin.
- If **Redirect**, issue a permanent redirect (308 preferred).

## **3. Preserve path and query**

For brand redirects:

- `/foo?bar=baz` → `/foo?bar=baz` on the canonical domain.

For legacy domains:

- Redirect to `/` unless otherwise specified.

## **4. Default behaviour**

If a hostname is not recognised:

- Return a simple MX-branded 404, or
- Redirect to `https://mxtechnologies.tech/`.

---

# **5. Operational Checklist**

Before each launch milestone:

## **DNS**

- Move all MX domains to Cloudflare.
- Remove GoDaddy parking and for-sale landers.

## **Worker**

- Deploy a single Worker with the routing table above.
- Attach it to all zones.

## **Verification**

- Test each domain manually.
- Confirm canonical domains serve content.
- Confirm all others redirect correctly.

## **Documentation**

- Update:
  - Domain Portfolio Registry Cog
  - MX Brand–Domain Master Architecture Cog
  - This Routing Plan Cog

---

# **6. Closing Summary**

This cog gives MX a **single, authoritative routing architecture** that:

- protects all `.ai` domains without using them publicly
- moves The Gathering to `.org`
- prepares Cog-Nova-MX for `.tech` or `.systems`
- eliminates all parking pages
- centralises DNS under Cloudflare
- ensures long-term clarity and trust

It’s the backbone of your domain governance going forward.

---
