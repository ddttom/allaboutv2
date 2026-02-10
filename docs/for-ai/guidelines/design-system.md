---
title: "AllAboutV2 Design System"
description: "AI assistant guideline: AllAboutV2 Design System"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# AllAboutV2 Design System

*Related: [Frontend Guidelines](frontend-guidelines.md) | [Style Guide](style-guide.md) | [Block Architecture Standards](../implementation/block-architecture-standards.md)*

## Overview

This document defines the complete visual design language for the AllAboutV2 project, extracted from the production site at https://allabout.network/. It serves as the single source of truth for colors, typography, spacing, component patterns, and CSS custom properties used throughout all EDS blocks.

### Purpose

- **Consistency**: Ensure uniform visual design across all blocks and pages
- **Efficiency**: Provide reusable design tokens and patterns
- **Maintainability**: Centralize design decisions for easy updates
- **Accessibility**: Document standards that meet WCAG requirements
- **Developer Experience**: Clear guidelines for implementing new blocks

### Relationship to EDS Blocks

All EDS blocks should reference these design standards through:

- CSS custom properties defined in `styles/styles.css`
- Block-level CONFIG objects for component-specific values
- Consistent naming conventions from [style-guide.md](style-guide.md)
- Implementation patterns from [block-architecture-standards.md](../implementation/block-architecture-standards.md)

---

## Color System

### Primary Color Palette

**Primary Blue** - `#035fe6` / `rgb(3, 95, 230)`

- **Usage**: Links, buttons, primary interactive elements
- **CSS Variable**: `--link-color`
- **Confidence**: High (extracted from multiple sources: hero, button)

**Hover Blue** - `#136ff6` / `rgb(19, 111, 246)`

- **Usage**: Hover and focus states for interactive elements
- **CSS Variable**: `--link-hover-color`
- **Confidence**: Medium (hover/focus contexts)

**White** - `#ffffff` / `rgb(255, 255, 255)`

- **Usage**: Background, button text, emphasized content
- **CSS Variable**: `--background-color`
- **Confidence**: High (29 instances across hero and buttons)

**Black** - `#000000` / `black`

- **Usage**: Primary text color, high-contrast elements
- **CSS Variable**: `--text-color`
- **Confidence**: High (default text color)

### Neutral Colors

**Light Gray** - `#eeeeee` / `#eee`

- **Usage**: Light backgrounds, subtle separators, code blocks
- **CSS Variable**: `--light-color`
- **Usage Example**: Background for `<pre>` code blocks

**Dark Gray** - `#cccccc` / `#ccc`

- **Usage**: Borders, subtle dividers, disabled states
- **CSS Variable**: `--dark-color`
- **Confidence**: Low (4 instances, primarily borders)

### CSS Variables Reference

All colors are defined in `styles/styles.css` (lines 13-20):

```css
:root {
  /* colors */
  --link-color: #035fe6;
  --link-hover-color: #136ff6;
  --background-color: white;
  --light-color: #eee;
  --dark-color: #ccc;
  --text-color: black;
}
```

### Color Usage Guidelines

**Links and Interactive Elements:**

```css
a:any-link {
  color: var(--link-color);  /* Primary blue */
}

a:hover {
  color: var(--link-hover-color);  /* Hover blue */
}
```

**Buttons:**

```css
.button {
  background-color: var(--link-color);
  color: var(--background-color);  /* White text */
}

.button:hover {
  background-color: var(--link-hover-color);
}
```

**Backgrounds and Borders:**

```css
.component {
  background-color: var(--background-color);
  border: 1px solid var(--dark-color);
}

.code-block {
  background-color: var(--light-color);
}
```

### Accessibility

**Color Contrast Ratios** (WCAG 2.1 Level AA):

