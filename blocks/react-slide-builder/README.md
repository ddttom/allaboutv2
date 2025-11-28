# React Slide Builder Block

## Overview

A framework-integrated EDS block that enables React-based slide building and presentation capabilities within Adobe Edge Delivery Services. The React Slide Builder acts as a loader block that bootstraps a pre-built React application into your EDS page, providing a rich interactive slide creation and management interface.

## Content Structure

The React Slide Builder block uses a simple table structure in your EDS document:

`Basic Usage`
`| react-slide-builder |`
`| :----------------- |`

This minimal configuration will load the React application and render it within the block container.

## Variations

The React Slide Builder block currently supports a single implementation focused on slide creation and presentation. Future variations may include:

- **Presentation Mode**: Display-only mode for viewing created slides
- **Edit Mode**: Full editing capabilities with toolbar
- **Gallery Mode**: Grid view of multiple slide decks
- **Compact Mode**: Minimized interface for embedded contexts

## Configuration Options

The block is configured through the bundled React application. Key configuration aspects include:

### JavaScript Bundle Configuration

The block loads the React bundle from a static location:
- **Bundle Path**: `/static/js/slide-builder-main.js`
- **Module Type**: ES Module
- **Loading Strategy**: Asynchronous script injection

### Stylesheet Configuration

The block loads styles from a static location:
- **Style Path**: `/static/css/slide-builder-main.css`
- **Loading Strategy**: Link element injection

### Container Configuration

The block creates a dedicated container for the React app:
- **Container ID**: `react-slide-app`
- **Minimum Height**: 400px (defined in CSS)
- **Width**: 100% of block width

### CSS Custom Properties

`CSS Variables`
`.react-slide-builder {`
`  --min-height: 400px;`
`  --container-width: 100%;`
`}`

## Accessibility Considerations

The React Slide Builder block implements accessibility through both the EDS wrapper and the React application:

### Block-Level Accessibility

- **Semantic Structure**: Uses standard EDS block structure with proper HTML semantics
- **Container Labeling**: React app container has appropriate ID for ARIA association
- **Focus Management**: Proper focus flow into and out of the React application

### React Application Accessibility

The bundled React application should implement:
- **Keyboard Navigation**: Full keyboard support for all slide operations
- **Screen Reader Support**: ARIA labels and live regions for dynamic content
- **Focus Management**: Proper focus handling during slide transitions
- **Color Contrast**: WCAG AA compliant color combinations
- **Text Scaling**: Support for browser text scaling and zoom

### Known Accessibility Considerations

- Ensure React app implements proper ARIA landmarks
- Verify keyboard navigation works without mouse
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Validate color contrast ratios meet WCAG standards

## Performance Impact

The React Slide Builder block has performance considerations due to its framework-based architecture:

### Loading Characteristics

- **Bundle Size**: React framework + application code (typically 150-300KB gzipped)
- **Initial Load**: Requires downloading and parsing JavaScript bundle
- **Render Time**: React initialization and first render add overhead
- **CSS Loading**: Additional stylesheet request and parse time

### Performance Optimization Strategies

- **Code Splitting**: Bundle should use React lazy loading for route-based splitting
- **Tree Shaking**: Build process removes unused code
- **Compression**: Serve bundles with gzip or brotli compression
- **Caching**: Leverage browser caching with versioned bundle names

### Performance Metrics

Expected performance characteristics:
- **First Contentful Paint**: 1.5-2.5s (depending on bundle size)
- **Time to Interactive**: 2-3s (React hydration time)
- **Bundle Load Time**: 500ms-1s on 3G connection
- **Memory Usage**: 10-20MB additional for React runtime

### Performance Best Practices

1. Lazy load React components not needed immediately
2. Use production build of React (minified)
3. Implement proper caching headers for bundles
4. Consider preloading critical bundle resources
5. Monitor bundle size and avoid unnecessary dependencies

## Dependencies

The React Slide Builder block has significant dependencies due to its framework-based architecture:

### Framework Dependencies

- **React**: Core React library (v16.8+ recommended for hooks)
- **React DOM**: React rendering for browser environments
- **React Application**: Custom slide builder application code

### Build Dependencies

The block requires a build process to generate the bundle:
- **Build Tool**: Webpack, Vite, or similar bundler
- **Transpilation**: Babel for JSX and modern JavaScript
- **Module System**: ES Modules for modern browser support

### EDS Framework Dependencies

- **EDS Block Structure**: Standard EDS block decoration pattern
- **EDS Styles**: Base EDS styling and layout system
- **Browser APIs**: Modern browser with ES6+ support

### Browser Compatibility

Minimum browser requirements:
- **Chrome 57+**: Full ES6 module support
- **Firefox 60+**: Complete React compatibility
- **Safari 11+**: ES6 module and React support
- **Edge 16+**: Modern Edge with module support

**Note**: IE11 requires polyfills and transpiled bundle

### External Resource Dependencies

The block depends on pre-built bundles being available:
- `/static/js/slide-builder-main.js` must be deployed
- `/static/css/slide-builder-main.css` must be deployed
- Bundles must be accessible from the EDS page origin

## Known Limitations

Current limitations and constraints of the React Slide Builder block:

### Functional Limitations

1. **Bundle Dependency**: Requires pre-built React bundle to be deployed
2. **Static Paths**: Bundle paths are hardcoded and not configurable
3. **Single Instance**: May have issues with multiple instances on same page
4. **No Data Passing**: Cannot pass data from EDS to React app via block structure
5. **Loading State**: No visual feedback during bundle loading

### Technical Constraints

