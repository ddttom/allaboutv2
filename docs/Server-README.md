# Development Server Documentation

## Overview

This document explains the minimal Node.js development server (`server.js`) designed for testing and developing EDS (Edge Delivery Services) components locally. The server provides local file serving with automatic fallback to a remote proxy, making it ideal for testing blocks and components in isolation.

## Quick Start

```bash
npm run debug
```

The server will start on `http://localhost:3000` and serve files from the project root directory.

## Server Architecture

### Core Functionality

The server implements a **local-first, proxy-fallback** architecture:

1. **Local File Priority**: Always attempts to serve files from the local filesystem first
2. **Proxy Fallback**: If a file doesn't exist locally, proxies the request to `https://allabout.network`
3. **MIME Type Detection**: Automatically detects and serves appropriate content types
4. **CORS Support**: Includes proper CORS headers for cross-origin requests

### File Structure

```
project-root/
├── server.js              # Main server file
├── package.json           # Contains "debug" script
└── blocks/                # Your EDS blocks
    └── block-name/
        ├── test.html       # Test files for blocks
        ├── block-name.js   # Block JavaScript
        └── block-name.css  # Block styles
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

### Proxy Configuration

The server is configured to proxy missing files to:
```javascript
const PROXY_HOST = 'https://allabout.network';
```

This allows you to test local components while still accessing remote assets and content.

## Supported File Types

The server includes comprehensive MIME type support:

| Extension | MIME Type |
|-----------|-----------|
| `.html` | `text/html` |
| `.js` | `application/javascript` |
| `.css` | `text/css` |
| `.json` | `application/json` |
| `.png`, `.jpg`, `.jpeg` | Image types |
| `.svg` | `image/svg+xml` |
| `.woff`, `.woff2`, `.ttf` | Font types |

## Usage Examples

### Testing Block Components

1. **Create a test file** in your block directory:
   ```
   blocks/my-block/test.html
   ```

2. **Start the server**:
   ```bash
   npm run debug
   ```

3. **Access your test**:
   ```
   http://localhost:3000/blocks/my-block/test.html
   ```

### Example Test File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Block Test</title>
    <link rel="stylesheet" href="my-block.css">
</head>
<body>
    <div class="my-block-block">
        <div>
            <div>Test content for my block</div>
        </div>
    </div>

    <script type="module">
        import decorate from './my-block.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            const block = document.querySelector('.my-block-block');
            if (block) {
                decorate(block);
            }
        });
    </script>
</body>
</html>
```

## Server Behavior

### Local File Serving

When a request comes in:

1. **Path Resolution**: Converts URL to local file path
2. **File Existence Check**: Uses `fs.access()` to check if file exists
3. **Content Serving**: Reads and serves file with appropriate headers
4. **Error Handling**: Gracefully handles file read errors

### Proxy Behavior

When local file doesn't exist:

1. **Proxy Request**: Makes HTTP request to `https://allabout.network`
2. **Content Type Detection**: Preserves original content type
3. **Binary/Text Handling**: Appropriately handles different content types
4. **Error Handling**: Returns 404 if both local and proxy fail

### Request Flow

```
Request → Local File Check → Serve Local File
    ↓ (if not found)
Proxy Request → Remote Server → Serve Proxied Content
    ↓ (if proxy fails)
Return 404 Error Page
```

## Logging and Debugging

The server provides comprehensive logging:

```
🚀 Server running at http://localhost:3000
📁 Serving files from: /path/to/project
🔗 Proxying missing files to: https://allabout.network
📄 Main page: http://localhost:3000/aem.html

Request: GET /blocks/my-block/test.html
Serving local file: /path/to/project/blocks/my-block/test.html

Request: GET /missing-file.json
Local file not found, attempting proxy for: /missing-file.json
Proxying request to: https://allabout.network/missing-file.json
✅ Successfully proxied: /missing-file.json
```

## Error Handling