- Primary blue (#035fe6) on white: **4.74:1** ✅ (Passes for large text)
- Black text on white: **21:1** ✅ (Passes AAA)
- White text on primary blue: **4.74:1** ✅ (Passes for large text)

**Note**: Always test color combinations for sufficient contrast, especially for interactive elements.

---

## Typography System

### Font Families

**Primary Font** - Roboto

- **CSS Variable**: `--body-font-family: roboto, roboto-fallback`
- **Loading**: Self-hosted from `/fonts/` directory
- **Weights Available**:
  - 400 (Regular) - `/fonts/roboto-regular.woff2`
  - 700 (Bold) - `/fonts/roboto-bold.woff2`
- **Note**: Font weight 600 (Semibold) used in CSS is rendered as 700 (Bold)

**Fallback Font** - roboto-fallback

- **Purpose**: Local Arial with size-adjust for minimal layout shift
- **Configuration**: `size-adjust: 100.06%`, `ascent-override: 95%`
- **Source**: `local('Arial')`

**Heading Font** - Same as body

- **CSS Variable**: `--heading-font-family: var(--body-font-family)`
- **Philosophy**: Unified typography system

**Fixed-Width Font** - Roboto Mono

- **CSS Variable**: `--fixed-font-family: 'Roboto Mono', menlo, consolas, 'Liberation Mono', monospace`
- **Usage**: Code blocks, technical content

### Font Sizes

**Body Sizes:**

```css
--body-font-size-m: 22px;   /* Primary body text */
--body-font-size-s: 18px;   /* Secondary text, code blocks */
--body-font-size-xs: 16px;  /* Small text, captions */
```

**Heading Sizes (Mobile < 900px):**

```css
--heading-font-size-xxl: 48px;  /* h1 - Page titles */
--heading-font-size-xl: 40px;   /* h2 - Major sections */
--heading-font-size-l: 32px;    /* h3 - Sub-sections */
--heading-font-size-m: 24px;    /* h4 - Minor sections */
--heading-font-size-s: 20px;    /* h5 - Small headings */
--heading-font-size-xs: 18px;   /* h6 - Smallest headings */
```

**Heading Sizes (Desktop ≥ 900px):**

```css
--heading-font-size-xxl: 60px;  /* h1 - Larger on desktop */
--heading-font-size-xl: 48px;   /* h2 */
--heading-font-size-l: 36px;    /* h3 */
--heading-font-size-m: 30px;    /* h4 */
--heading-font-size-s: 24px;    /* h5 */
--heading-font-size-xs: 22px;   /* h6 */
```

### Font Weights

- **400** - Regular text, body content, regular links
- **600/700** - Headings, emphasized text, button labels, bold links
  - Note: CSS specifies 600, but font files only include 400 and 700

### Line Heights

- **Headings**: `1.25` - Tighter line height for impact
- **Body**: `1.6` - Standard body text (defined in body selector, not variable)
- **Links**: `1.60` - Matches body text line height

### Typography Usage

**Body Text:**

```css
body {
  font-size: var(--body-font-size-m);
  font-family: var(--body-font-family);
  line-height: 1.6;
}
```

**Headings:**

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font-family);
  font-weight: 600;
  line-height: 1.25;
}

