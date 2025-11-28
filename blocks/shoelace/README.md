# Shoelace Block

## Purpose

The Shoelace block integrates the Shoelace Web Components library into Adobe Edge Delivery Services (EDS), providing access to a comprehensive collection of professionally-designed, accessible UI components. This block enables authors to leverage modern web components including buttons, dialogs, drawers, tabs, cards, and many other interactive elements without requiring custom development.

## How It Works

The block loads the Shoelace library from CDN and initializes the auto-loader, which automatically imports component definitions as they're encountered in the DOM. The block uses Web Components standards with Shadow DOM encapsulation, ensuring styles don't leak and components remain portable across different contexts.

**Key Technical Details:**
- Loads Shoelace CSS theme (light theme by default)
- Loads Shoelace auto-loader module for automatic component registration
- Creates a simple demonstration button as proof of concept
- All Shoelace components use the `sl-` prefix (e.g., `sl-button`, `sl-dialog`)
- Supports 50+ components from the Shoelace library

## Usage

### Basic Usage

`Basic Shoelace Button`
`|Shoelace|`
`|---|`

### With Custom Components

Authors can extend the block JavaScript to include any Shoelace component by adding the appropriate Web Component tags.

### Multiple Components

`Multiple Shoelace Components`
`|Shoelace|`
`|---|`

## Variations

Currently, the block supports a single default variation. Future enhancements could include:
- **Theme variations**: `Shoelace (dark)`, `Shoelace (high-contrast)`
- **Component presets**: `Shoelace (dialog)`, `Shoelace (form)`, `Shoelace (navigation)`
- **Size variations**: `Shoelace (compact)`, `Shoelace (comfortable)`

## Content Model

### Markdown Structure

`Content Model Example`
`|Shoelace|`
`|---|`

### HTML Output

The block transforms into a container with Shoelace Web Components:

`HTML Structure`
`<div class="shoelace">`
`  <sl-button>Click me</sl-button>`
`</div>`

## Component Architecture

### JavaScript Structure

The block follows EDS patterns with a simple decoration function:

1. **Load Shoelace CSS theme** - Imports light theme stylesheet
2. **Load auto-loader module** - Enables automatic component registration
3. **Create example component** - Demonstrates Web Component usage
4. **Append to block** - Adds components to block container

### Web Components Integration

Shoelace uses Web Components standards:
- **Custom Elements** - Define new HTML tags with `sl-` prefix
- **Shadow DOM** - Encapsulate styles and markup
- **ES Modules** - Modern JavaScript module system
- **Auto-loader** - Lazy loads component definitions on demand

### Available Components

Shoelace provides 50+ components including:
- **Buttons**: `sl-button`, `sl-button-group`, `sl-icon-button`
- **Dialogs**: `sl-dialog`, `sl-drawer`, `sl-alert`
- **Forms**: `sl-input`, `sl-select`, `sl-checkbox`, `sl-radio`
- **Navigation**: `sl-tab`, `sl-tab-group`, `sl-menu`, `sl-dropdown`
- **Display**: `sl-card`, `sl-badge`, `sl-avatar`, `sl-skeleton`
- **Feedback**: `sl-progress-bar`, `sl-spinner`, `sl-rating`

Complete documentation: https://shoelace.style/

## Styling

### CSS Variables

The block inherits Shoelace's extensive CSS custom property system:

`CSS Variables`
`/* Shoelace provides 100+ CSS variables */`
`.shoelace {`
`  --sl-color-primary-600: #1e40af;`
`  --sl-border-radius-medium: 0.5rem;`
`  --sl-spacing-medium: 1rem;`
`}`

### Theme Customization

Override Shoelace design tokens to match brand guidelines:

`Theme Customization`
`.shoelace {`
`  --sl-color-primary-50: #f0f9ff;`
`  --sl-color-primary-500: #3b82f6;`
`  --sl-color-primary-600: #2563eb;`
`  --sl-font-sans: system-ui, -apple-system, sans-serif;`
`}`

### Shadow DOM Styling

Shoelace components use Shadow DOM, which requires CSS parts and custom properties for styling:

`Styling Shadow DOM`
`/* Use ::part() to style internal elements */`
`sl-button::part(base) {`
`  border-radius: 2rem;`
`}`
`/* Use CSS variables for component properties */`
`sl-button {`
`  --sl-spacing-x-small: 0.5rem;`
`}`

## Accessibility

Shoelace components are built with accessibility as a core principle:

### ARIA Support
- All interactive components include proper ARIA roles, states, and properties
- Keyboard navigation follows ARIA Authoring Practices Guide (APG)
- Screen reader announcements for dynamic content changes
- Focus management for complex components (dialogs, menus)

### Keyboard Navigation
- Tab navigation through all interactive elements
- Arrow key navigation in component groups (tabs, menus)
- Escape key to close dialogs and dropdowns
- Enter/Space to activate buttons and controls

### Visual Accessibility
- High contrast mode support
- Respects prefers-reduced-motion media query
- Adequate color contrast ratios (WCAG AA compliant)
- Focus indicators on all interactive elements
- Scalable text using relative units

### Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard-only navigation works completely
- Check color contrast with browser developer tools
- Test with reduced motion and high contrast modes

## Performance

### Loading Strategy

The block uses Shoelace's auto-loader for optimal performance:
- **CDN delivery** - Fast global content delivery
- **Lazy loading** - Components load only when used
- **Tree shaking** - Only used components are downloaded
- **HTTP/2** - Parallel component requests

### Optimization Tips

`Performance Best Practices`
`// Preload critical components`
`await loadScript('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/components/button/button.js', {`
`  type: 'module'`
`});`
`// Use local hosting for production`
`// Download Shoelace and serve from /libs/shoelace/`

### Bundle Size

- **Base CSS**: ~50KB (light theme)
- **Auto-loader**: ~5KB
- **Per component**: 2-15KB (loaded on demand)
- **Total initial**: ~55KB for minimal setup

### Core Web Vitals Impact

- **LCP**: Minimal impact (components lazy load)
- **FID**: Good (Web Components are performant)
- **CLS**: Excellent (components define dimensions)

## Browser Compatibility

Shoelace supports all modern browsers:

### Supported Browsers
- Chrome/Edge 88+ ✓
- Firefox 86+ ✓
- Safari 14+ ✓
- Opera 74+ ✓

### Required Features
- Custom Elements v1
- Shadow DOM v1
- ES Modules
- CSS Custom Properties

### Polyfills

Not required for supported browsers. For older browsers, consider:
- Web Components polyfills from webcomponents.org
- Note: EDS typically targets modern browsers only

## Dependencies

### External Dependencies
- **Shoelace**: v2.20.1 from jsDelivr CDN
- **CSS Theme**: Shoelace light theme stylesheet
- **Auto-loader**: Shoelace component auto-loader

### EDS Dependencies
- `/scripts/aem.js` - For `loadCSS()` and `loadScript()` utilities

### Version Management

`Update Shoelace Version`
`// In shoelace.js, update CDN URLs:`
`const SHOELACE_VERSION = '2.20.1';`
`await loadCSS(\`https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@\${SHOELACE_VERSION}/cdn/themes/light.css\`);`

## Development

### Local Development

1. Start the EDS development server:
   `npm run debug`

2. Create test content at `/blocks/shoelace/demo.md`

3. View at: http://localhost:3000/blocks/shoelace/demo

### Adding Components

Extend the decorate function to add more Shoelace components:

`Adding Components`
`export default async function decorate(block) {`
`  // Load Shoelace`
`  await loadCSS('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css');`
`  await loadScript('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js', {`
`    type: 'module'`
`  });`
`  // Create dialog component`
`  const dialog = document.createElement('sl-dialog');`
`  dialog.setAttribute('label', 'Welcome');`
`  dialog.innerHTML = '<p>Welcome to Shoelace!</p>';`
`  block.appendChild(dialog);`
`}`

### Testing

Use the provided test.html file for browser-based testing:

`Test File Usage`
`open /Users/tomcranstoun/Documents/GitHub/allaboutV2/blocks/shoelace/test.html`

## Common Issues

### Components Not Rendering
**Problem**: Shoelace components appear as plain HTML tags
**Solution**: Ensure auto-loader script loads successfully and uses `type="module"`

### Styling Not Applied
**Problem**: Components render but lack Shoelace styling
**Solution**: Verify CSS theme loads before components render

### Shadow DOM Debugging
**Problem**: Cannot inspect component internals in DevTools
**Solution**: Enable "Show user agent shadow DOM" in Chrome DevTools settings

### Version Conflicts
**Problem**: Multiple Shoelace versions loaded on same page
**Solution**: Use single global Shoelace instance, coordinate with other blocks

### CORS Errors
**Problem**: CDN resources blocked by CORS policy
**Solution**: Use jsDelivr or unpkg CDNs which support CORS

## Related Blocks

- **Custom components** - For simpler, project-specific UI elements
- **Web Components** - Generic Web Components integration block
- **Design system** - Custom design system implementation

## Resources

- **Shoelace Documentation**: https://shoelace.style/
- **Component Gallery**: https://shoelace.style/components
- **Getting Started**: https://shoelace.style/getting-started/installation
- **GitHub Repository**: https://github.com/shoelace-style/shoelace
- **Web Components Standards**: https://www.webcomponents.org/

## Future Enhancements

### Planned Features
- [ ] Configuration object for theme selection
- [ ] Support for dark theme variation
- [ ] Custom icon library integration
- [ ] Form validation helpers
- [ ] Animation utilities
- [ ] Localization support

### Potential Variations
- [ ] `Shoelace (dark)` - Dark theme variant
- [ ] `Shoelace (compact)` - Compact spacing theme
- [ ] `Shoelace (forms)` - Pre-configured form components
- [ ] `Shoelace (dialogs)` - Dialog and drawer presets

### Integration Ideas
- [ ] Form builder integration
- [ ] CMS component picker
- [ ] Visual component editor
- [ ] Theme customization UI
- [ ] Component library browser
