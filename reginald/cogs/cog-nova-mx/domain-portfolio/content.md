---
title: "Domain Portfolio Registry"
description: "Catalogue of domains held under GoDaddy, grouped by brand and purpose, with live status, protection level, and intended use."
version: "1.0.0"
created: 2026-02-15
modified: 2026-02-15
author: Tom Cranstoun

mx:
  name: domain-portfolio
  license: proprietary
  status: active
  category: business
  partOf: mx-maxine-lives
  tags: [domains, dns, brand, godaddy, infrastructure, launch-readiness]
  audience: both
  purpose: "Single reference for all owned domains. Supports DNS planning, brand protection, and Cog-Nova-MX launch readiness."
  refersTo:
    - "Cog-Nova-MX Ltd company formation"
    - "MX: The Handbook launch plan (2 April 2026)"
    - "MX: The Gathering event planning"
    - "CMS Summit Frankfurt (12 May 2026)"

  updateInstructions:
    summary: "This cog can be refreshed by any AI agent or human with HTTP access to the listed domains and access to the GoDaddy account screenshot."
    frequency: "Monthly, or before any launch milestone"
    method: |
      To update this cog:
      1. For each domain in the inventory tables below, perform an HTTPS GET
         to the root URL. If HTTPS fails, try HTTP.
      2. Check the HTTP status code and final URL after redirects.
      3. If the response is 115 bytes and contains a redirect to `/lander`,
         the domain is parked (GoDaddy parking lander with AdSense).
      4. If the `/lander` page is ~553 bytes and loads `parking-lander/static/js/main`,
         classify as "Parked (lander)".
      5. If the `/lander` page is ~169KB and contains "Forsale Lander",
         classify as "Parked (for sale)".
      6. If the response contains a full HTML page (>1KB) with a real `<title>`,
         classify as "Active site" and note the title.
        7. If the response is a GoDaddy Website Builder page with "Launching Soon",
           classify as "Launching Soon page".
        8. If the response is minimal (e.g. "It works!"), classify as
           "Server placeholder".
        9. If the connection fails entirely, classify as "Connection error",
           "TLS error", or "DNS error" as appropriate.
        10. Update the "Live Status", "Last Checked" date, and "Notes" columns.
        11. Recalculate the Summary table counts.
        12. Increment the cog version (patch for data refresh, minor for
            structural changes, major for schema changes).
      toolsRequired:
        - "HTTP client (curl, fetch, or equivalent)"
        - "DNS resolver (for NXDOMAIN checks)"
      styleRules:
        - "British English throughout"
        - "Factual, professional language — no exaggerated adjectives"
        - "Tables for structured data, prose for analysis"
      source: "GoDaddy account (screenshot or live), plus HTTP checks against each domain"
      contentSource: "Live HTTP responses from each domain"

    action:
      type: "audit"
      trigger: "manual or scheduled"
      inputs:
        - "List of domains from inventory tables"
      outputs:
        - "Updated Live Status per domain"
        - "Updated Last Checked date"
        - "Updated Summary counts"
        - "New observations if status has changed since last check"
      successCriteria:
        - "Every domain in the inventory has been checked"
        - "Every Live Status reflects the actual HTTP response"
        - "Last Checked date matches the audit date"
        - "Summary table counts match the individual domain statuses"
---

# Domain Portfolio Registry

This document records the domains currently held in the GoDaddy account associated with Digital Domain Technologies Ltd and the forthcoming Cog-Nova-MX Ltd. The portfolio serves three purposes: operating websites, protecting brand identity, and reserving names for future use.

Each domain was checked via HTTP/HTTPS on 15 February 2026 to determine whether it serves active content, a placeholder page, or is parked.

## Status Definitions

- **Active site** — serves a working website with real content
- **Launching Soon page** — GoDaddy Website Builder placeholder showing "Launching Soon" with a contact form
- **Parked (lander)** — redirects to a GoDaddy parking/lander page with Google AdSense
- **Parked (for sale)** — GoDaddy "Forsale Lander" page
- **Server placeholder** — returns a minimal server response (e.g. "It works!") with no site content
- **DNS error** — domain does not resolve
- **TLS/Connection error** — domain resolves but the server connection fails

## Domain Inventory

### Cog-Nova-MX Domains

These domains support the Cog-Nova-MX Ltd brand launching 12 May 2026 at CMS Summit Frankfurt.

| Domain | Live Status | Platform | Protection | Last Checked | Notes |
|---|---|---|---|---|---|
| mxtechnologies.ai | Launching Soon page | GoDaddy Website Builder | Upgrade Protection | 2026-02-15 | Shows "Launching Soon" with contact form; copyright footer reads "© 2026 mxtechnologies.ai" |
| cog-nova-mx.ai | Parked (lander) | GoDaddy Parking | Upgrade Protection | 2026-02-15 | Redirects to `/lander` with Google AdSense scripts |
| mxtechnologies.co.uk | Parked (lander) | GoDaddy Parking | Upgrade Protection | 2026-02-15 | Redirects to `/lander`; UK company domain |

The hyphenated variant (`cog-nova-mx.ai`) and the `.co.uk` are both parked rather than pointing to the Launching Soon page on `mxtechnologies.ai`. Before May, all three should resolve to the same destination. The GoDaddy Website Builder "Launching Soon" page on `mxtechnologies.ai` is the only one with any content, though it is a default template.

