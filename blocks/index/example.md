---
title: "Index Block Examples"
description: "Usage examples for the index EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Index Block Examples

This page demonstrates various usage patterns for the Index block, which automatically generates a table of contents by scanning all headings (h1-h6) on the page.

## Example 1: Basic Index

The simplest usage - place the block anywhere on your page:

| Index |
|-------|

The block will:

- Scan all headings on the page
- Generate a collapsible navigation menu
- Add clickable links with hierarchical indentation
- Automatically assign IDs to headings for anchor navigation

## Example 2: Index at Page Start

Place the index near the top of the page for easy navigation:

| Index |
|-------|

# Main Content Heading

This is the main content of the page...

## Section 1: Introduction

Content for section 1...

### Subsection 1.1: Details

More detailed content...

## Section 2: Features

Content for section 2...

### Subsection 2.1: Feature A

Details about feature A...

### Subsection 2.2: Feature B

Details about feature B...

## Example 3: Index in Sidebar

The index block can be placed in a sidebar layout using EDS section metadata:

| Index |
|-------|

Section Metadata:

```
style: sidebar-left
```

This creates a sticky sidebar navigation that stays visible while scrolling.

## Example 4: Multiple Heading Levels

The index block supports all six heading levels (h1-h6):

| Index |
|-------|

# Level 1: Main Title

## Level 2: Major Section

### Level 3: Subsection

#### Level 4: Minor Section

##### Level 5: Detail

###### Level 6: Fine Detail

Each level is automatically indented by 20px increments for visual hierarchy.

## Example 5: Long Document Navigation

For documents with many sections, the index provides quick navigation:

| Index |
|-------|

# Document Title

## Introduction

Content...

## Background

Content...

## Methodology

### Data Collection

Content...

### Data Analysis

Content...

## Results

### Finding 1

Content...

### Finding 2

Content...

## Discussion

Content...

## Conclusion

Content...

## References

Content...

## How It Works

**Automatic Scanning:**

- The block scans ALL headings on the page using `document.querySelectorAll('h1, h2, h3, h4, h5, h6')`
- This is document-level functionality (not limited to the block itself)
- Headings are processed in document order

**ID Generation:**

- Each heading receives a unique ID: `header-0`, `header-1`, `header-2`, etc.
- IDs are sequential based on document order
- These IDs enable anchor navigation

**Hierarchical Indentation:**

- h1: 0px indentation
- h2: 20px indentation
- h3: 40px indentation
- h4: 60px indentation
- h5: 80px indentation
- h6: 100px indentation

**Lazy Building:**

- Index content is built only on first click (not on page load)
- Improves initial page load performance
- Content persists after first build

**Collapsible Interface:**

- Click header to expand/collapse
- Arrow icon rotates to indicate state
- Content shows/hides smoothly

## Behavior

**Initial State:**

- Index is collapsed (content hidden)
- Arrow points down

**First Click:**

- Scans page headings
- Builds navigation list
- Expands to show content
- Arrow rotates up

**Subsequent Clicks:**

- Toggles visibility (expand/collapse)
- Does not rebuild (uses cached content)
- Arrow rotates to match state

## Use Cases

**Long Articles:**

- Blog posts with multiple sections
- Technical documentation
- Research papers
- Tutorial guides

**Documentation:**

- API documentation
- User guides
- Knowledge base articles
- Policy documents

**Reports:**

- Business reports
- Project documentation
- Analysis documents
- Specifications

## Accessibility

**Keyboard Navigation:**

- Tab to focus on header
- Enter or Space to expand/collapse
- Tab through navigation links
- Enter to follow link

**Screen Readers:**

- Semantic HTML structure
- Proper heading hierarchy
- Descriptive link text
- Standard anchor navigation

## Browser Support

**Modern Browsers:**

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**Features Used:**

- `querySelectorAll` (standard DOM API)
- ES6 modules
- CSS transforms
- HTML5 semantic elements

## Tips

**Best Practices:**

- Use semantic heading hierarchy (h1 → h2 → h3, not h1 → h3)
- Keep heading text concise for better navigation
- Place index near top of long documents
- Consider sidebar layout for very long pages

**Avoid:**

- Skipping heading levels (h1 → h3)
- Using headings for styling only
- Very long heading text (wraps in navigation)
- Multiple h1 headings (use h2 for sections)

## Technical Notes

**Document-Level Operations:**

- This block intentionally uses `document.querySelectorAll()` for page-wide scanning
- It adds IDs to ALL headings on the page
- This is required functionality, not a bug

**Single Instance:**

- Works correctly with multiple index blocks on same page
- Each instance operates independently
- All instances show the same navigation (same headings)

**Performance:**

- Lazy building (first click only)
- Minimal DOM manipulation
- One-time heading scan
- Cached navigation content

| metadata        |                                                                 |
| :-------------- | :-------------------------------------------------------------- |
| title           | Index Block Examples                                            |
| description     | Usage examples for the Index block showing table of contents generation |
| author          | Tom Cranstoun                                                   |
| longdescription | This page demonstrates various examples of the Index block, showing how it automatically generates a collapsible table of contents by scanning all page headings and creating hierarchical navigation with anchor links. |
