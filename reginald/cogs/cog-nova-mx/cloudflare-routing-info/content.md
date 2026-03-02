---
name: "cloudflare-routing-info"
title: "MX Cloudflare Routing Plan"
description: "Human- and machine-readable plan for routing MX domains via Cloudflare Workers, aligned with MX's trust-first, non-AI brand architecture."
version: "1.0.0"
created: "2026-02-15"
modified: "2026-02-15"
author: "Tom Cranstoun / Copilot"
license: "Private — Cog-Nova-MX Ltd"
status: "active"
category: "infrastructure"
partOf: ["MX Brand–Domain Master Architecture", "MX Business Operations", "MX Infrastructure"]
purpose: |
    Define a clear, centralised routing strategy for all MX-related domains using
    Cloudflare (DNS + Workers). This cog expresses the redirect logic in a way
    that any human or MX-aware agent can translate into Worker code, Terraform,
    or manual configuration without ambiguity.

tags: [cloudflare, routing, dns, workers, infrastructure]
audience: ["business", "operations"]
refersTo:
    - "MX Brand–Domain Master Architecture Cog"
    - "Domain Portfolio Registry Cog"
    - "MX Branding & Naming Framework Cog"

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
    5. Increment the version number (patch for rule changes, minor for structural changes).
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

## 1. Routing principles

- **Single canonical domain per brand**
  Every brand family has one public “home”; all other domains redirect there.

- **.ai is defensive, not public**
  All `.ai` domains are owned but *never* used as public identities; they always redirect.

- **Cloudflare as single control plane**
  All MX-related domains should move DNS to Cloudflare and be routed via:
  - simple DNS records, and/or
  - a single Worker with a routing table.

- **No parked or ad-monetised pages**
  No domain should serve GoDaddy parking or “for sale” landers.

---

### 2. Canonical domains

| Brand family        | Canonical domain (target)   | Notes                                      |
|---------------------|-----------------------------|--------------------------------------------|
| Cog-Nova-MX     | `mxtechnologies.tech`*      | Future primary corporate domain            |
| MX: The Gathering   | `mx-thegathering.org`       | Primary community and event home           |
| Allabout (DDT)      | `allabout.network`          | Active consultancy site                    |
| MX Commons (future) | `mxcommons.org`*            | Governance and standards community         |

\*Where domains are not yet registered, this cog still defines the intended routing pattern.

---

### 3. Worker routing table (conceptual)

This table describes the logic a Worker should implement.
Any agent can convert this into code (e.g. a `switch` on `hostname`).

#### 3.1 Cog-Nova-MX

| Source host              | Action      | Target URL                          | Rationale                          |
|--------------------------|------------|-------------------------------------|------------------------------------|
| `mxtechnologies.ai`      | Redirect   | `https://mxtechnologies.tech/`      | Defensive `.ai` → canonical        |
| `cog-nova-mx.ai`     | Redirect   | `https://mxtechnologies.tech/`      | Hyphen variant → canonical         |
| `mxtechnologies.co.uk`   | Redirect   | `https://mxtechnologies.tech/`      | UK regional → global canonical     |
| `mxtechnologies.tech`    | Pass-through | Serve origin content               | Primary corporate site             |

#### 3.2 MX: The Gathering

| Source host                 | Action      | Target URL                             | Rationale                          |
|-----------------------------|------------|----------------------------------------|------------------------------------|
| `mx-thegathering.org`       | Pass-through | Serve origin content                  | Canonical community/event site     |
| `mx-thegathering.net`       | Redirect   | `https://mx-thegathering.org/`         | Legacy primary → canonical         |
| `mx-thegathering.com`       | Redirect   | `https://mx-thegathering.org/`         | Expected domain → canonical        |
| `mx-thegathering.ai`        | Redirect   | `https://mx-thegathering.org/`         | Defensive `.ai` → canonical        |
| `mx-thegathering.co.uk`     | Redirect   | `https://mx-thegathering.org/`         | UK regional → canonical            |
| `mx-thegathering.info`      | Redirect   | `https://mx-thegathering.org/`         | Consolidation                      |
| `mx-thegathering.xyz`       | Redirect   | `https://mx-thegathering.org/`         | Consolidation                      |
| `mx-thegathering.store`     | Redirect   | `https://mx-thegathering.org/`         | Future merch → canonical for now   |

