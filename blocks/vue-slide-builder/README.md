# Vue Slide Builder Block

## Overview

A framework-integrated EDS block that enables Vue.js-based slide building and presentation capabilities within Adobe Edge Delivery Services. The Vue Slide Builder acts as a loader block that bootstraps a pre-built Vue application into your EDS page, providing a reactive and component-based slide creation interface.

## Content Structure

The Vue Slide Builder block uses a simple table structure in your EDS document:

`Basic Usage`
`| vue-slide-builder |`
`| :---------------- |`

This minimal configuration will load the Vue application and render it within the block container.

## Variations

The Vue Slide Builder block currently supports a single implementation focused on slide creation and presentation. Future variations may include:

- **Presentation Mode**: Display-only mode for viewing created slides
- **Edit Mode**: Full editing capabilities with toolbar
- **Gallery Mode**: Grid view of multiple slide decks
- **Compact Mode**: Minimized interface for embedded contexts

## Configuration Options

The block is configured through the bundled Vue application. Key configuration aspects include:

### JavaScript Bundle Configuration

The block loads the Vue bundle from the assets directory:

- **Bundle Path**: `/assets/index-UbQ-77Ai.js` (hash-based filename from Vite build)
- **Module Type**: ES Module
- **Loading Strategy**: Asynchronous script injection

### Stylesheet Configuration

The block loads styles from the assets directory:

- **Style Path**: `/assets/index-DMC9YjsP.css` (hash-based filename from Vite build)
- **Loading Strategy**: Link element injection

### Container Configuration

The block creates a dedicated container for the Vue app:

- **Container ID**: `vue-slide-app`
- **Minimum Height**: 400px (defined in CSS)
- **Width**: 100% of block width

### CSS Custom Properties

`CSS Variables`
`.vue-slide-builder {`
`--min-height: 400px;`
`--container-width: 100%;`
`}`

### Build Configuration

The Vue application is built using Vite:

- **Build Tool**: Vite (modern build tool for Vue.js)
- **Output Format**: ES Modules with hash-based filenames
- **Asset Directory**: `/assets/` for all built resources

## Accessibility Considerations

The Vue Slide Builder block implements accessibility through both the EDS wrapper and the Vue application:

### Block-Level Accessibility

- **Semantic Structure**: Uses standard EDS block structure with proper HTML semantics
- **Container Labeling**: Vue app container has appropriate ID for ARIA association
- **Focus Management**: Proper focus flow into and out of the Vue application

### Vue Application Accessibility

The bundled Vue application should implement:

- **Keyboard Navigation**: Full keyboard support for all slide operations
- **Screen Reader Support**: ARIA labels and live regions for dynamic content
- **Focus Management**: Proper focus handling during slide transitions
- **Color Contrast**: WCAG AA compliant color combinations
- **Text Scaling**: Support for browser text scaling and zoom

### Vue-Specific Accessibility Features

- **Reactive Accessibility**: ARIA attributes update reactively with Vue state
- **Component Composition**: Reusable accessible components
- **v-focus Directives**: Programmatic focus management
- **Transition Announcements**: Screen reader announcements during transitions

### Known Accessibility Considerations

- Ensure Vue components implement proper ARIA landmarks
- Verify keyboard navigation works without mouse
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Validate color contrast ratios meet WCAG standards

## Performance Impact

The Vue Slide Builder block has performance considerations due to its framework-based architecture:

### Loading Characteristics

- **Bundle Size**: Vue framework + application code (typically 100-250KB gzipped)
- **Initial Load**: Requires downloading and parsing JavaScript bundle
- **Render Time**: Vue initialization and first render add overhead
- **CSS Loading**: Additional stylesheet request and parse time
- **Hash-Based Caching**: Vite generates hash-based filenames for optimal caching

### Performance Optimization Strategies

- **Code Splitting**: Vue supports route-based code splitting
- **Tree Shaking**: Vite automatically removes unused code
- **Compression**: Serve bundles with gzip or brotli compression
- **Long-Term Caching**: Hash-based filenames enable aggressive caching
- **Modern Builds**: Vite generates optimized modern JavaScript

### Performance Metrics

Expected performance characteristics:

- **First Contentful Paint**: 1.2-2.0s (depending on bundle size)
- **Time to Interactive**: 1.8-2.5s (Vue initialization time)
- **Bundle Load Time**: 400ms-800ms on 3G connection
- **Memory Usage**: 8-15MB additional for Vue runtime

### Performance Best Practices

1. Use Vue async components for lazy loading
2. Leverage Vite's production optimizations
3. Implement proper caching headers for assets
4. Consider preloading critical bundle resources
5. Monitor bundle size and avoid unnecessary dependencies
6. Use Vue's built-in performance features (KeepAlive, computed)

## Dependencies

