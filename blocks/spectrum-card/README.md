---
title: "Spectrum Card Block"
description: "Documentation for the spectrum-card EDS block component"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Spectrum Card Block

## Overview

A build-enhanced EDS block that leverages Adobe Spectrum Web Components to display professional, accessible card interfaces. The Spectrum Card block integrates Adobe's design system directly into Edge Delivery Services, providing consistent styling, robust accessibility, and enterprise-grade UI components without custom CSS.

## Content Structure

The Spectrum Card block uses EDS table structure to define card content:

`Basic Card Structure`
`| spectrum-card |`
`| :------------ |`
`| https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png |`
`| Amazing Features |`
`| Discover incredible features that make our product stand out |`
`| Learn More |`

Each row after the block name defines:

- Row 1: Image URL (required)
- Row 2: Card title (required)
- Row 3: Description text (required)
- Row 4: Action button text (required)

### Custom Data Source

You can also load cards from a query-index.json endpoint:

`Dynamic Card Loading`
`| spectrum-card |`
`| :------------ |`
`| /products/query-index.json |`

This fetches card data from the specified query-index.json and renders multiple cards automatically with numbered badges and modal overlays.

## Variations

The Spectrum Card block supports content-based and styling variations:

### Card Content Variations

- **Product Showcase**: Display products with specifications
- **Team Profiles**: Show team member information
- **Feature Highlights**: Present key product features
- **Service Offerings**: Highlight different services
- **Case Studies**: Present customer success stories

### Spectrum Variant Styles

The block uses the `standard` card variant by default, which ensures footer and action buttons are always visible. Other Spectrum card variants include:

- **standard**: Full card with footer (default)
- **gallery**: Image-focused cards
- **quiet**: Minimal styling without borders

## Configuration Options

The Spectrum Card block is configured through both the source build and EDS content structure:

### Build Configuration

Located in `/build/spectrum-card/`:

- **Package.json**: Defines Spectrum dependencies and build scripts
- **Vite.config.js**: Configures bundling and optimization
- **Build Output**: Single JS file with all CSS injected

### Content Configuration

- **Static Content**: Define cards directly in EDS document tables
- **Dynamic Content**: Load from query-index.json endpoints
- **Image Sources**: Support for DAM, external URLs, and media library
- **Button Actions**: Currently display-only (future: clickable actions)

### Spectrum Theme Configuration

The block automatically injects Spectrum theme context:

- **Theme**: Light theme by default
- **Scale**: Medium scale for optimal readability
- **Color**: Lightest color scheme
- **System**: spectrum theme system

### CSS Variables (Spectrum)

The block uses Adobe Spectrum CSS variables:

`Spectrum Theme Variables`
`--spectrum-global-color-gray-*`
`--spectrum-sans-font-family-stack`
`--spectrum-global-dimension-size-*`
`--spectrum-alias-background-color-*`

## Accessibility Considerations

The Spectrum Card block provides enterprise-grade accessibility through Adobe Spectrum:

### Built-in Spectrum Accessibility

- **Semantic HTML**: Proper HTML5 semantic structure
- **ARIA Support**: Comprehensive ARIA attributes built into Spectrum components
- **Keyboard Navigation**: Full keyboard support via Spectrum
- **Focus Management**: Visible focus indicators on all interactive elements
- **Screen Reader Support**: Tested with NVDA, JAWS, and VoiceOver

### Image Accessibility

- **Alt Text**: Images should have descriptive alt text
- **Lazy Loading**: Native lazy loading with proper loading attributes
- **Responsive Images**: Proper srcset for different viewport sizes
- **Format Support**: WebP with PNG/JPEG fallbacks

### Content Accessibility

- **Readable Text**: Sufficient contrast ratios (WCAG AA compliant)
- **Scalable Text**: Supports browser text scaling and zoom
- **Color Independence**: Information not conveyed by color alone
- **Clear Hierarchy**: Proper heading structure and content flow

### Modal Accessibility (Dynamic Content Mode)

When loading from query-index.json:

- **Focus Trapping**: Focus contained within modal
- **ESC Key Support**: Close modals with ESC key
- **Return Focus**: Focus returns to trigger element
- **Background Interaction**: Prevented when modal is open

## Performance Impact

The Spectrum Card block has specific performance characteristics due to Spectrum Web Components:

### Loading Characteristics

- **Bundle Size**: ~500KB (minified, includes all Spectrum dependencies)
- **Initial Load**: Framework initialization required
- **Web Components**: Custom element registration overhead
- **CSS-in-JS**: All styles injected from JavaScript
- **First Paint**: Slightly slower than vanilla blocks due to component registration

### Performance Optimization Strategies

- **Single Bundle**: All dependencies bundled into one file
- **Tree Shaking**: Vite removes unused Spectrum components
- **Lazy Loading**: Images use native lazy loading
- **Component Caching**: Spectrum components cached after registration
- **Modern Build**: Optimized for modern browsers

