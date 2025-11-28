# Index Block

## Overview

Generates an interactive table of contents by scanning all headings (h1-h6) on the page and creating clickable navigation links with hierarchical indentation.

## Features

- **Page-wide heading scan** - Automatically finds all h1-h6 headings across the entire document
- **Collapsible interface** - Click to expand/collapse the index
- **Hierarchical indentation** - Visual hierarchy based on heading levels
- **Anchor navigation** - Click links to jump to corresponding headings
- **Lazy building** - Index content built on first click for performance
- **Automatic ID generation** - Adds IDs to headings for anchor links

## Usage

Add the index block to your document:

```markdown
| Index |
|-------|
```

The block will automatically:
1. Scan all h1-h6 headings on the page
2. Generate a collapsible navigation menu
3. Add IDs to headings (format: `header-0`, `header-1`, etc.)
4. Create clickable links with hierarchical indentation

## Document-Level Operations

⚠️ **This block intentionally uses global selectors for document-level functionality.**

This block operates at the document level because it:

1. **Scans ALL page headings** (`document.querySelectorAll('h1, h2, h3, h4, h5, h6')`)
   - Needs to find every heading across the entire document, not just within the block
   - Creates a comprehensive table of contents for the whole page
   - This is the primary purpose of the index block

2. **Adds IDs to page headings**
   - Modifies heading elements throughout the document (not just within the block)
   - Enables anchor navigation from the index to any heading on the page
   - Format: `header-0`, `header-1`, `header-2`, etc.

3. **Creates navigation links**
   - Links point to headings anywhere on the page using anchor fragments (`#header-N`)
   - Clicking a link scrolls to the corresponding heading

**This is by design** - the index block needs to know about all page content to build a meaningful table of contents. Without document-level scanning, it would only see headings within its own block element, making it useless for navigation.

## Behavior

### Initial State

- **Collapsed** - Index content is hidden
- **Arrow icon** - Points down to indicate collapsed state

### On First Click

- **Builds index** - Scans headings and creates navigation
- **Expands** - Shows index content
- **Arrow rotates** - Points up to indicate expanded state

### Subsequent Clicks

- **Toggles visibility** - Shows/hides index content
- **Maintains state** - Index content persists (not rebuilt)

## Heading Hierarchy

The index uses indentation to show heading hierarchy:

- **h1** - No indentation (0px)
- **h2** - 20px indentation
- **h3** - 40px indentation
- **h4** - 60px indentation
- **h5** - 80px indentation
- **h6** - 100px indentation

Formula: `(heading level - 1) × 20px`

## Accessibility

- **Keyboard accessible** - Click events work with keyboard activation
- **Semantic links** - Uses proper `<a>` elements for navigation
- **Focus management** - Links receive proper focus indicators
- **Anchor navigation** - Standard browser anchor link behavior

## Browser Support

- **Modern browsers** - Chrome, Firefox, Safari, Edge (last 2 versions)
- **Anchor links** - Standard HTML anchor navigation
- **querySelectorAll** - Standard DOM API
- **ES6 modules** - Requires module support

## Customization

### Styling

Edit `/blocks/index/index.css` to customize:

- Colors and fonts
- Indentation amounts
- Arrow icon appearance
- Expand/collapse animations
- Link hover states

### Behavior

Edit `/blocks/index/index.js` to customize:

- Heading selector (currently h1-h6)
- ID format (currently `header-N`)
- Indentation formula
- Initial state (collapsed/expanded)

## Performance

- **Lazy building** - Index content built only when user clicks (not on page load)
- **One-time scan** - Headings scanned once and cached
- **Minimal reflows** - DOM built in memory before insertion

## Troubleshooting

### Index appears empty

- Check that page has h1-h6 headings
- Verify headings are in main content (not hidden)
- Open browser console for JavaScript errors

### Links don't work

- Verify heading IDs were added (inspect headings in DevTools)
- Check that anchor links have correct format (`#header-N`)
- Ensure JavaScript executed without errors

### Wrong hierarchy

- Check heading structure in document
- Verify heading levels are semantic (h1 → h2 → h3, not h1 → h3)
- Inspect generated list items for correct indentation

## Examples

### Basic Index

```markdown
| Index |
|-------|
```

### Page with Index

```markdown
# Main Heading

Some introduction text.

| Index |
|-------|

## Section 1

Content here.

### Subsection 1.1

More content.

## Section 2

More content.
```

## Technical Details

### DOM Structure

Generated DOM structure:

```html
<div class="index block">
  <div class="index-header">
    <span>Index</span>
    <i class="arrow down"></i>
  </div>
  <div class="index-content" style="display: none;">
    <ul>
      <li style="margin-left: 0px"><a href="#header-0">Main Heading</a></li>
      <li style="margin-left: 20px"><a href="#header-1">Section 1</a></li>
      <li style="margin-left: 40px"><a href="#header-2">Subsection 1.1</a></li>
      <li style="margin-left: 20px"><a href="#header-3">Section 2</a></li>
    </ul>
  </div>
</div>
```

### Class Names

- `.index` - Block wrapper
- `.index-header` - Clickable header with label and arrow
- `.index-content` - Collapsible content container
- `.arrow` - Rotating arrow icon
- `.down` - Arrow direction class

### ID Format

Headings receive auto-generated IDs:
- Format: `header-{index}`
- Example: `header-0`, `header-1`, `header-2`
- Sequential based on document order

## Known Issues

1. **Lines 5 and 39** - Currently use `document.querySelector('.index')` instead of `block` parameter (bug - will be fixed)
   - This breaks multi-instance support
   - Only the first index block on a page will work correctly

## Related Blocks

- **[Table of Contents](../toc/)** - Alternative TOC implementation
- **[Navigation](../nav/)** - Page-level navigation

## Version History

- **Initial Release** - Basic index with collapsible interface
- **Current** - Document-level operations with defensive documentation (bug fix pending)
