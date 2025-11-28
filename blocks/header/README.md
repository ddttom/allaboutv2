# Header Block

## Overview

The header block provides site-wide navigation functionality with responsive mobile/desktop layouts, hamburger menu, and dropdown navigation support.

## Features

- **Responsive navigation** - Automatically adapts between mobile and desktop layouts at 900px breakpoint
- **Hamburger menu** - Mobile-friendly collapsible navigation
- **Dropdown menus** - Support for nested navigation sections
- **Keyboard accessible** - Full keyboard navigation support including Escape key to close menus
- **Body scroll control** - Prevents page scrolling when mobile menu is open
- **Fragment-based loading** - Loads navigation content from `/nav` or custom path via metadata

## Usage

The header block is typically placed at the top of the page and loads navigation content from a separate document.

### Basic Implementation

In your document, add:

```markdown
| Header |
|--------|
```

### Custom Navigation Path

To specify a custom navigation document, add metadata:

```markdown
---
nav: /custom-nav
---
```

### Navigation Structure

The navigation document (e.g., `/nav`) should follow this structure:

```markdown
| Brand | Sections | Tools |
|-------|----------|-------|
| Logo  | Nav Menu | Search |
```

- **Brand** - Logo and site branding
- **Sections** - Main navigation menu (supports nested lists for dropdowns)
- **Tools** - Utility navigation (search, account, etc.)

## Document-Level Operations

⚠️ **This block intentionally uses global selectors for document-level functionality.**

This block operates at the document level because it:

1. **Controls body scroll behavior** (`document.body.style.overflowY`)
   - Prevents page scrolling when mobile menu is open
   - Restores scrolling when menu closes or on desktop viewport

2. **Listens for Escape key globally** (`window.addEventListener('keydown', closeOnEscape)`)
   - Closes navigation dropdowns when user presses Escape
   - Works from anywhere on the page, not just within the header

3. **Uses responsive media queries** (`window.matchMedia('(min-width: 900px)')`)
   - Monitors viewport width to switch between mobile/desktop layouts
   - Updates navigation behavior dynamically when window is resized

4. **Accesses document active element** (`document.activeElement`)
   - Manages keyboard focus for accessibility
   - Ensures proper focus management in dropdown navigation

These global selectors are by design and necessary for proper navigation functionality that affects the entire page experience.

## Configuration

### Breakpoint

The mobile/desktop breakpoint is set at 900px (defined in `header.js` line 5):

```javascript
const isDesktop = window.matchMedia('(min-width: 900px)');
```

### Navigation Path

Default navigation path is `/nav`. Override via metadata:

```markdown
---
nav: /path/to/custom-nav
---
```

## Accessibility

The header block implements comprehensive keyboard accessibility:

- **Tab navigation** - All links and buttons are keyboard accessible
- **Escape key** - Closes open dropdowns and mobile menu
- **Enter/Space keys** - Opens/closes dropdown sections
- **ARIA attributes** - Proper `aria-expanded`, `aria-label`, and `aria-controls` attributes
- **Focus management** - Maintains logical focus order and visible focus indicators

## Mobile Behavior

On viewports below 900px:

- **Hamburger menu** - Collapsible navigation with animated icon
- **Full-screen overlay** - Navigation expands to fill viewport
- **Body scroll lock** - Prevents background scrolling when menu is open
- **Simplified dropdowns** - All sections expanded in mobile view

## Desktop Behavior

On viewports 900px and above:

- **Horizontal layout** - Traditional horizontal navigation bar
- **Hover dropdowns** - Nested navigation appears on hover
- **Keyboard dropdowns** - Dropdowns accessible via keyboard (Enter/Space)
- **Auto-collapse** - Only one dropdown open at a time

## Browser Support

- **Modern browsers** - Chrome, Firefox, Safari, Edge (last 2 versions)
- **Media queries** - Uses standard `matchMedia` API
- **ES6 modules** - Requires module support
- **Accessibility APIs** - Standard ARIA and keyboard events

## Customization

### Styling

Edit `/blocks/header/header.css` to customize:

- Colors and fonts
- Spacing and layout
- Hamburger icon appearance
- Dropdown animations
- Mobile menu transitions

### Behavior

Edit `/blocks/header/header.js` to customize:

- Breakpoint (default: 900px)
- Animation timing
- Event handling
- Navigation structure

## Related Blocks

- **[Fragment Block](../fragment/)** - Used to load navigation content
- **[Footer Block](../footer/)** - Companion block for site-wide footer

## Performance

- **Fragment loading** - Navigation loads asynchronously
- **Event listeners** - Efficiently manages event handlers (adds/removes as needed)
- **Media queries** - Native browser API for responsive behavior
- **Minimal reflows** - Optimized DOM manipulation

## Security

- **No inline scripts** - All JavaScript in external modules
- **Sanitized content** - Fragment content is safely parsed
- **Event delegation** - Secure event handling patterns

## Troubleshooting

### Navigation doesn't appear

- Check that `/nav` document exists
- Verify navigation document has proper structure
- Check browser console for fragment loading errors

### Mobile menu doesn't work

- Verify viewport width is below 900px
- Check that hamburger button is clickable
- Verify JavaScript is enabled

### Dropdowns don't open

- Desktop: Check hover styles in CSS
- Keyboard: Verify Enter/Space key handlers
- Check browser console for JavaScript errors

### Body scroll not locking

- This is intentional document-level behavior
- Check `document.body.style.overflowY` manipulation in code
- Verify mobile menu is actually open (`aria-expanded="true"`)

## Examples

### Basic Header

```markdown
| Header |
|--------|
```

### Header with Custom Navigation

```markdown
---
nav: /docs/navigation
---

| Header |
|--------|
```

## Technical Details

### DOM Structure

Generated DOM structure:

```html
<div class="header block">
  <div class="nav-wrapper">
    <nav id="nav" aria-expanded="false">
      <div class="nav-hamburger">
        <button type="button" aria-controls="nav" aria-label="Open navigation">
          <span class="nav-hamburger-icon"></span>
        </button>
      </div>
      <div class="nav-brand"><!-- Brand content --></div>
      <div class="nav-sections"><!-- Navigation menu --></div>
      <div class="nav-tools"><!-- Utility links --></div>
    </nav>
  </div>
</div>
```

### Class Names

- `.header` - Block wrapper
- `.nav-wrapper` - Navigation container
- `.nav-hamburger` - Mobile menu button
- `.nav-brand` - Brand/logo section
- `.nav-sections` - Main navigation menu
- `.nav-tools` - Utility navigation
- `.nav-drop` - Dropdown navigation items

### Data Attributes

- `aria-expanded` - Indicates navigation state (open/closed)
- `aria-controls` - Links hamburger button to navigation
- `aria-label` - Provides accessible button labels

## Version History

- **Initial Release** - Basic navigation with responsive support
- **Current** - Document-level operations with defensive documentation