The Vue Slide Builder block has significant dependencies due to its framework-based architecture:

### Framework Dependencies

- **Vue.js**: Core Vue framework (v3.x recommended)
- **Vue Compiler**: Runtime + compiler for component templates
- **Vue Application**: Custom slide builder application code

### Build Dependencies

The block requires a build process to generate the bundle:

- **Build Tool**: Vite (fast modern build tool)
- **Transpilation**: Built-in Vite transpilation for modern browsers
- **Module System**: ES Modules for modern browser support
- **Asset Optimization**: Image, CSS, and font optimization

### EDS Framework Dependencies

- **EDS Block Structure**: Standard EDS block decoration pattern
- **EDS Styles**: Base EDS styling and layout system
- **Browser APIs**: Modern browser with ES6+ support

### Browser Compatibility

Minimum browser requirements:

- **Chrome 64+**: Full ES6 module support
- **Firefox 67+**: Complete Vue.js compatibility
- **Safari 12+**: ES6 module and Vue.js support
- **Edge 79+**: Chromium-based Edge with full support

**Note**: Vite builds modern JavaScript by default (no IE11 support)

### External Resource Dependencies

The block depends on pre-built bundles being available:

- `/assets/index-UbQ-77Ai.js` must be deployed
- `/assets/index-DMC9YjsP.css` must be deployed
- Hash-based filenames change with each build
- Bundles must be accessible from the EDS page origin

### Build-Time Dependencies

Development and build process requires:

- Node.js 14+ for Vite
- npm or yarn for package management
- Vite configuration for Vue.js
- Vue.js ecosystem packages

## Known Limitations

Current limitations and constraints of the Vue Slide Builder block:

### Functional Limitations

1. **Bundle Dependency**: Requires pre-built Vue bundle to be deployed
2. **Hash-Based Paths**: Bundle filenames change with each build, requiring block updates
3. **Single Instance**: May have issues with multiple instances on same page
4. **No Data Passing**: Cannot pass data from EDS to Vue app via block structure
5. **Loading State**: No visual feedback during bundle loading

### Technical Constraints

- **Build Process Required**: Cannot be edited directly in EDS environment
- **Framework Lock-in**: Tightly coupled to Vue.js framework version
- **Bundle Updates**: Requires rebuild and redeploy for any changes
- **Path Management**: Hash-based filenames must be updated in block code
- **Debugging Complexity**: Harder to debug than vanilla JavaScript blocks

### Integration Limitations

- **EDS Isolation**: Vue app runs in isolation from EDS page context
- **Event Communication**: No built-in mechanism for cross-boundary events
- **Style Isolation**: Vue styles may conflict with EDS styles
- **Server-Side Rendering**: No SSR support, client-side only
- **Hydration**: No server-rendered HTML to hydrate

### Performance Limitations

- **Initial Load**: Slower than vanilla JavaScript blocks
- **Bundle Size**: Larger payload than native EDS blocks
- **Memory Usage**: Higher memory footprint due to Vue runtime
- **Mobile Performance**: May be slower on low-end mobile devices

### Development Limitations

- **Hot Module Replacement**: Requires Vite dev server for HMR
- **Testing**: More complex testing setup than vanilla blocks
- **Deployment**: Separate build and deploy process
- **Versioning**: Bundle versioning and cache invalidation challenges
- **Path Updates**: Must update hash-based paths in block code after each build

## Technical Implementation

### Component Architecture

The block uses a simple loader pattern:

**Build Component Notice**: This is a build-enhanced block that differs from standard EDS blocks. The source Vue application is developed separately and bundled using Vite, then loaded by this simple EDS block wrapper.

### Loading Sequence

1. **Block Decoration**: EDS calls `decorate()` function
2. **Container Creation**: Creates `div#vue-slide-app` container
3. **Script Injection**: Injects Vue bundle script tag with hash-based filename
4. **Style Injection**: Injects stylesheet link tag with hash-based filename
5. **Vue Bootstrap**: Vue app creates and mounts in container

### Integration Pattern

`JavaScript Loading Pattern`
`export default function decorate(block) {`
`// Create container for Vue.js app`
`const container = document.createElement('div');`
`container.id = 'vue-slide-app';`
`block.appendChild(container);`
`  `
`// Load Vue.js bundle (hash-based filename from Vite)`
`const script = document.createElement('script');`
`script.src = '/assets/index-UbQ-77Ai.js';`
`script.type = 'module';`
`document.head.appendChild(script);`
`  `
`// Load CSS (hash-based filename from Vite)`
`const link = document.createElement('link');`
`link.rel = 'stylesheet';`
`link.href = '/assets/index-DMC9YjsP.css';`
`document.head.appendChild(link);`
`}`

### File Structure