h1 { font-size: var(--heading-font-size-xxl) }
h2 { font-size: var(--heading-font-size-xl) }
h3 { font-size: var(--heading-font-size-l) }
/* etc. */
```

**Code:**

```css
code, pre {
  font-family: var(--fixed-font-family);
  font-size: var(--body-font-size-s);
}
```

### Responsive Typography

Typography scales automatically via media query at 900px breakpoint:

```css
@media (width >= 900px) {
  :root {
    --heading-font-size-xxl: 60px;
    --heading-font-size-xl: 48px;
    --heading-font-size-l: 36px;
    --heading-font-size-m: 30px;
    --heading-font-size-s: 24px;
    --heading-font-size-xs: 22px;
  }
}
```

**Body font sizes remain constant across breakpoints** (mobile-first approach).

---

## Spacing & Sizing

### Base System

**Scale Type**: 8px base system

- **Philosophy**: Consistent spacing increments for visual rhythm
- **Application**: Margins, padding, gaps, element sizing

### Common Spacing Values

Listed by usage frequency (from `allabout.network.json`):

| Value | rem | Frequency | Usage |
|-------|-----|-----------|-------|
| 22px | 1.38rem | 54 instances | **Most common** - Primary body spacing, consistent with body font size |
| 16px | 1.00rem | 12 instances | Base unit - Standard padding/margin |
| 24px | 1.50rem | 6 instances | Medium spacing - Section gaps |
| 48px | 3.00rem | 6 instances | Large spacing - Major sections |
| 18px | 1.13rem | 5 instances | Small-medium spacing |
| 32px | 2.00rem | 4 instances | Large spacing alternative |
| 64px | 4.00rem | 4 instances | Extra large spacing |
| 5px | 0.31rem | 4 instances | Minimal spacing - Button padding |
| 36px | 2.25rem | 1 instance | Specific heading size match |
| 30px | 1.88rem | 1 instance | Button-specific (border radius) |
| 60px | 3.75rem | 1 instance | Largest heading match |
| 80px | 5.00rem | 1 instance | Maximum spacing |

### Spacing Guidelines

**When to use each value:**

- **5px**: Button inner padding (vertical), minimal gaps
- **16px**: Standard padding/margin, base unit for components
- **18px**: Small-medium gaps, secondary text spacing
- **22px**: **Primary choice** - Most common, aligns with body text size
- **24px**: Medium gaps between related elements
- **30px**: Border radius for pill-shaped buttons
- **32px**: Large padding/margin for major components
- **36px / 48px**: Section-level spacing, hero elements
- **60px / 64px**: Large section gaps, page-level spacing
- **80px**: Maximum spacing for major page divisions

### Layout-Specific Values

**Navigation Height:**

```css
--nav-height: 64px;
```

- Fixed height for main navigation
- Used for scroll-margin calculations: `scroll-margin: calc(var(--nav-height) + 1em);`

### Spacing Implementation

**In CSS:**

```css
.component {
  padding: 16px;  /* Base unit */
  margin-bottom: 22px;  /* Most common value */
}

.section {
  padding: 48px 16px;  /* Large vertical, standard horizontal */
}

.hero {
  padding: 64px 16px;  /* Extra large for impact */
}
```

**In Block CONFIG Objects:**

```javascript
const BLOCKNAME_CONFIG = {
  SPACING: {
    SMALL: '16px',
    MEDIUM: '22px',
    LARGE: '48px',
  },
};
```

---

## Component Patterns

### Buttons

**Primary Button Style** (extracted with medium confidence):

**Default State:**

```css
button, a.button {
  /* Colors */
  background-color: rgb(3, 95, 230);  /* var(--link-color) */
  color: rgb(255, 255, 255);  /* White text */

  /* Typography */
  font-family: var(--body-font-family);
  font-size: 22px;
  font-weight: 600;
  font-style: normal;

  /* Spacing */
  padding: 5px 30px;
  margin: 16px 0;

  /* Borders */
  border: 2px solid transparent;
  border-radius: 30px;  /* Pill shape */

  /* Other */
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
}
```

**Hover State:**

```css
button:hover, a.button:hover {
  color: var(--link-hover-color);
  background-color: var(--light-color);
}
```

**Focus State:**

```css
button:focus, a.button:focus {
  background-color: var(--link-hover-color);
}
```

**Implementation Notes:**

- Pill shape (30px border-radius) is a distinctive design element
- 5px vertical padding keeps buttons compact
- 30px horizontal padding provides generous click target
- Font size (22px) matches primary body text size

### Links

**Two Link Variants Detected:**

**Regular Links:**

```css
a:any-link {
  color: rgb(3, 95, 230);  /* var(--link-color) */
  text-decoration: none;
  font-weight: 400;
  font-size: 22px;
  line-height: 1.60;
}

a:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
```

**Emphasized Links** (white text, typically in dark backgrounds):

```css
a.emphasized {
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.60;
}