### Local File Errors

- **File Not Found**: Automatically falls back to proxy
- **Read Errors**: Logs error and attempts proxy fallback
- **Permission Errors**: Gracefully handled with error logging

### Proxy Errors

- **Network Errors**: Returns 404 with helpful error page
- **DNS Resolution**: Handles domain resolution failures
- **HTTP Errors**: Logs detailed error information

### 404 Error Page

When both local and proxy fail, returns a helpful error page:

```html
<!DOCTYPE html>
<html>
  <head><title>404 Not Found</title></head>
  <body>
    <h1>404 Not Found</h1>
    <p>The requested resource <code>/path</code> was not found locally 
    or on the proxy server.</p>
    <p>Attempted proxy URL: <code>https://allabout.network/path</code></p>
  </body>
</html>
```

## Performance Considerations

### Caching Headers

All responses include:
```javascript
'Cache-Control': 'no-cache'
```

This ensures you always see the latest changes during development.

### CORS Headers

Proxy responses include comprehensive CORS headers:
```javascript
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

## Security Notes

### Development Only

This server is designed for **development use only**:

- No authentication or authorization
- Permissive CORS headers
- No rate limiting
- Detailed error logging

**Do not use in production environments.**

### Safe Defaults

- Only serves files from project directory
- No directory traversal vulnerabilities
- Proper MIME type detection
- Graceful error handling

## Troubleshooting

### Common Issues

**Server won't start:**
```bash
# Check if port is in use
lsof -i :3000

# Kill existing process
pkill -f "node server.js"

# Restart server
npm run debug
```

**Files not loading:**
- Check file paths are relative to project root
- Verify file permissions
- Check server logs for detailed error messages

**Proxy not working:**
- Verify internet connection
- Check proxy URL configuration
- Review network logs in browser dev tools

### Debug Mode

The server runs with comprehensive logging enabled. Monitor the terminal output to understand request flow and identify issues.

## Integration with EDS

### Block Testing Workflow

1. **Create Block Structure**:
   ```
   blocks/my-block/
   ├── my-block.js
   ├── my-block.css
   ├── README.md
   └── test.html
   ```

2. **Start Development Server**:
   ```bash
   npm run debug
   ```

3. **Test Block**:
   - Navigate to `http://localhost:3000/blocks/my-block/test.html`
   - Make changes to JS/CSS files
   - Refresh browser to see changes

4. **Proxy Integration**:
   - Missing assets automatically load from remote server
   - Test with real content and dependencies

### EDS-Specific Features

- **Automatic Block Loading**: Test files can import block JavaScript modules
- **CSS Loading**: Block stylesheets load automatically
- **Asset Proxying**: Missing icons, fonts, and images load from remote server
- **Query Index Access**: Can test with real query-index.json data

## Best Practices

### Test File Organization

```html
<!-- Include block-specific styles -->
<link rel="stylesheet" href="block-name.css">

<!-- Create proper block structure -->
<div class="block-name-block">
  <!-- Block content here -->
</div>

<!-- Import and initialize block -->
<script type="module">
  import decorate from './block-name.js';
  document.addEventListener('DOMContentLoaded', () => {
    const block = document.querySelector('.block-name-block');
    if (block) {
      decorate(block);
    }
  });
</script>
```

### Development Workflow

1. **Start with test.html**: Create isolated test environment
2. **Develop incrementally**: Make small changes and test frequently
3. **Use browser dev tools**: Monitor network requests and console output
4. **Test responsive design**: Use browser responsive mode
5. **Validate accessibility**: Test with screen readers and keyboard navigation

## Conclusion

This development server provides a lightweight, efficient environment for testing EDS blocks and components. Its local-first approach with proxy fallback ensures you can develop in isolation while still accessing remote dependencies when needed.

The server's simplicity aligns with EDS principles of minimal tooling and maximum performance, making it an ideal development companion for building high-quality, performant web components.