`Block Directory Structure`
`/blocks/vue-slide-builder/`
`├── vue-slide-builder.js    # Loader block (this file)`
`├── vue-slide-builder.css   # Minimal block styles`
`├── README.md                # This documentation`
`├── EXAMPLE.md               # Usage examples`
`└── test.html                # Test page`

### Build Output Structure

Vite generates assets in the `/assets/` directory:

- `/assets/index-[hash].js` - Vue application bundle
- `/assets/index-[hash].css` - Application styles
- Hash changes with each build for cache busting

### Related Resources

The Vue source code and build configuration live separately:

- Source: External Vue project repository
- Build: Vite build process generates bundles with hash-based names
- Deploy: Bundles deployed to `/assets/` directory

## Development Workflow

### Building the Vue Application

The Vue application must be built using Vite:

`Build Commands`
`# In Vue project directory`
`npm install`
`npm run build`
`# Copy dist files to /assets/ directory`
`# Update block JS with new hash-based filenames`

### Updating Block After Build

After each build, update the hash-based filenames in the block:

`Update Process`
`1. Build Vue app with Vite`
`2. Note new hash-based filenames from dist/`
`3. Update vue-slide-builder.js with new paths`
`4. Deploy both assets and updated block code`

### Testing the Block

Use the provided test.html file:

`Testing Locally`
`# Start development server`
`npm run debug`
`# Open in browser`
`http://localhost:3000/blocks/vue-slide-builder/test.html`

### Development with HMR

For development with hot module replacement:

`Development Workflow`
`# In Vue project directory`
`npm run dev`
`# Opens Vite dev server with HMR`
`# Test directly without EDS integration`

### Deployment Process

1. **Build Vue App**: Run `npm run build` to generate production bundle
2. **Copy Assets**: Move generated files to `/assets/` directory
3. **Update Block Code**: Update hash-based paths in vue-slide-builder.js
4. **Test Block**: Verify block loads application correctly
5. **Deploy to EDS**: Push all changes to EDS repository
6. **Verify Production**: Test on live EDS site

## Troubleshooting

### Common Issues

**Vue App Not Loading**

- Check browser console for script loading errors
- Verify bundle paths match generated hash-based filenames
- Ensure bundles are deployed to correct location
- Check for CORS issues if loading from different origin

**Hash Mismatch Errors**

- Verify hash in block code matches built bundle hash
- Rebuild Vue app and update paths in block code
- Clear browser cache and CDN cache
- Check that correct build artifacts were deployed

**Blank Container**

- Verify Vue app has correct container target ID
- Check Vue app console for initialization errors
- Ensure Vue bundle is built for production
- Verify DOM structure matches Vue app expectations

**Styling Issues**

- Check for CSS conflicts between EDS and Vue styles
- Verify CSS bundle is loading successfully
- Use scoped styles in Vue components
- Use browser DevTools to inspect style application

**Performance Issues**

- Check bundle size and optimize if needed
- Verify compression is enabled on server
- Implement code splitting for larger apps
- Consider lazy loading non-critical components
- Use Vue.js DevTools to profile performance

## Best Practices

### Block Implementation

- Keep loader block minimal and focused
- Use consistent container IDs across environments
- Document hash-based paths and update process
- Implement error handling for bundle loading
- Consider loading state indicators

### Vue Application

- Build for production with Vite optimizations
- Implement proper error boundaries with errorCaptured
- Use code splitting for better performance
- Follow Vue.js accessibility best practices
- Leverage Vue 3 Composition API for better organization

### Integration

- Maintain clear separation between EDS and Vue
- Document communication patterns if needed
- Test across different browsers and devices
- Monitor performance metrics regularly
- Keep track of bundle hash changes

### Build Process

- Use CI/CD to automate builds
- Version control build output hashes
- Document hash update process clearly
- Test after each deployment
- Monitor bundle size over time

## Future Enhancements

Potential improvements for the Vue Slide Builder:

- **Configuration Props**: Pass configuration from block to Vue app
- **Loading States**: Visual feedback during bundle load
- **Error Handling**: User-friendly error messages
- **Multiple Instances**: Support multiple slide builders per page
- **Data Integration**: Connect to EDS data sources
- **Server-Side Rendering**: SSR with Nuxt.js for better performance
- **Progressive Enhancement**: Fallback for non-JS environments
- **Auto-Update Paths**: Script to automatically update hash-based paths

## Support Resources

For technical questions and support:

- [EDS Documentation](https://www.aem.live/docs/)
- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Test Page](test.html) - Local testing environment

## Metadata

| Metadata | Value |
|----------|-------|
| Block Name | vue-slide-builder |
| Type | Framework Integration |
| Framework | Vue.js 3.x |
| Build Tool | Vite |
| Load Strategy | Dynamic Script Injection |
| Build Required | Yes |
| EDS Compatible | Yes |
| Version | 1.0.0 |
