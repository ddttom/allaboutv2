# Overlay Block

The Overlay block creates a button that, when clicked, displays content in a full-viewport overlay with an animated entrance and close button.

## Author Documentation

### What is the Overlay Block?

The Overlay block allows you to display additional information without navigating away from the current page. When users click the button, a modal overlay appears with your content, complete with:

- A header showing the button text
- Your custom content (text, images, links, lists, etc.)
- An animated close button (X) in the top right
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
└── EXAMPLE.md       # Google Docs authoring example
```

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

- **createOverlay(title, contentElement)** - Builds the overlay DOM structure with close button (always visible)
- **showOverlay(overlay, triggerButton)** - Displays overlay with animation and sets up event handlers
- **closeOverlay(overlay)** - Hides overlay with animation and cleans up
- **setupOverlayEventHandlers(overlay)** - Manages keyboard, click, and focus events

### CSS Architecture

#### Custom Properties Used
- `--background-color` - Modal background
- `--text-color` - Text color
- `--link-color` - Link and focus outline color
- `--link-hover-color` - Link hover state

#### Key Classes
- `.overlay-trigger` - The button that opens the overlay
- `.overlay-backdrop` - Full-viewport backdrop
- `.overlay-modal` - The modal window
- `.overlay-header` - Header section with title
- `.overlay-title` - Title text (h2)
- `.overlay-close` - Close button
- `.overlay-content` - Scrollable content area

#### State Classes
- `.overlay-backdrop--visible` - Fades in the overlay
- `.overlay-backdrop--dismissing` - Fades out the overlay
- `body.overlay-open` - Prevents body scroll when overlay is active

#### Responsive Breakpoints
- **≤768px (Tablet/Mobile):** Adjusted padding, border-radius (12px), max-height (90vh)
- **≤480px (Small Mobile):** Further optimized spacing, border-radius (8px), max-height (95vh)

### Accessibility Implementation

- **ARIA Roles:** `role="dialog"`, `aria-modal="true"`
- **ARIA Labels:** `aria-labelledby` for title, `aria-label` for close button
- **Keyboard Support:**
  - `ESC` - Close overlay
  - `Tab` - Navigate focusable elements (trapped within modal)
  - `Shift+Tab` - Reverse navigation
- **Focus Management:**
  - Focuses close button on open
  - Traps focus within modal
  - Returns focus to trigger button on close

### Event Handling

1. **Click outside** - Closes overlay
2. **ESC key** - Closes overlay
3. **Close button** - Closes overlay
4. **Tab trapping** - Keeps focus within modal while open

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

### Performance Considerations

- Uses CSS transforms for animations (GPU accelerated)
- Event listeners are properly cleaned up
- Content is cloned (not moved) to preserve original
- Minimal DOM manipulation
- No external dependencies

### Common Issues

#### Overlay doesn't appear
- Check browser console for errors
- Ensure block has exactly 3 rows: row 1 = "Overlay", row 2 = button text, row 3 = content
- Verify JavaScript is loading

#### Content is cut off
- Long content automatically becomes scrollable
- Check for CSS conflicts
- Verify `max-height: 80vh` is appropriate

#### Button styling looks wrong
- Check global button styles in `styles/styles.css`
- Verify CSS custom properties are defined
- Check for CSS specificity conflicts

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
  - Animated entrance and exit
  - Keyboard navigation and accessibility
  - Mobile responsive design