### Performance Metrics

Expected performance characteristics:

- **Bundle Download**: 150-200KB gzipped
- **First Contentful Paint**: 1.5-2.5s (including Spectrum initialization)
- **Time to Interactive**: 2-3s (custom element registration)
- **Memory Usage**: 15-25MB for Spectrum runtime
- **Subsequent Renders**: Fast after initial component registration

### Performance Best Practices

1. Lazy load images with appropriate loading attributes
2. Optimize images before use (WebP format recommended)
3. Use CDN for bundle delivery with aggressive caching
4. Consider number of cards per page (10-20 optimal)
5. Monitor bundle size when adding Spectrum components
6. Leverage browser caching with hash-based bundle names

## Dependencies

The Spectrum Card block has significant dependencies due to Adobe Spectrum integration:

### Framework Dependencies

- **@spectrum-web-components/theme**: Theme system and CSS variables
- **@spectrum-web-components/card**: Card component with variants
- **@spectrum-web-components/button**: Action button components
- **@spectrum-web-components/icons-workflow**: Icon system

### Build Dependencies

The block requires a build process:

- **Vite**: Modern build tool and bundler (v5.2.0+)
- **Node.js**: 14+ for build process
- **npm**: Package management

### EDS Framework Dependencies

- **EDS Block Structure**: Standard EDS block decoration pattern
- **EDS Styles**: Base EDS styling system
- **Browser APIs**: Web Components, Custom Elements

### Browser Compatibility

Minimum browser requirements:

- **Chrome 67+**: Full Web Components support
- **Firefox 63+**: Complete custom elements support
- **Safari 12.1+**: Web Components and Shadow DOM
- **Edge 79+**: Chromium-based Edge with full support

**Note**: No IE11 support due to Web Components requirement

### Component Architecture

**Build Component Notice**: This is a build-enhanced block developed in `/build/spectrum-card/` and deployed to `/blocks/spectrum-card/`. The build process bundles Adobe Spectrum Web Components into a single optimized file.

## Known Limitations

Current limitations and constraints of the Spectrum Card block:

### Functional Limitations

1. **Bundle Size**: Large bundle (~500KB) due to Spectrum dependencies
2. **Static Actions**: Button clicks don't have configurable actions yet
3. **Theme Options**: Limited to light theme currently
4. **Single Variant**: Uses `standard` variant only
5. **No Server Rendering**: Client-side only (no SSR)

### Technical Constraints

- **Build Required**: Cannot edit directly, must rebuild from source
- **Web Components Required**: Browsers must support custom elements
- **Shadow DOM**: Uses Shadow DOM which can complicate styling overrides
- **Bundle Updates**: Requires rebuild and redeploy for changes
- **Framework Lock-in**: Tightly coupled to Spectrum Web Components

### Integration Limitations

- **Style Isolation**: Shadow DOM isolates styles from EDS page
- **Event Bubbling**: Some events don't bubble through Shadow DOM
- **Global Styles**: EDS global styles don't penetrate Shadow DOM
- **Theme Switching**: No runtime theme switching support

### Content Limitations

- **Fixed Structure**: Requires specific table structure
- **Image Required**: Cards must have images
- **Static Content**: No real-time data updates
- **Button Limitations**: No configurable click actions

### Performance Limitations

- **Initial Load**: Slower than vanilla blocks due to framework overhead
- **Memory Usage**: Higher memory footprint from Web Components
- **Bundle Size**: Large initial download
- **Registration Time**: Custom element registration adds latency

## Technical Implementation

### Component Architecture

The block uses Web Components with Shadow DOM:

**Web Components Pattern**: Uses Adobe Spectrum Web Components which are built on LitElement and provide encapsulated, reusable UI components with built-in accessibility.

### Loading Sequence

1. **Block Decoration**: EDS calls `decorate()` function
2. **Theme Injection**: Creates `<sp-theme>` wrapper if needed
3. **Component Registration**: Spectrum components register as custom elements
4. **Card Creation**: Creates `<sp-card>` elements with content
5. **Grid Layout**: Applies responsive grid CSS
6. **Image Loading**: Lazy loads images as they enter viewport

### Build Process

`Build Workflow`
`# In /build/spectrum-card/`
`npm install                    # Install dependencies`
`npm run build                  # Build with Vite`
`# Output:`
`#   dist/spectrum-card.js      # Bundled JavaScript`
`#   (CSS embedded in JS)`
`# Deploy:`
`#   Copy to /blocks/spectrum-card/`

### File Structure

