---
description: "Responsive site header with navigation, hamburger menu, and brand identity"
author: Tom Cranstoun
created: 2026-02-22
modified: 2026-03-02
status: draft
category: eds-block
tags: [eds, block, header, navigation]
version: "1.0"
cogId: "cog-eds-block-header-20260222"
cogType: "certificate-of-genuineness"
license: "MIT"

publisher:
  name: "Cog-Nova-MX Ltd"
  verified: false
  signedBy: "unsigned"
  contact: "tom.cranstoun@gmail.com"
  website: "https://allabout.network"

subject:
  name: "Header Block"
  category: "eds-block"
  scope: "navigation"
  description: "Responsive site header with navigation, hamburger menu, and brand identity"

publicationDate: "2026-02-22"
expires: "2026-08-22"
lastVerified: "2026-02-22"
signature: "unsigned"
mxCompliance: "level-2"
registry: "allabout.network"

maintainer:
  name: "Tom Cranstoun"
  role: "MX Authority"
  contact: "tom.cranstoun@gmail.com"
  escalation: "tom.cranstoun@gmail.com"

reviewCycle: "quarterly"
updateTriggers:
  - "EDS core update"
  - "accessibility requirement change"
  - "navigation structure change"
  - "mobile breakpoint change"

accuracyCommitment: "Verified against current allaboutv2 header block implementation"
correctionSla: "72 hours"

usage:
  sopInference: "permitted"
  caching: "permitted for 24 hours"
  redistribution: "with attribution"
  commercialUse: "permitted"
  aiTraining: "permitted with attribution"

block:
  name: "header"
  version: "1.0"
  category: "navigation"

  contentModel:
    description: |
      Header content is authored as a fragment in /nav.
      The block loads this fragment and transforms it into
      a responsive navigation structure.
    rows:
      - name: "Brand/Logo"
        purpose: "Site logo and home link"
        required: true
      - name: "Nav Sections"
        purpose: "Primary navigation links"
        required: true
      - name: "Nav Tools"
        purpose: "Secondary actions (search, language, CTA)"
        required: false

  decoration:
    approach: "decorate()"
    transforms:
      - "Loads nav fragment from /nav path"
      - "Wraps content in semantic nav element with id='nav'"
      - "Creates hamburger button for mobile"
      - "Adds aria-expanded state management"
      - "Binds keyboard navigation (Escape, Enter, Space)"

  dependencies:
    scripts:
      - "../../scripts/aem.js"
      - "../fragment/fragment.js"
    styles:
      - "./header.css"
    blocks:
      - "fragment"

  accessibility:
    ariaRoles:
      - "navigation"
      - "button (hamburger)"
    keyboardSupport: "Escape closes menu, Enter/Space opens dropdowns, Tab navigates"
    wcagLevel: "AA"

  responsive:
    mobileBehavior: "Hamburger menu with slide-in drawer from right"
    breakpoints: [900]

contentType: "eds-block"
audience: ["tech", "machines"]
runbook: |
---

# Header Block

The header block provides responsive site navigation with a brand area, navigation sections, and optional tools. On mobile devices (< 900px), it transforms into a hamburger menu with a slide-in drawer.

## Content Model

The header loads its content from a nav fragment, typically located at `/nav`. Authors create navigation structure in a standard document.

### Fragment Structure

```
| Header |
|--------|
| ![Logo](logo.svg) |
| - [Home](/) |
| - [Products](/products) |
| - [About](/about) |
```

### Sections

| Section | Content | Required | Notes |
|---------|---------|----------|-------|
| Brand | Logo image + link | Yes | First element, links to home |
| Nav Sections | Unordered list of links | Yes | Primary navigation |
| Nav Tools | Secondary links/buttons | No | Search, language selector, CTAs |

## Decoration

The `decorate(block)` function transforms the nav fragment:

```javascript
export default async function decorate(block) {
  // Load nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Build nav structure
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  // ... decoration continues
}
```

### Transformations

1. **Fragment loading** — Fetches nav content from `/nav` or custom path
2. **Semantic wrapping** — Creates `<nav id="nav">` container
3. **Section classification** — Identifies brand, sections, tools
4. **Hamburger injection** — Adds mobile menu button
5. **Event binding** — Keyboard and click handlers

## Styling

Key CSS classes:

| Class | Purpose |
|-------|---------|
| `.header` | Block container |
| `.nav-brand` | Logo and brand area |
| `.nav-sections` | Primary navigation links |
| `.nav-tools` | Secondary actions |
| `.nav-hamburger` | Mobile menu button |
| `.nav-drop` | Dropdown toggle |

## Accessibility

- **ARIA:** `aria-expanded` on nav and dropdowns, `aria-label` on hamburger button
- **Keyboard:** Escape closes menu, Tab navigates, Enter/Space opens dropdowns
- **Screen readers:** Semantic nav element, button labels announce state

## Responsive Behavior

- **Desktop (≥900px):** Horizontal navigation, dropdowns on hover/focus
- **Mobile (<900px):** Hamburger icon, drawer slides from right, body scroll locked

### Mobile Menu

```css
@media (max-width: 899px) {
  .nav-sections {
    position: fixed;
    right: -100%;
    transition: right 0.3s ease;
  }
  nav[aria-expanded="true"] .nav-sections {
    right: 0;
  }
}
```

## Examples

### Basic Navigation

Document structure:

```
| Header |
|--------|
| ![AllAbout](/icons/logo.svg) |
| - [MX](/mx) |
| - [Blog](/blog) |
| - [Contact](/contact) |
```

### With Dropdown

```
| Header |
|--------|
| ![Logo](/icons/logo.svg) |
| - Products |
|   - [Widget](/products/widget) |
|   - [Gadget](/products/gadget) |
| - [About](/about) |
```

## Related Blocks

- **fragment** — Required dependency for loading nav content
- **footer** — Complementary block for page structure
- **hero** — Often appears immediately after header

---

*Block maintained by Tom Cranstoun, Cog-Nova-MX Ltd*
