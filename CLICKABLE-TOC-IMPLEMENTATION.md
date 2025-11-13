# Clickable Table of Contents Implementation

## Overview

The `ipynb-blog.svg` icon now functions as an **interactive, clickable table of contents** for the blog.ipynb notebook. Each of the 8 parts is clickable and will scroll to the corresponding section in the rendered notebook.

## Changes Made

### 1. SVG Icon Updates ([icons/ipynb-blog.svg](icons/ipynb-blog.svg))

Added clickable anchor links to all 8 parts:

```svg
<a href="#part-1" target="_parent">
  <circle cx="140" cy="200" r="12" fill="#2196f3" style="cursor: pointer;"/>
  <text>Part 1: What is ipynb-viewer?</text>
  <!-- ... -->
</a>
```

**Features:**
- All parts (1-8) wrapped in `<a>` tags with anchor links
- Cursor changes to pointer on hover
- Links use `target="_parent"` for proper iframe behavior

### 2. JavaScript Updates ([blocks/ipynb-viewer/ipynb-viewer.js](blocks/ipynb-viewer/ipynb-viewer.js))

Modified the `parseMarkdown()` function to automatically add ID attributes to "Part X:" headers:

```javascript
html = html.replace(/^## (.*$)/gim, (match, text) => {
  // Check if it's a "Part X:" heading
  const partMatch = text.match(/Part\s+(\d+):/i);
  if (partMatch) {
    const partNum = partMatch[1];
    return `<h2 id="part-${partNum}">${text}</h2>`;
  }
  return `<h2>${text}</h2>`;
});
```

**Result:**
- H2 headers matching "Part X:" pattern get `id="part-X"` attribute
- Example: `## Part 2: Getting Started` → `<h2 id="part-2">Part 2: Getting Started</h2>`

### 3. CSS Updates ([blocks/ipynb-viewer/ipynb-viewer.css](blocks/ipynb-viewer/ipynb-viewer.css))

Added smooth scrolling and visual feedback:

```css
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Scroll padding for anchors (offset for fixed headers) */
html {
  scroll-padding-top: 100px;
}

/* Scroll margin for h2 headers */
.ipynb-markdown-cell h2 {
  scroll-margin-top: 100px; /* Offset for scroll-to anchor */
}

/* Highlight effect for targeted anchors */
.ipynb-markdown-cell h2:target {
  animation: highlight-flash 2s ease-out;
}

@keyframes highlight-flash {
  0% {
    background-color: rgba(255, 235, 59, 0.4);
  }
  100% {
    background-color: transparent;
  }
}
```

**Features:**
- Smooth scroll animation when clicking TOC items
- 100px scroll offset to account for fixed headers
- Yellow highlight flash animation on the target section (2 seconds)

## How It Works

### User Flow

1. **User views the blog post** with the ipynb-viewer block displaying blog.ipynb
2. **SVG TOC is embedded** on the page (as an image or inline SVG)
3. **User clicks a part** in the TOC (e.g., "Part 3: Testing EDS Blocks")
4. **Page smoothly scrolls** to the corresponding h2 header with `id="part-3"`
5. **Target section flashes yellow** briefly to indicate the destination

### Technical Flow

```
Click SVG Link (#part-3)
    ↓
Browser finds <h2 id="part-3">
    ↓
Smooth scroll animation (scroll-behavior: smooth)
    ↓
Page scrolls with 100px offset (scroll-padding-top)
    ↓
Target section highlights (h2:target animation)
```

## File Structure

```
/icons/
  └── ipynb-blog.svg          # Interactive TOC with clickable links

/blocks/ipynb-viewer/
  ├── ipynb-viewer.js         # Auto-generates anchor IDs for "Part X:" headers
  └── ipynb-viewer.css        # Smooth scroll and highlight styles

/blog.ipynb                   # 8-part tutorial with "Part X:" section headers
```

## Usage Example

### In Your EDS Page (Google Doc)

Add the ipynb-viewer block:

```
| IPynb Viewer |
|--------------|
| /blog.ipynb  |
```

Add the TOC SVG image:

```
| Image |
|-------|
| /icons/ipynb-blog.svg |
```

Or embed the SVG inline for better interactivity.

### Result

The rendered page will have:
- Interactive 8-part blog tutorial
- Clickable visual TOC showing the learning journey
- Smooth scrolling navigation between sections
- Visual feedback when reaching target sections

## Browser Support

- **Smooth scrolling:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **CSS animations:** All modern browsers
- **SVG links:** All browsers with SVG support
- **`:target` pseudo-class:** All modern browsers

## Accessibility

- Links are keyboard navigable (Tab key)
- Screen readers announce links properly
- Visual cursor changes indicate clickability
- Focus states maintained during navigation

## Future Enhancements

Possible improvements:
1. **Progress indicator** - Highlight current section in TOC as user scrolls
2. **Sticky TOC** - Keep TOC visible while scrolling through content
3. **Back to TOC button** - Quick return to navigation
4. **Deep linking** - Share URLs with specific section anchors
5. **Auto-collapse sections** - Accordion-style navigation

## Testing

To test the implementation:

1. Open a page with blog.ipynb rendered via ipynb-viewer
2. Add the ipynb-blog.svg image
3. Click any part in the TOC
4. Verify smooth scroll to correct section
5. Observe yellow highlight animation
6. Test with keyboard navigation (Tab + Enter)

## Notes

- The pattern matching is case-insensitive (`/Part\s+(\d+):/i`)
- Works with any variation: "Part 2:", "part 3:", "PART 5:"
- Only h2 headers with "Part X:" pattern get IDs
- Other h2 headers remain without IDs
- Scroll offset (100px) can be adjusted based on header height

## Credits

Implementation for interactive blog.ipynb tutorial with visual learning path navigation.