### MX: The Gathering Domains

This is the largest group in the portfolio, reflecting the importance of protecting the name across multiple TLDs.

| Domain | Live Status | Platform | Protection | Last Checked | Notes |
|---|---|---|---|---|---|
| mx-thegathering.net | Active site | Custom (likely static/CMS) | Change Protection | 2026-02-15 | Full website, ~90KB of content, title: "MX - The Gathering" |
| mx-thegathering.com | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |
| mx-thegathering.ai | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |
| mx-thegathering.co.uk | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |
| mx-thegathering.info | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |
| mx-thegathering.xyz | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |
| mx-thegathering.store | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | Redirects to `/lander` |

Only the `.net` domain has a live site. The remaining six all redirect to GoDaddy's parking lander with AdSense. At minimum the `.com` and `.ai` variants should redirect to the `.net` site before the May launch. The speculative TLDs (`.xyz`, `.store`, `.info`) are brand protection only and could remain parked or be reviewed at renewal.

### Credo Domains

| Domain | Live Status | Platform | Protection | Last Checked | Notes |
|---|---|---|---|---|---|
| credoplus.com | Parked (for sale) | GoDaddy Forsale Lander | Upgrade Protection | 2026-02-15 | Shows GoDaddy "Forsale Lander" page (~169KB); appears listed for sale |
| credopublishpro.com | Connection refused | None | Upgrade Protection | 2026-02-15 | HTTPS fails; HTTP returns 403 |
| credoqpro.co.uk | Connection refused | None | Upgrade Protection | 2026-02-15 | HTTPS fails; HTTP returns 403 |

The `credoplus.com` domain is listed for sale through GoDaddy's Forsale Lander. The other two Credo domains have no working DNS or web server. If these projects are no longer active, all three could be allowed to lapse at renewal.

### Allabout Domains

| Domain | Live Status | Platform | Protection | Last Checked | Notes |
|---|---|---|---|---|---|
| allabout.network | Active site | Custom | Change Protection | 2026-02-15 | Full website, ~20KB; title: "About DDT &#124; Services &#124; Digital transformation" |
| allabout.mx.uk | Server placeholder | Unknown | Change Protection | 2026-02-15 | Returns "It works!" (72 bytes) — default web server page |
| allabout.ltd | TLS/Connection error | None | Change Protection | 2026-02-15 | TLS version mismatch; connection fails on both HTTP and HTTPS |
| allabout.expert | Parked (lander) | GoDaddy Parking | Change Protection | 2026-02-15 | HTTPS returns 503; HTTP redirects to `/lander` |

The `allabout.network` domain is the only active site in this group, serving as the Digital Domain Technologies consultancy page. The `.mx.uk` domain has a server responding but no content beyond the default page, suggesting DNS is pointed at a host that hasn't been configured. The `.ltd` domain has a TLS configuration problem preventing any connection.

### Other Domains

| Domain | Live Status | Platform | Protection | Last Checked | Notes |
|---|---|---|---|---|---|
| allabouteverything.me | Parked (lander) | GoDaddy Parking | Upgrade Protection | 2026-02-15 | Redirects to `/lander` |
| alzamngrp.com | DNS error | None | — | 2026-02-15 | Domain does not resolve (NXDOMAIN); despite showing as active in GoDaddy |

The `alzamngrp.com` domain is listed in the GoDaddy account as having a website, but DNS lookup returns NXDOMAIN. This needs investigation: either the DNS records have been removed, or the domain may have expired.

## Summary

| Status | Count | Domains |
|---|---|---|
| Active site | 2 | mx-thegathering.net, allabout.network |
| Launching Soon page | 1 | mxtechnologies.ai |
| Parked (lander) | 12 | cog-nova-mx.ai, mxtechnologies.co.uk, mx-thegathering .com/.ai/.co.uk/.info/.xyz/.store, allabout.expert, allabouteverything.me |
| Parked (for sale) | 1 | credoplus.com |
| Server placeholder | 1 | allabout.mx.uk |
| Connection error | 2 | credopublishpro.com, credoqpro.co.uk |
| TLS error | 1 | allabout.ltd |
| DNS error | 1 | alzamngrp.com |

## Observations

**Only two domains serve real content.** The `.net` Gathering site and the `allabout.network` DDT consultancy page are the only working websites. Everything else is parked, broken, or showing a placeholder.

**Parked domains are generating ad impressions for GoDaddy.** The twelve domains redirecting to `/lander` load Google AdSense scripts, meaning GoDaddy is monetising the traffic. Moving DNS to Cloudflare and setting up proper redirects would eliminate this and direct visitors to the correct sites.

**The "Launching Soon" page on mxtechnologies.ai is a GoDaddy Website Builder template.** It has a contact form and copyright notice but no real content. With the launch under three months away, this should be replaced with a proper holding page or a redirect to the Gathering site.

**Three domains need immediate attention.** The `alzamngrp.com` DNS failure, the `allabout.ltd` TLS error, and the `credoplus.com` for-sale listing should be investigated — particularly if `credoplus.com` was not intentionally listed for sale.

**Redirect strategy.** Moving DNS management to the existing Cloudflare account would allow all parked and secondary domains to redirect properly to primary sites, remove GoDaddy's ad monetisation, and provide analytics on incoming traffic. A Cloudflare Worker could handle the redirect logic for all domains from a single configuration.