- **Build Process Required**: Cannot be edited directly in EDS environment
- **Framework Lock-in**: Tightly coupled to React framework version
- **Bundle Updates**: Requires rebuild and redeploy for any changes
- **Debugging Complexity**: Harder to debug than vanilla JavaScript blocks

### Integration Limitations

- **EDS Isolation**: React app runs in isolation from EDS page context
- **Event Communication**: No built-in mechanism for cross-boundary events
- **Style Isolation**: React styles may conflict with EDS styles
- **Server-Side Rendering**: No SSR support, client-side only

### Performance Limitations

- **Initial Load**: Slower than vanilla JavaScript blocks
- **Bundle Size**: Larger payload than native EDS blocks
- **Memory Usage**: Higher memory footprint due to React runtime
- **Mobile Performance**: May be slower on low-end mobile devices

### Development Limitations

- **Hot Reload**: Requires development server for hot reload
- **Testing**: More complex testing setup than vanilla blocks
- **Deployment**: Separate build and deploy process
- **Versioning**: Bundle versioning and cache invalidation challenges

## Technical Implementation

### Component Architecture

The block uses a simple loader pattern:

**Build Component Notice**: This is a build-enhanced block that differs from standard EDS blocks. The source React application is developed separately and bundled, then loaded by this simple EDS block wrapper.

### Loading Sequence

1. **Block Decoration**: EDS calls `decorate()` function
2. **Container Creation**: Creates `div#react-slide-app` container
3. **Script Injection**: Injects React bundle script tag
4. **Style Injection**: Injects stylesheet link tag
5. **React Bootstrap**: React app initializes in container

### Integration Pattern

`JavaScript Loading Pattern`
`export default function decorate(block) {`
`  // Create container for React app`
`  const container = document.createElement('div');`
`  container.id = 'react-slide-app';`
`  block.appendChild(container);`
`  `
`  // Load React bundle`
`  const script = document.createElement('script');`
`  script.src = '/static/js/slide-builder-main.js';`
`  script.type = 'module';`
`  document.head.appendChild(script);`
`  `
`  // Load CSS`
`  const link = document.createElement('link');`
`  link.rel = 'stylesheet';`
`  link.href = '/static/css/slide-builder-main.css';`
`  document.head.appendChild(link);`
`}`

### File Structure

`Block Directory Structure`
`/blocks/react-slide-builder/`
`├── react-slide-builder.js   # Loader block (this file)`
`├── react-slide-builder.css  # Minimal block styles`
`├── README.md                 # This documentation`
`├── EXAMPLE.md                # Usage examples`
`└── test.html                 # Test page`

### Related Resources

The React source code and build configuration live separately:
- Source: External React project repository
- Build: Separate build process generates bundles
- Deploy: Bundles deployed to `/static/js/` and `/static/css/`

## Development Workflow

### Building the React Application

The React application must be built separately:

`Build Commands`
`# In React project directory`
`npm install`
`npm run build`
`# Copy dist files to /static/ directory`

### Testing the Block

Use the provided test.html file:

`Testing Locally`
`# Start development server`
`npm run debug`
`# Open in browser`
`http://localhost:3000/blocks/react-slide-builder/test.html`

### Deployment Process

1. **Build React App**: Generate production bundle
2. **Copy Bundles**: Move JS and CSS to `/static/` directory
3. **Test Block**: Verify block loads application correctly
4. **Deploy to EDS**: Push changes to EDS repository
5. **Verify Production**: Test on live EDS site

## Troubleshooting

### Common Issues

**React App Not Loading**
- Check browser console for script loading errors
- Verify bundle paths are correct and accessible
- Ensure bundles are deployed to correct location
- Check for CORS issues if loading from different origin

**Blank Container**
- Verify React app has correct container target ID
- Check React app console for initialization errors
- Ensure React bundle is built for production
- Verify DOM structure matches React app expectations

**Styling Issues**
- Check for CSS conflicts between EDS and React styles
- Verify CSS bundle is loading successfully
- Use browser DevTools to inspect style application
- Consider CSS isolation strategies (CSS Modules, CSS-in-JS)

**Performance Issues**
- Check bundle size and optimize if needed
- Verify compression is enabled on server
- Implement code splitting for larger apps
- Consider lazy loading non-critical components

## Best Practices

### Block Implementation

- Keep loader block minimal and focused
- Use consistent container IDs across environments
- Implement error handling for bundle loading
- Consider loading state indicators

### React Application

- Build for production with optimizations
- Implement proper error boundaries
- Use code splitting for better performance
- Follow React accessibility best practices

### Integration

- Maintain clear separation between EDS and React
- Document communication patterns if needed
- Test across different browsers and devices
- Monitor performance metrics regularly

## Future Enhancements

Potential improvements for the React Slide Builder:

- **Configuration Props**: Pass configuration from block to React app
- **Loading States**: Visual feedback during bundle load
- **Error Handling**: User-friendly error messages
- **Multiple Instances**: Support multiple slide builders per page
- **Data Integration**: Connect to EDS data sources
- **Server-Side Rendering**: SSR for better performance
- **Progressive Enhancement**: Fallback for non-JS environments

## Support Resources

For technical questions and support:
- [EDS Documentation](https://www.aem.live/docs/)
- [React Documentation](https://react.dev/)
- [Test Page](test.html) - Local testing environment

## Metadata

| Metadata | Value |
|----------|-------|
| Block Name | react-slide-builder |
| Type | Framework Integration |
| Framework | React |
| Load Strategy | Dynamic Script Injection |
| Build Required | Yes |
| EDS Compatible | Yes |
| Version | 1.0.0 |
