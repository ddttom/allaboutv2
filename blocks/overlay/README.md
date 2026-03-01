---
title: "Overlay Block"
description: "Documentation for the overlay EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Overlay Block

The Overlay block creates a button that, when clicked, displays content in a full-viewport overlay with an animated entrance and close button.

## Author Documentation

### What is the Overlay Block?

The Overlay block allows you to display additional information without navigating away from the current page. When users click the button, a modal overlay appears with your content, complete with:

- A header showing the button text
- Your custom content (text, images, links, lists, etc.)
- An animated close button (×) in the top right
- Smooth fade-in/fade-out animations
- Click outside or press ESC to close

### When to Use This Block

**Perfect for:**

- Terms and conditions or privacy policies
- Additional product information
- Contact details or location information
- Special announcements or notices
- Help text or instructions
- "Learn More" content that doesn't need its own page

**Not recommended for:**

- Primary navigation
- Critical information that should always be visible
- Long-form content better suited to a dedicated page
- Forms or complex interactions (use a dedicated page instead)

### How to Create an Overlay Block

#### Basic Structure

The Overlay block requires exactly **3 rows**:

| Overlay |
| ------- |
| **Button Text** |
| ------- |
| **Overlay Content** |

**Row 1:** The block name "Overlay" (this identifies the block to EDS)

**Row 2:** The text that appears on the button (e.g., "Learn More", "View Details", "Contact Us")

**Row 3:** The content that displays inside the overlay when clicked

#### Simple Example

| Overlay |
| ------- |
| Learn More |
| ------- |
| Welcome to our platform! Discover how we can help you achieve your goals with our comprehensive solutions. |

This creates a "Learn More" button that shows the welcome message in an overlay.

#### Notebook Variation

The Overlay block supports a "notebook" variation that works identically to the default behavior:

| Overlay (notebook) |
| ------- |
| Open Notebook |
| ------- |
| This is notebook content with the close button (×) visible in the top right corner. |

**Behavior:**

- ✅ Displays a trigger button (no autorun)
- ✅ Close button (×) is visible in the overlay
- ✅ User must click the button to open the overlay
- ✅ Can be closed via close button, ESC key, or clicking outside

To use the notebook variation, simply add the class name to your block in Google Docs:

```
Overlay (notebook)
```

The notebook variation ensures the close button is always visible and the overlay only opens when the user clicks the trigger button.

#### Rich Content Example

You can include formatted content, lists, links, and more:

| Overlay |
| ------- |
| View Features |
| ------- |
| **Our Amazing Features**<br><br>• Real-time Collaboration<br>• Advanced Analytics<br>• Enterprise Security<br>• 24/7 Support<br><br>[Learn More](https://example.com) |

#### Multiple Overlays

You can have multiple overlay blocks on the same page - each will work independently:

| Overlay |
| ------- |
| About Us |
| ------- |
| Founded in 2020, we've been dedicated to providing exceptional service... |

| Overlay |
| ------- |
| Contact |
| ------- |
| Email: hello@example.com<br>Phone: +1 (555) 123-4567 |

### Content Best Practices

#### Button Text

- **Keep it short:** 1-3 words is ideal (e.g., "Learn More", "View Details", "Contact Us")
- **Make it descriptive:** Users should understand what they'll see when clicking
- **Use action verbs:** "View", "Read", "Learn", "Contact", "See"

#### Overlay Content

- **Be concise:** While the overlay scrolls, shorter content provides better UX
- **Use formatting:** Bold, lists, and headings help organize information
- **Include links sparingly:** Links work, but overlays shouldn't be primary navigation
- **Mobile-friendly:** Content adjusts automatically, but avoid extremely wide images

### Accessibility Features

The Overlay block is built with accessibility in mind:

- ✅ **Keyboard navigation:** Press ESC to close, Tab to navigate within the overlay
- ✅ **Screen reader support:** Proper ARIA labels and roles
- ✅ **Focus management:** Focus moves to the close button when opened, returns to the trigger button when closed. If the overlay content contains focusable elements (links, buttons), Tab will navigate through them while the overlay is open.
- ✅ **Clear close options:** Close button, click outside, or press ESC

### Styling

The Overlay block uses your site's global styles:

- **Button:** Inherits global button styles from `styles/styles.css`
- **Overlay:** White background, rounded corners (16px on desktop, 12px on tablet/mobile, 8px on small mobile), drop shadow
- **Typography:** Inherits your site's fonts and colors
- **Responsive:** Automatically adjusts for mobile, tablet, and desktop

### Technical Details

#### Maximum Width & Height

The overlay modal has a maximum width of 800px on desktop for optimal readability. On tablet and mobile devices (768px and below), the width adjusts to 100% with appropriate padding.

**Responsive behavior:**

- **Desktop:** max-width: 800px, max-height: 80vh
- **Tablet/Mobile (≤768px):** max-width: 100%, max-height: 90vh
- **Small Mobile (≤480px):** max-width: 100%, max-height: 95vh

#### Animation Duration

- **Overlay fade-in/fade-out:** 0.3 seconds (300ms)
- **Modal scale transition:** 0.3 seconds (300ms)
- **Close button rotation:** 0.2 seconds (200ms) on hover/focus

#### Z-Index

The overlay appears above all other content (z-index: 999).

#### Scrolling

- When the overlay is open, the page body scroll is locked
- If overlay content exceeds viewport height, the content area becomes scrollable

## Developer Documentation

### File Structure

```
blocks/overlay/
├── overlay.js       # Decorate function and overlay logic
├── overlay.css      # Styling and animations
├── README.md        # This file
├── EXAMPLE.md       # Google Docs authoring example
└── test.html        # Browser-based testing file
```

### Architecture Overview

#### Document-Level Block Pattern

The Overlay block uses a **document-level pattern** that differs from typical EDS blocks:

**Standard EDS blocks:**

- Operate within their own `<div>` container
- Scoped to the block element
- Do not affect document body

**Overlay block (document-level):**

- Appends overlay to `document.body` (not the block container)
- Adds `overlay-open` class to `document.body` to prevent scrolling
- Uses fixed positioning at high z-index (999) to appear above all content
- Manages global keyboard events (ESC key)

**Why document-level?**

1. **Full viewport coverage:** Fixed positioning relative to viewport, not parent container
2. **Backdrop layer:** Needs to cover entire page including header, nav, footer
3. **Scroll lock:** Must prevent body scroll while overlay is open
4. **Z-index stacking:** Appears above all other page content consistently

**Technical implications:**

- Block decoration happens in block container, but overlay DOM is appended to body
- Event listeners attached to document for ESC key handling
- Body class manipulation for scroll locking
- Cleanup required when overlay closes (remove from body, restore scroll)

### JavaScript API

#### decorate(block)

Main decoration function that:

1. Detects block variations (e.g., `.notebook` class)
2. Extracts button text from row 2 (row 1 is the block name "Overlay")
3. Extracts overlay content from row 3
4. Creates trigger button (no autorun for any variation)
5. Handles overlay creation and event management

**Variations:**

- **Default:** Trigger button opens overlay, close button visible
- **Notebook (`.notebook`):** Same behavior as default - trigger button, close button visible, no autorun

#### Configuration Object

```javascript
const CONFIG = {
  animationDuration: 300,              // Animation timing (ms) - used in JavaScript timeout
  backdropColor: 'rgba(0, 0, 0, 0.5)', // Documentation only - actual value hardcoded in CSS
  borderRadius: '16px',                 // Documentation only - actual values in CSS: 16px desktop, 12px tablet, 8px mobile
  maxWidth: '800px',                    // Documentation only - actual values in CSS: 800px desktop, 100% tablet/mobile
  closeButtonLabel: 'Close overlay',    // Accessibility label - used in JavaScript
};
```

**Note:** Some CONFIG values are documentation-only references. To change `backdropColor`, `borderRadius`, or `maxWidth`, modify the CSS directly in [overlay.css](overlay.css). The CSS includes responsive values across three breakpoints (desktop, ≤768px, ≤480px).

### Key Functions

**createOverlay(title, contentElement)**

- Builds the overlay DOM structure with close button (always visible)
- Creates backdrop, modal, header, title, close button, and content area
- Sets up ARIA attributes for accessibility
- Returns the complete overlay container element

**showOverlay(overlay, triggerButton)**

- Appends overlay to `document.body` (document-level operation)
- Adds `overlay-open` class to body to lock scroll
- Triggers CSS animations using `requestAnimationFrame`
- Sets initial focus to close button
- Stores reference to trigger button for focus return
- Calls `setupOverlayEventHandlers()` to attach event listeners

**closeOverlay(overlay)**

- Removes visibility class and adds dismissing class for exit animation
- Waits for animation duration (300ms) before cleanup
- Returns focus to trigger button
- Removes overlay from DOM
- Removes `overlay-open` class from body to restore scroll

**setupOverlayEventHandlers(overlay)**

- Attaches close button click handler
- Attaches backdrop click handler (click outside to close)
- Attaches ESC key handler to document
- Implements tab trapping to keep focus within modal
- Manages Shift+Tab for reverse navigation

### CSS Architecture

#### Document-Level Styling

```css
/* Body scroll lock - affects entire document */
body.overlay-open {
  overflow: hidden;
}

/* Overlay backdrop - positioned relative to viewport */
.overlay-backdrop {
  position: fixed;  /* Fixed relative to viewport, not parent */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;     /* Above all other content */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Key CSS patterns:**

1. **Fixed positioning:** Overlay uses `position: fixed` to cover entire viewport
2. **High z-index:** Ensures overlay appears above all page content
3. **Flexbox centering:** Modal centered both horizontally and vertically
4. **Viewport units:** `100vw` and `100vh` for full coverage

#### Custom Properties Used

- `--background-color` - Modal background
- `--text-color` - Text color
- `--link-color` - Link and focus outline color
- `--link-hover-color` - Link hover state

#### Key Classes

- `.overlay-trigger` - The button that opens the overlay
- `.overlay-backdrop` - Full-viewport backdrop (document-level)
- `.overlay-modal` - The modal window
- `.overlay-header` - Header section with title
- `.overlay-title` - Title text (h2)
- `.overlay-close` - Close button
- `.overlay-content` - Scrollable content area

#### State Classes

- `.overlay-backdrop--visible` - Fades in the overlay
- `.overlay-backdrop--dismissing` - Fades out the overlay
- `body.overlay-open` - Prevents body scroll when overlay is active (document-level)

#### Responsive Breakpoints

- **≤768px (Tablet/Mobile):** Adjusted padding, border-radius (12px), max-height (90vh)
- **≤480px (Small Mobile):** Further optimized spacing, border-radius (8px), max-height (95vh)

#### Animation Strategy

**CSS Transitions:**

```css
.overlay-backdrop {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.overlay-backdrop--visible {
  opacity: 1;
}

.overlay-modal {
  transform: scale(0.95);
  transition: transform 0.3s ease-in-out;
}

.overlay-backdrop--visible .overlay-modal {
  transform: scale(1);
}
```

**Animation sequence:**

1. Overlay appended to body with `opacity: 0` and `scale(0.95)`
2. `requestAnimationFrame` triggers adding `--visible` class
3. CSS transitions animate opacity to 1 and scale to 1
4. Close sequence reverses: remove `--visible`, add `--dismissing`
5. After 300ms, remove overlay from DOM

### Accessibility Implementation

- **ARIA Roles:** `role="dialog"`, `aria-modal="true"`
- **ARIA Labels:** `aria-labelledby` for title, `aria-label` for close button
- **Keyboard Support:**
  - `ESC` - Close overlay (document-level event listener)
  - `Tab` - Navigate focusable elements (trapped within modal)
  - `Shift+Tab` - Reverse navigation
- **Focus Management:**
  - Focuses close button on open
  - Traps focus within modal using keyboard event handlers
  - Returns focus to trigger button on close

### Event Handling

**Document-level events:**

1. **ESC key** - Attached to `document` to close overlay from anywhere
2. **Backdrop click** - Click outside modal to close
3. **Tab trapping** - Keyboard events on modal to keep focus within

**Cleanup:**

- ESC key handler is removed when overlay closes
- Overlay DOM removed from body
- Body class removed to restore scroll

### Error Handling

If the block structure is invalid:

- Logs detailed error to console for debugging
- Displays a user-friendly error message in place of the block (visible to authors)
- Prevents JavaScript errors from breaking the page
- Example error: "Overlay block requires at least 2 rows with content"

Common validation checks:

- Verifies minimum 2 content rows exist (button text and overlay content)
- Ensures content is not empty
- Validates DOM structure before decoration

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Mobile-friendly responsive design

### Testing

Test with `blocks/overlay/test.html` or use the examples in `/drafts/overlay-examples/index.html`

#### Testing Checklist

- ✅ Button displays correctly
- ✅ Overlay opens with animation
- ✅ Content displays properly
- ✅ Close button works
- ✅ Click outside closes
- ✅ ESC key closes
- ✅ Focus management works
- ✅ Body scroll locks when open
- ✅ Multiple overlays on same page
- ✅ Mobile responsive
- ✅ Keyboard navigation
- ✅ Screen reader compatibility

**Document-level testing:**

- ✅ Overlay appends to `document.body` (not block container)
- ✅ Body gets `overlay-open` class when open
- ✅ Body scroll is locked (test by trying to scroll page)
- ✅ Overlay appears above all page content (header, nav, footer)
- ✅ ESC key works from anywhere on page
- ✅ Opening second overlay while first is open (should work independently)

### Performance Considerations

- Uses CSS transforms for animations (GPU accelerated)
- Event listeners are properly cleaned up on overlay close
- Content is cloned (not moved) to preserve original
- Minimal DOM manipulation
- No external dependencies

**Document-level performance:**

- Only one overlay can be active at a time per trigger
- Overlay is removed from DOM when closed (not just hidden)
- Body class manipulation is lightweight
- ESC key listener cleaned up to prevent memory leaks

### Common Issues

#### Overlay doesn't appear

- Check browser console for errors
- Ensure block has exactly 3 rows: row 1 = "Overlay", row 2 = button text, row 3 = content
- Verify JavaScript is loading
- Check that overlay is being appended to body (inspect DOM)

#### Content is cut off

- Long content automatically becomes scrollable
- Check for CSS conflicts
- Verify `max-height: 80vh` is appropriate

#### Button styling looks wrong

- Check global button styles in `styles/styles.css`
- Verify CSS custom properties are defined
- Check for CSS specificity conflicts

#### Body scroll not locked

- Verify `body.overlay-open` class is added when overlay opens
- Check CSS rule for `body.overlay-open { overflow: hidden; }`
- Inspect body element in DevTools to confirm class is present

#### Overlay appears behind other content

- Verify z-index is 999 on `.overlay-backdrop`
- Check for conflicting z-index values on other elements
- Confirm overlay is appended to body (not nested in container with z-index)

### Customization

To customize the overlay appearance, modify the CSS variables or override styles:

```css
.overlay-modal {
  max-width: 1000px; /* Wider modal */
  border-radius: 24px; /* More rounded */
}

.overlay-backdrop {
  background-color: rgba(0, 0, 0, 0.7); /* Darker backdrop */
}
```

**Document-level customizations:**

```css
/* Change scroll lock behavior */
body.overlay-open {
  overflow: hidden;
  position: fixed; /* Prevents scroll jump on some mobile browsers */
  width: 100%;
}

/* Adjust z-index if conflicts with other fixed elements */
.overlay-backdrop {
  z-index: 1000; /* Increase if needed */
}
```

## Comparison with Modal Block

If your project has both overlay and modal blocks, here's how they differ:

| Feature | Overlay Block | Modal Block |
|---------|---------------|-------------|
| **Positioning** | Document-level (appends to body) | Container-level (within block) |
| **Scroll Lock** | Yes (body scroll locked) | Depends on implementation |
| **Z-Index** | 999 (above all content) | Scoped to container |
| **Use Case** | Full-page interruption, important info | In-page content, contextual info |
| **Close Methods** | Button, backdrop, ESC key | Varies by implementation |
| **Backdrop** | Full viewport | Depends on implementation |

**When to use Overlay:**

- Need to cover entire page including header/footer
- Critical information that requires user attention
- Legal notices, terms, privacy policies

**When to use Modal:**

- Contextual information within a section
- Less critical content
- Multiple modals on same page without conflicts

## Examples

See [drafts/overlay-examples/index.html](../../drafts/overlay-examples/index.html) for comprehensive examples including:

1. Simple text content
2. Rich content with links
3. Contact information
4. Announcements
5. Long scrollable content
6. Multiple overlays on same page

## Version History

- **v1.0.0** (2025-01-17) - Initial release
  - Button trigger with customizable text
  - Full-viewport overlay with backdrop
  - Document-level DOM manipulation
  - Animated entrance and exit
  - Keyboard navigation and accessibility
  - Body scroll locking
  - Mobile responsive design