a.emphasized:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
```

### Borders

**Standard Border Pattern** (medium confidence):

```css
.bordered-element {
  border: 1px solid rgb(204, 204, 204);  /* var(--dark-color) */
}
```

**Common Usage:**

- List item separators: `li { border-bottom: 1px solid var(--dark-color); }`
- Card boundaries
- Form element outlines

### Border Radius

**Primary Value**: `30px` (pill shape)

- **Usage**: Buttons only (low confidence - limited extraction)
- **Count**: 2 instances detected
- **Philosophy**: Distinctive rounded buttons, otherwise minimal rounding

**Other Uses** (from actual implementation):

- Code blocks: `0.25em` - Subtle rounding
- Most components: No border-radius (flat design)

---

## Responsive Design

### Breakpoints

**Mobile-First Approach** with two primary breakpoints:

**Small Screens** (Mobile)

- **Range**: 0px - 599px
- **Typography**: Smaller heading sizes (48px max)
- **Layout**: Single column, full-width components
- **Spacing**: Reduced padding for screen real estate

**Medium Screens** (Tablet)

- **Range**: 600px - 899px
- **Typography**: Same as mobile (transitions at 900px)
- **Layout**: Can introduce multi-column layouts
- **Spacing**: Moderate padding increases

**Large Screens** (Desktop)

- **Range**: 900px and up
- **Typography**: Larger heading sizes (60px max)
- **Layout**: Full multi-column layouts, wider containers
- **Spacing**: Generous padding and margins

### Responsive Implementation

**CSS Media Query Pattern:**

```css
/* Mobile-first default styles */
.component {
  font-size: var(--heading-font-size-l);  /* 32px */
  padding: 16px;
}

/* Tablet adjustments (optional) */
@media (min-width: 600px) {
  .component {
    padding: 24px;
  }
}

/* Desktop adjustments */
@media (width >= 900px) {
  .component {
    /* Typography automatically scales via CSS variables */
    padding: 48px;
  }
}
```

**Note**: The typography system uses `(width >= 900px)` syntax (range media queries) rather than `(min-width: 900px)`.

### Responsive Typography

**Heading sizes automatically scale** at 900px via CSS custom property updates.

**Body text remains constant** - only heading sizes change responsively.

---

## Visual Effects

### Shadows

**Current Design**: **No shadows** detected

- **Philosophy**: Flat design aesthetic
- **Approach**: Minimal depth cues, clean surfaces
- **Exception**: May exist in individual blocks (not in global styles)

### Transitions

**Standard Transition** (from global styles):

```css
.element {
  transition: color 0.3s, background-color 0.3s;
}
```

**Common Patterns:**

- Color transitions on hover (links, buttons)
- Background color transitions on interactive elements
- No transform or complex animations in base styles

### Visual Hierarchy

Achieved through:

1. **Typography scale** - Clear size differences between heading levels
2. **Font weight** - Bold headings (600), regular body (400)
3. **Color contrast** - Primary blue for emphasis, black for content
4. **Spacing** - 22px common spacing creates consistent rhythm
5. **White space** - Clean, uncluttered layouts

---

## CSS Custom Properties Reference

### Complete Variable List

**Defined in `styles/styles.css` (lines 12-41):**

```css
:root {
  /* Colors */
  --link-color: #035fe6;
  --link-hover-color: #136ff6;
  --background-color: white;
  --light-color: #eee;
  --dark-color: #ccc;
  --text-color: black;

  /* Typography - Families */
  --body-font-family: roboto, roboto-fallback;
  --heading-font-family: var(--body-font-family);
  --fixed-font-family: 'Roboto Mono', menlo, consolas, 'Liberation Mono', monospace;

  /* Typography - Body Sizes */
  --body-font-size-m: 22px;
  --body-font-size-s: 18px;
  --body-font-size-xs: 16px;

  /* Typography - Heading Sizes (Mobile) */
  --heading-font-size-xxl: 48px;
  --heading-font-size-xl: 40px;
  --heading-font-size-l: 32px;
  --heading-font-size-m: 24px;
  --heading-font-size-s: 20px;
  --heading-font-size-xs: 18px;

  /* Layout */
  --nav-height: 64px;
}

/* Responsive Typography (Desktop ≥ 900px) */
@media (width >= 900px) {
  :root {
    --heading-font-size-xxl: 60px;
    --heading-font-size-xl: 48px;
    --heading-font-size-l: 36px;
    --heading-font-size-m: 30px;
    --heading-font-size-s: 24px;
    --heading-font-size-xs: 22px;
  }
}
```

### Usage Patterns

**In Block Stylesheets:**

```css
.my-block {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font-family);
  font-size: var(--body-font-size-m);
}

.my-block a {
  color: var(--link-color);
}