`Block Directory Structure`
`/build/spectrum-card/           # Source directory`
`├── spectrum-card.js            # Source implementation`
`├── vite.config.js              # Vite build configuration`
`├── package.json                # Dependencies and scripts`
`├── test.html                   # Development test page`
`└── README.md                   # Build documentation`
`/blocks/spectrum-card/          # Deployed directory`
`├── spectrum-card.js            # Built bundle (deployed)`
`├── spectrum-card.css           # Empty (CSS in JS)`
`├── README.md                   # This documentation`
`├── EXAMPLE.md                  # Usage examples`
`└── test.html                   # EDS test page`

### Key Implementation Features

- **CSS Injection**: All styles injected from JavaScript
- **Theme Context**: Automatic `<sp-theme>` wrapper injection
- **Grid Layout**: Responsive grid CSS applied programmatically
- **Component Encapsulation**: Shadow DOM provides style isolation
- **Lazy Loading**: Native lazy loading for images

## Development Workflow

### Building from Source

Work in the `/build/spectrum-card/` directory:

`Development Commands`
`cd /build/spectrum-card/`
`npm install`
`npm run dev        # Vite dev server with HMR`
`npm run build      # Production build`

### Testing the Block

Test in both build and deployed contexts:

`Testing Workflow`
`# Test build version`
`npm run dev`
`# Open: http://localhost:5173`
`# Test deployed version`
`npm run debug      # From project root`
`# Open: http://localhost:3000/blocks/spectrum-card/test.html`

### Deployment Process

1. **Build**: Run `npm run build` in `/build/spectrum-card/`
2. **Copy**: Copy `dist/spectrum-card.js` to `/blocks/spectrum-card/`
3. **Touch CSS**: Create empty `spectrum-card.css` (EDS requirement)
4. **Test**: Verify block works in EDS context
5. **Deploy**: Push to repository

### Updating Spectrum Dependencies

When updating Spectrum components:

`Update Workflow`
`npm update @spectrum-web-components/*`
`npm run build`
`# Test thoroughly`
`# Deploy updated bundle`

## Troubleshooting

### Common Issues

**Cards Not Displaying**

- Check browser console for Web Components support errors
- Verify bundle loaded successfully (check Network tab)
- Ensure content structure matches expected format
- Check that custom elements registered (look for `<sp-card>` in DOM)

**Styling Not Applied**

- Verify `<sp-theme>` wrapper exists in DOM
- Check that CSS is injected (inspect Shadow DOM)
- Ensure Spectrum theme imports are correct
- Verify no conflicting global styles

**Images Not Loading**

- Check image URLs are absolute and accessible
- Verify proper image formats (WebP, PNG, JPEG)
- Ensure lazy loading attributes are correct
- Check browser console for CORS errors

**Action Buttons Not Visible**

- Verify using `standard` card variant (not `quiet`)
- Check that button text is provided in content
- Inspect Shadow DOM to see if button rendered
- Verify Spectrum button component loaded

**Performance Issues**

- Check bundle size and network conditions
- Verify images are optimized
- Monitor memory usage with many cards
- Consider reducing number of cards per page
- Check for console errors or warnings

## Best Practices

### Content Authoring

- **Image Optimization**: Use WebP format, compress images
- **Concise Text**: Keep titles short (2-6 words), descriptions brief
- **Meaningful Actions**: Use clear, action-oriented button text
- **Consistent Images**: Use similar aspect ratios across cards

### Implementation

- **Bundle Size**: Monitor Spectrum dependencies, only import what's needed
- **Performance**: Lazy load images, limit cards per page
- **Testing**: Test across browsers and devices
- **Accessibility**: Verify with screen readers and keyboard navigation

### Maintenance

- **Updates**: Keep Spectrum dependencies updated for security
- **Testing**: Regression test after Spectrum updates
- **Monitoring**: Track bundle size over time
- **Documentation**: Keep README synchronized with implementation

## Future Enhancements

Potential improvements for the Spectrum Card block:

- **Clickable Cards**: Add configurable actions to buttons
- **Theme Switching**: Support dark theme and theme variants
- **More Variants**: Support gallery and quiet card variants
- **Card Layouts**: Additional layout options (list view, compact)
- **Animation**: Spectrum motion system integration
- **Data Binding**: Real-time data updates and reactivity
- **Batch Loading**: Pagination or infinite scroll for large datasets
- **Customization**: CSS variable overrides for brand colors

## Support Resources

For technical questions and support:

- [EDS Documentation](https://www.aem.live/docs/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Build Source](../../build/spectrum-card/) - Source code and build config
- [Test Page](test.html) - Local testing environment

## Metadata

| Metadata | Value |
|----------|-------|
| Block Name | spectrum-card |
| Type | Build-Enhanced Block |
| Framework | Adobe Spectrum Web Components |
| Build Tool | Vite |
| Bundle Size | ~500KB (150-200KB gzipped) |
| Browser Support | Modern browsers with Web Components |
| Build Required | Yes |
| EDS Compatible | Yes |
| Version | 1.0.0 |
