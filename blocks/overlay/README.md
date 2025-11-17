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

The Overlay block requires exactly **2 rows**:

| Overlay |
| ------- |
| **Button Text** |
| **Overlay Content** |

**Row 1:** The text that appears on the button (e.g., "Learn More", "View Details", "Contact Us")

**Row 2:** The content that displays inside the overlay when clicked

#### Simple Example

| Overlay |
| ------- |
| Learn More |
| Welcome to our platform! Discover how we can help you achieve your goals with our comprehensive solutions. |

This creates a "Learn More" button that shows the welcome message in an overlay.

#### Rich Content Example

You can include formatted content, lists, links, and more:

| Overlay |
| ------- |
| View Features |
| **Our Amazing Features**<br><br>• Real-time Collaboration<br>• Advanced Analytics<br>• Enterprise Security<br>• 24/7 Support<br><br>[Learn More](https://example.com) |

#### Multiple Overlays

You can have multiple overlay blocks on the same page - each will work independently:

| Overlay |
| ------- |
| About Us |
| Founded in 2020, we've been dedicated to providing exceptional service... |

| Overlay |
| ------- |
| Contact |
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
- ✅ **Focus management:** Focus moves to the close button when opened, returns to the trigger button when closed
- ✅ **Clear close options:** Close button, click outside, or press ESC

### Styling

The Overlay block uses your site's global styles:

- **Button:** Uses standard button styling (rounded, blue background)
- **Overlay:** White background, rounded corners, drop shadow
- **Typography:** Inherits your site's fonts and colors
- **Responsive:** Automatically adjusts for mobile, tablet, and desktop

### Technical Details

#### Maximum Width
The overlay content has a maximum width of 800px for optimal readability.

#### Animation Duration
Fade-in and fade-out animations are 0.3 seconds (300ms).

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
1. Extracts button text from row 1
2. Extracts overlay content from row 2
3. Creates trigger button
4. Handles overlay creation and event management

#### Configuration Object

```javascript
const CONFIG = {
  animationDuration: 300,              // Animation timing (ms)
  backdropColor: 'rgba(0, 0, 0, 0.5)', // Backdrop transparency
  borderRadius: '16px',                 // Modal corner radius
  maxWidth: '800px',                    // Maximum modal width
  closeButtonLabel: 'Close overlay',    // Accessibility label
};
```

### Key Functions

- **createOverlay(title, contentElement)** - Builds the overlay DOM structure
- **showOverlay(overlay, triggerButton)** - Displays overlay with animation
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
- `.overlay-container` - Full-viewport backdrop
- `.overlay-modal` - The modal window
- `.overlay-header` - Header section with title
- `.overlay-title` - Title text (h2)
- `.overlay-close` - Close button
- `.overlay-content` - Scrollable content area

#### State Classes
- `.overlay-container--visible` - Fades in the overlay
- `.overlay-container--dismissing` - Fades out the overlay
- `body.overlay-open` - Prevents body scroll when overlay is active

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
- Logs error to console
- Displays user-friendly error message
- Prevents JavaScript errors from breaking the page

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
- Ensure block has 2 rows with content
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

.overlay-container {
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
