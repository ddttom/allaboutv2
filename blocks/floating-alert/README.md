# Floating Alert Block

A modern, accessible floating alert block that displays important messages in a glassmorphic modal overlay. The alert appears immediately when the page loads and can be dismissed by clicking the close button, clicking outside the modal, or pressing the Escape key.

## Features

- Immediate appearance on page load with smooth animations
- Glassmorphic styling with sparkle effects
- Responsive design that works on all screen sizes
- Full keyboard navigation support
- ARIA roles for accessibility
- Persistent dismissal state using localStorage
- Support for links within the alert content
- Click outside to dismiss
- Escape key support
- Beautiful fade animations

## Usage

| Floating Alert |
| -------------- |
| Your important message here. You can include [links](https://example.com) in the text. |

## Configuration

### CSS Variables

The block can be customized using CSS variables:

- `--alert-bg-color`: Background color (default: rgba(255, 165, 0, 0.15))
- `--alert-border-color`: Border color (default: rgba(255, 165, 0, 0.3))
- `--alert-text-color`: Text color (default: #333)
- `--alert-shadow-color`: Shadow color (default: rgba(0, 0, 0, 0.1))
- `--alert-sparkle-color`: Sparkle effect color (default: rgba(255, 255, 255, 0.8))
- `--alert-transition-duration`: Animation duration (default: 0.3s)
- `--alert-border-radius`: Border radius (default: 12px)
- `--alert-max-width`: Maximum width (default: 600px)
- `--alert-padding`: Padding (default: 1.5rem)
- `--alert-backdrop-blur`: Blur effect (default: 10px)

## Accessibility

- Uses ARIA roles and attributes for screen readers
- Full keyboard navigation support
- Focus management within the modal
- Clear focus indicators
- Proper heading hierarchy
- Semantic HTML structure

## Behavior

1. The alert appears immediately when the page loads
2. It can be dismissed by:
   - Clicking the X button
   - Clicking outside the modal
   - Pressing the Escape key
3. Once dismissed, it won't appear again until the page is refreshed
4. The original content remains visible below the alert
5. Links within the alert are fully functional

## Performance

- Uses CSS transforms for smooth animations
- Efficient event handling
- Minimal DOM manipulation
- Optimized sparkle effect
- No external dependencies

## Browser Compatibility

- Works in all modern browsers
- Graceful fallback for older browsers
- Supports backdrop-filter with fallback
- Responsive design for all screen sizes

## Troubleshooting

1. If the alert doesn't appear:
   - Check if it was previously dismissed (clear localStorage)
   - Verify the block is properly placed in the document
   - Check browser console for errors

2. If animations are not smooth:
   - Ensure the browser supports CSS transforms
   - Check for conflicting CSS
   - Verify no heavy scripts are running

3. If accessibility features aren't working:
   - Verify proper ARIA attributes
   - Test with screen readers
   - Check keyboard navigation

## Authoring

When creating content in Google Docs or Microsoft Word:

1. Use a single table with one cell
2. Include your message in the cell
3. Add links using standard markdown syntax
4. Keep the message concise and clear
5. Use proper heading hierarchy if needed

## Suggestions

- Keep messages short and actionable
- Use links sparingly and make them descriptive
- Consider mobile users when writing content
- Test the alert with different content lengths
- Verify the alert works with your site's color scheme

## Performance Considerations

- The alert uses minimal resources
- Animations are hardware-accelerated
- Sparkle effect is optimized for performance
- No external dependencies to load
- Efficient event handling
- Minimal DOM operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS/Android)

Note: The glassmorphic effect may appear differently in older browsers, but the functionality remains intact. 