.my-block a:hover {
  color: var(--link-hover-color);
}
```

**Block-Level CSS Variables:**

Individual blocks can define their own CSS variables for local theming:

```css
.my-block {
  /* Block-specific configuration */
  --block-spacing: 1rem;
  --block-color: var(--link-color);
  --block-radius: 0.5rem;
}

.my-block-content {
  padding: var(--block-spacing);
  color: var(--block-color);
  border-radius: var(--block-radius);
}
```

### Override Guidelines

**DO:**

- Use CSS variables from global styles
- Create block-specific variables for local configuration
- Override via CSS classes for variations

**DON'T:**

- Override root CSS variables globally (affects entire site)
- Use inline styles instead of CSS variables
- Hardcode color/size values when variables exist

---

## Implementation Guidelines

### Using Design Tokens in New Blocks

**1. Reference Global CSS Variables:**

```javascript
// In blockname.js - CONFIG object
const BLOCKNAME_CONFIG = {
  // Use CSS variable names as documentation
  PRIMARY_COLOR: 'var(--link-color)',
  HOVER_COLOR: 'var(--link-hover-color)',
  BACKGROUND: 'var(--background-color)',
};
```

**2. Apply in CSS:**

```css
/* In blockname.css */
.blockname {
  /* Colors from design system */
  background-color: var(--background-color);
  color: var(--text-color);

  /* Typography from design system */
  font-family: var(--body-font-family);
  font-size: var(--body-font-size-m);

  /* Spacing from design system */
  padding: 22px;  /* Most common spacing */
  margin-bottom: 16px;  /* Base unit */
}

.blockname a {
  color: var(--link-color);
  font-size: var(--body-font-size-m);
}

.blockname a:hover {
  color: var(--link-hover-color);
}
```

### When to Extend vs. Use Existing Patterns

**Use Existing:**

- Standard buttons → Use global button styles
- Text links → Use default link styles
- Common spacing → Use documented values (especially 22px)
- Typography → Use heading/body size variables

**Extend/Customize:**

- Brand-specific components → Add block-level variables
- Unique interactive elements → Create variation classes
- Special layout needs → Document in block README
- Component-specific theming → Use CSS variable cascade

### Variation Patterns

**Maintain consistency through variation classes:**

```css
/* Base button (uses design system) */
.button {
  background-color: var(--link-color);
  color: var(--background-color);
  padding: 5px 30px;
  border-radius: 30px;
}

/* Variation - maintains system values with adjustments */
.button.large {
  padding: 10px 40px;  /* Scaled from 5px/30px */
  font-size: 24px;  /* Slightly larger than default 22px */
}

.button.secondary {
  background-color: transparent;
  color: var(--link-color);
  border: 2px solid var(--link-color);
}
```

### Examples from Existing Blocks

**Pattern: Using design system in a card component:**

```css
.card {
  /* Design system colors */
  background-color: var(--background-color);
  border: 1px solid var(--dark-color);

  /* Design system spacing */
  padding: 22px;  /* Most common */
  margin-bottom: 22px;

  /* Subtle border radius (not buttons) */
  border-radius: 0.25em;
}

.card-title {
  /* Design system typography */
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-m);
  font-weight: 600;
  line-height: 1.25;

  /* Design system colors */
  color: var(--text-color);
}

.card-link {
  /* Design system links */
  color: var(--link-color);
  font-size: var(--body-font-size-m);
}

