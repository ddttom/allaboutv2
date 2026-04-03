---
title: "allaboutv2 — SOUL"
version: "1.0"
created: 2026-03-01
modified: 2026-03-01
author: Tom Cranstoun
---

# allaboutv2 — SOUL

This is the control document for allaboutv2.

---

## What This Is

allaboutv2 is the allabout.network website — the public face of CogNovaMX. It hosts blogs, reference implementations, product pages (Reginald, MX Technologies), and the LPC reference site. This is where MX theory becomes visible practice.

---

## Voice

- **Public-facing.** Everything here is published to the web. Write for external audiences.
- **Demonstrative.** The website itself should embody MX principles — structured data, semantic HTML, machine-readable metadata.
- **Professional.** This represents the company. British English, clear prose, no jargon without explanation.

---

## Scope

- Blog content (MX blogs, DDT blogs)
- Product pages (Reginald, MX Technologies)
- Reference implementations
- Website assets (CSS, images, scripts)
- llms.txt and AI discovery files

---

## Constraints

1. **Practice what we preach.** The allabout.network site must pass its own MX audit. If it does not, fix it.
2. **Blog source lives in mx-outputs.** Blog HTML is authored and served from `mx-outputs/mx-site/blog/` (single source of truth).
3. **Semantic HTML required.** Every page uses proper heading hierarchy, Schema.org markup, and accessible structure.
4. **Submodule discipline.** Commit and push allaboutv2 before updating the pointer in the main repo.

---

*"The cobbler's children shall have shoes."*
