# Photo Library Slider Component - Electron Implementation


## Technical Requirements

### Build Process

- Use electron-builder for packaging
- Implement proper directory structure handling
- Handle resource paths correctly in development and production
- Manage uploads directory across environments
- Implement unsigned builds for development

### Directory Structure

```sh
project-root/
├── src/
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── preload.js
├── scripts/
│   ├── build-unsigned.js
│   └── prepare-build.js
├── resources/
├── uploads/
├── main.js
└── package.json
```

### Build Configuration

```json
{
  "build": {
    "appId": "com.tom.photolib",
    "mac": {
      "category": "public.app-category.photography"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    },
    "extraResources": [
      {
        "from": "uploads",
        "to": "uploads"
      }
    ],
    "directories": {
      "buildResources": "resources",
      "output": "dist"
    },
    "files": [
      "**/*",
      "!uploads/*"
    ],
    "asar": {
      "smartUnpack": true
    }
  }
}
```

### Path Management

- Development paths:

  ```javascript
  path.join(__dirname, 'uploads')
  ```

- Production paths:

  ```javascript
  path.join(app.getPath('userData'), 'uploads')
  ```

- Resource paths:

  ```javascript
  path.join(process.resourcesPath, 'uploads')
  ```

### Build Scripts

Required build scripts in package.json:

```json
{
  "scripts": {
    "start": "DEBUG=electron* electron . --no-sandbox",
    "dev": "DEBUG=electron* electron . --no-sandbox --enable-logging",
    "build": "electron-builder",
    "clean": "rm -rf node_modules && rm -rf dist && rm -f package-lock.json",
    "rebuild": "npm run clean && npm install",
    "prepare-build": "node scripts/prepare-build.js",
    "build:unsigned": "npm run prepare-build && node scripts/build-unsigned.js"
  }
}
```

### Error Handling for Common Build Issues

1. ENOTDIR errors:
   - Ensure uploads directory exists before operations
   - Use proper path resolution in packaged app
   - Handle directory creation asynchronously

2. ZIP processing errors:
   - Clear directory contents, not directory itself
   - Use proper path resolution for extraction
   - Handle system files (.DS_Store, __MACOSX)

3. Resource access errors:
   - Use correct path resolution based on environment
   - Handle both development and production paths
   - Implement proper error recovery

### Security Considerations for Builds

- Implement proper asar configuration
- Handle file permissions correctly
- Secure resource access patterns
- Validate file operations
- Implement proper sandbox configuration

## Build Process Guidelines

### Development Build

1. Setup environment:

   ```bash
   npm install
   npm run prepare-build
   ```

2. Run development build:

   ```bash
   npm run dev
   ```

### Production Build

1. Clean environment:

   ```bash
   npm run clean
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create unsigned build:

   ```bash
   npm run build:unsigned
   ```

### Build Verification

1. Test uploads directory access
2. Verify ZIP file processing
3. Check resource path resolution
4. Validate file operations
5. Test in packaged environment

### Common Build Solutions

1. Uploads directory issues:
   - Implement proper path resolution
   - Handle directory creation/cleanup
   - Manage permissions correctly

2. Resource access:
   - Use correct path helpers
   - Handle both development and production
   - Implement proper error recovery

3. ZIP processing:
   - Proper directory management
   - Handle system files
   - Implement cleanup routines

### Security

- Implement context isolation
- Sandbox renderer process
- Validate all inputs
- Normalize file paths
- Verify file types and sizes
- Implement proper asar configuration
- Handle file permissions correctly
- Secure resource access patterns
- Validate file operations
- Implement proper sandbox configuration
- Verify package signatures
- Implement CSP headers
- Handle IPC securely

### Performance

- Optimize images during processing
- Cache metadata and thumbnails
- Implement debounced events
- Manage memory usage
- Clean up resources properly
- Optimize build artifacts
- Implement lazy loading
- Use proper caching strategies
- Optimize asar packaging
- Handle large file operations efficiently

### Error Handling

- Validate file types and sizes
- Handle missing or corrupt files
- Provide user feedback
- Implement retry mechanisms
- Log errors appropriately
- Handle build process errors
- Implement proper error recovery
- Validate resource paths
- Handle permission errors
- Implement fallback mechanisms

### Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management
- Touch device support
- ARIA labels
- Semantic HTML
- Color contrast compliance
- Keyboard shortcuts
- Focus indicators

## Development Guidelines

### Code Standards

- Use ES6+ features
- Implement proper error handling
- Follow security best practices
- Maintain code readability
- Add comprehensive comments
- Follow Airbnb style guide
- Use TypeScript definitions
- Implement proper linting
- Use consistent naming conventions
- Document API interfaces

### Testing Requirements

- Unit tests for components
- Integration tests for file operations
- Error scenario testing
- Performance testing
- Cross-platform compatibility
- Build process testing
- Security testing
- Resource access testing
- IPC communication testing
- UI/UX testing

### Documentation

- Installation instructions
- Configuration options
- Usage guidelines
- API documentation
- Development setup
- Build process documentation
- Troubleshooting guide
- Security considerations
- Performance optimization
- Release process

## Configuration Options

```javascript
{
  "imageSupportedTypes": [".jpg", ".png", ".webp"],
  "maxFileSize": "50MB",
  "thumbnailSize": "200x200",
  "cacheStrategy": "memory",
  "metadataFields": [
    "camera",
    "lens",
    "fstop",
    "shutterSpeed",
    "iso",
    "focalLength",
    "dimensions",
    "dpi",
    "fileSize"
  ],
  "buildOptions": {
    "asar": true,
    "compression": "maximum",
    "removeDevTools": true,
    "strictSSL": true
  },
  "security": {
    "contextIsolation": true,
    "sandbox": true,
    "allowRunningInsecureContent": false,
    "enableWebSecurity": true
  }
}
```

## Error Cases

1. Invalid file types
2. Corrupt image files
3. Missing metadata
4. Directory access errors
5. ZIP file validation
6. Memory constraints
7. Disk space limitations
8. Build process failures
9. Resource access errors
10. Permission denied errors

## Performance Targets

- Image load time: <500ms
- JSON generation: <1s for 1000 images
- Memory usage: <500MB
- Smooth slider interaction: 60fps
- ZIP processing: <5s for 100MB
- Build time: <5m
- Package size: <100MB
- Startup time: <3s
- Resource loading: <200ms
- Cache hit ratio: >90%

This prompt is licensed under the same terms as the original: (c) Tom Cranstoun, October 2024, V 1.1