.card-link:hover {
  color: var(--link-hover-color);
}
```

---

## Accessibility Considerations

### Color Contrast

**WCAG 2.1 Level AA Requirements:**

- Normal text (< 18px): 4.5:1 minimum contrast ratio
- Large text (≥ 18px or ≥ 14px bold): 3:1 minimum contrast ratio

**Design System Compliance:**

- Black on white (body text): **21:1** ✅ Exceeds AAA
- Primary blue (#035fe6) on white: **4.74:1** ✅ Passes for large text (buttons, large links)
- White on primary blue: **4.74:1** ✅ Passes for large text (button text)

**Testing Required:**

- Any new color combinations
- Custom background colors with text overlays
- Interactive element states (hover, focus, disabled)

### Focus States

**Ensure visible focus indicators:**

```css
.interactive-element:focus {
  outline: 2px solid var(--link-hover-color);
  outline-offset: 2px;
}
```

**Buttons automatically have focus styles** via global CSS (focus state changes background-color).

### Font Size Minimums

**Design system defaults:**

- Minimum body text: 16px (--body-font-size-xs)
- Standard body text: 22px (--body-font-size-m)
- Code text: 18px (--body-font-size-s)

**All sizes meet WCAG minimum** of 16px (12pt) for body text.

### Interactive Element Spacing

**Touch target minimum:** 44x44 CSS pixels (iOS), 48x48dp (Android)

**Button implementation:**

- Height from 5px vertical padding + 22px font-size + line-height ≈ 44px ✅
- Width from 30px horizontal padding + text width (varies) - ensure adequate
- Border provides visual boundary within touch target

**Links in body text:**

- Font size 22px with line-height 1.6 = 35.2px height
- May need additional padding for comfortable touch targets

---

## Maintaining This Documentation

### Source Data

**Design Language Source:**

- Extracted from: https://allabout.network/
- Extraction Date: 2025-12-07
- Source File: `docs/for-ai/allabout.network.json`

**Verification:**

- CSS variables verified against `styles/styles.css` (lines 12-41)
- Font files verified in `/fonts/` directory
- Component patterns extracted with confidence levels (high/medium/low)

### Design Philosophy

**Flat Design, Minimal Effects**

- No shadows in global styles
- Clean, uncluttered layouts
- Color and typography create hierarchy
- Self-hosted fonts (no external dependencies)

**Key Characteristics:**

- Pill-shaped buttons (30px border-radius) - Distinctive element
- 22px spacing as most common value - Consistent rhythm
- Roboto typography - Clean, modern sans-serif
- Primary blue (#035fe6) - Strong, recognizable brand color

### Updating Design Language

**When visual design changes:**

1. **Re-extract design language** using design analysis tools
2. **Update `allabout.network.json`** with new extraction data
3. **Verify against actual CSS** in `styles/styles.css`
4. **Update this documentation** to reflect changes
5. **Update affected blocks** to maintain consistency
6. **Test accessibility** for any new color combinations
7. **Document breaking changes** in CHANGELOG

**Files to Update:**

- `docs/for-ai/allabout.network.json` - Raw extraction data
- `docs/for-ai/guidelines/design-system.md` - This file
- `styles/styles.css` - If adding new CSS variables
- Individual block CSS - If design system changes affect blocks

### Related Documentation

**Core Design Standards:**

- [Frontend Guidelines](frontend-guidelines.md) - Implementation patterns for EDS blocks
- [Style Guide](style-guide.md) - CSS naming conventions and code organization
- [Block Architecture Standards](../implementation/block-architecture-standards.md) - JavaScript and CSS architecture for blocks

**Implementation Guides:**

- [Raw EDS Blocks Guide](../implementation/raw-eds-blocks-guide.md) - Creating simple EDS blocks
- [Complex EDS Blocks Guide](../implementation/complex-eds-blocks-guide.md) - Advanced block development
- [Design Philosophy Guide](../implementation/design-philosophy-guide.md) - Architectural decision framework

---

## Summary

The AllAboutV2 design system emphasizes:

1. **Consistency** - CSS custom properties ensure uniform application
2. **Simplicity** - Flat design, minimal effects, clean aesthetic
3. **Accessibility** - WCAG-compliant colors, readable typography
4. **Performance** - Self-hosted fonts, no external dependencies
5. **Maintainability** - Centralized design tokens, clear documentation

**Key Design Elements:**

- **Primary blue** (#035fe6) for interactive elements
- **Roboto typography** (400/700 weights) self-hosted
- **22px spacing** as primary rhythm value
- **Pill-shaped buttons** (30px border-radius) as signature element
- **Mobile-first responsive** with 600px/900px breakpoints

**For Developers:**

- Always use CSS custom properties from `styles/styles.css`
- Follow spacing patterns (especially 22px for consistency)
- Reference this document when creating new blocks
- Test color contrast for new combinations
- Document variations that extend the design system

**For Designers:**

- This document reflects production site design
- Changes should update both JSON and documentation
- Maintain flat design philosophy
- Ensure accessibility standards (WCAG 2.1 AA minimum)