#### 3.3 Allabout (DDT)

| Source host           | Action        | Target URL                        | Rationale                          |
|-----------------------|--------------|-----------------------------------|------------------------------------|
| `allabout.network`    | Pass-through | Serve origin content              | Active consultancy site            |
| `allabout.expert`     | Redirect     | `https://allabout.network/`       | Consolidation                      |
| `allabout.mx.uk`      | Redirect*    | `https://allabout.network/`       | Placeholder → canonical            |
| `allabout.ltd`        | Redirect*    | `https://allabout.network/`       | TLS issues → canonical             |

\*Once DNS/TLS is fixed; until then, this is the intended state.

#### 3.4 Credo and other legacy domains

| Source host             | Action      | Target URL                        | Rationale                          |
|-------------------------|------------|-----------------------------------|------------------------------------|
| `credoplus.com`         | Redirect*  | `https://allabout.network/`       | Legacy → current consultancy       |
| `credopublishpro.com`   | Redirect*  | `https://allabout.network/`       | Legacy → current consultancy       |
| `credoqpro.co.uk`       | Redirect*  | `https://allabout.network/`       | Legacy → current consultancy       |
| `allabouteverything.me` | Redirect*  | `https://allabout.network/`       | Misc → current consultancy         |
| `alzamngrp.com`         | Redirect*  | `https://allabout.network/`       | Historic → current consultancy     |

\*If you decide instead to let these lapse, the Worker table should be updated to remove them.

---

### 4. Worker behaviour (prose specification)

Any Cloudflare Worker implementing this plan should:

1. **Inspect the incoming hostname**
   - Use `request.headers.get("Host")` (or equivalent) to determine which domain was called.

2. **Match the hostname against the routing table**
   - If the host is marked **Pass-through**, forward the request to the origin unchanged.
   - If the host is marked **Redirect**, issue an HTTP 301 or 308 redirect to the specified target URL.

3. **Preserve path and query where appropriate**
   - For simple brand redirects (e.g. `mx-thegathering.com` → `.org`), preserve path and query:
     - `/foo?bar=baz` → `/foo?bar=baz` on the target.
   - For legacy or error-prone domains, you may choose to always redirect to `/` on the target.

4. **Use permanent redirects for canonicalisation**
   - Prefer 308 (or 301) for stable, long-term redirects:
     - `.ai` → canonical
     - `.com` / `.net` / `.co.uk` → canonical
     - parked TLDs → canonical

5. **Return a clear default for unknown hosts**
   - If a host is not in the routing table, either:
     - return a 404 with a simple MX-branded message, or
     - redirect to the most appropriate canonical domain (e.g. `mxtechnologies.tech`).

---

### 5. Operational checklist

Before each launch milestone:

- **DNS**
  - Move all MX-related domains to Cloudflare as the authoritative DNS.
  - Ensure A/AAAA/CNAME records for canonical domains point to the correct origins.

- **Worker**
  - Deploy a single Worker with the routing table above.
  - Attach it to all relevant zones via Cloudflare’s route configuration.

- **Verification**
  - Manually test each domain:
    - Confirm canonical domains serve content.
    - Confirm all others redirect as specified.
  - Confirm no GoDaddy parking or “for sale” pages remain.

- **Documentation**
  - Update:
    - Domain Portfolio Registry Cog
    - MX Brand–Domain Master Architecture Cog
    - This Routing Plan Cog (version bump)

---
