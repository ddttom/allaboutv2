# EDS Block Development & Debugging Reference for AI Assistants

*A comprehensive technical reference for AI assistants helping developers create and debug Adobe Edge Delivery Services blocks*

---

## 🤖 AI Assistant Guidelines

This document provides detailed technical instructions for helping developers create, test, and debug EDS blocks. As an AI assistant, use this reference to:

- **Provide accurate code examples** that follow EDS conventions
- **Guide debugging workflows** using the server.js development environment
- **Explain EDS-specific constraints** and architectural patterns
- **Offer step-by-step solutions** to common development issues

---

## 📋 EDS Block Creation Checklist

### Essential Files Required for Every Block

```
/blocks/{block-name}/
├── {block-name}.js          # Required: Decoration function
├── {block-name}.css         # Required: Block styling
├── test.html               # Required: Testing file
├── README.md               # Required: Documentation
└── example.md              # Optional: Usage examples
```

### File Naming Rules (Critical for EDS)

- **Block directory name** must match HTML class name exactly
- **JavaScript file** must be `{block-name}.js` (EDS loads this automatically)
- **CSS file** must be `{block-name}.css` (EDS loads this automatically)  
- **Test file** must be `test.html` (development server expects this)
- **Multi-word blocks** use hyphens: `my-component` not `myComponent` or `my_component`

---

## 🏗️ Block Structure Fundamentals

### EDS HTML Structure Requirements

Every EDS block must follow this exact structure:

```html
<div class="block-name block" data-block-name="block-name" data-block-status="initialized">
  <div>
    <div>
      <!-- Actual content goes here -->
      <p>Content from CMS</p>
    </div>
  </div>
</div>
```

**Critical Requirements:**
- Must have both `.block-name` and `.block` classes
- Must have `data-block-name` attribute matching the class name
- Must have `data-block-status="initialized"` attribute
- Content is nested in `<div><div>content</div></div>` structure

### JavaScript Decoration Pattern

```javascript
// /blocks/block-name/block-name.js
export default function decorate(block) {
  // 1. Extract content from EDS structure
  const content = extractContent(block);
  
  // 2. Create enhanced structure
  const enhancedContent = createEnhancedStructure(content);
  
  // 3. Replace block content
  block.innerHTML = '';
  block.appendChild(enhancedContent);
  
  // 4. Add behavior and event handlers
  setupBehavior(enhancedContent);
}

function extractContent(block) {
  // EDS content is always in nested div structure
  const contentDiv = block.querySelector('div > div');
  
  // Extract different content types
  const text = contentDiv?.textContent?.trim();
  const paragraphs = contentDiv?.querySelectorAll('p');
  const links = contentDiv?.querySelectorAll('a');
  
  return { text, paragraphs, links };
}
```

### CSS Architecture Requirements

```css
/* /blocks/block-name/block-name.css */

/* ✅ CORRECT: Primary block selector */
.block-name.block {
  /* Block-level styling */
  display: block;
  margin: 1rem 0;
}

/* ✅ CORRECT: Element styling */
.block-name-element {
  /* Element-specific styling */
}

/* ❌ NEVER: Don't style container elements */
.block-name-container {
  /* EDS containers should never have styling */
}

/* ✅ CORRECT: Responsive design */
@media (max-width: 600px) {
  .block-name.block {
    /* Mobile styles */
  }
}
```

---

## 🖥️ Server.js Development Environment

### Server Architecture Overview

The EDS development server (`server.js`) implements a **local-first, proxy-fallback** system:

1. **Request arrives** for any file
2. **Check local filesystem** for the file
3. **Serve local file** if found with appropriate MIME type
4. **Proxy to production** if file not found locally
5. **Return 404** if both local and proxy fail

### Starting the Development Server

```bash
# Start the server
npm run debug

# Expected output:
🚀 Server running at http://localhost:3000
📁 Serving files from: /your/project/path
🔗 Proxying missing files to: https://allabout.network
📄 Main page: http://localhost:3000/aem.html
```

### Server Request Flow Examples

```bash
# Local file serving
Request: GET /blocks/my-block/test.html
Serving local file: /project/blocks/my-block/test.html

Request: GET /blocks/my-block/my-block.js  
Serving local file: /project/blocks/my-block/my-block.js

Request: GET /blocks/my-block/my-block.css
Serving local file: /project/blocks/my-block/my-block.css

# Proxy fallback for missing files
Request: GET /styles/styles.css
Local file not found, attempting proxy for: /styles/styles.css
Proxying request to: https://allabout.network/styles/styles.css
✅ Successfully proxied: /styles/styles.css

Request: GET /media/hero-image.jpg
Local file not found, attempting proxy for: /media/hero-image.jpg  
Proxying request to: https://allabout.network/media/hero-image.jpg
✅ Successfully proxied: /media/hero-image.jpg
```

### Development Workflow

1. **Create block files** in `/blocks/{block-name}/` directory
2. **Start server** with `npm run debug`
3. **Navigate to test file** at `http://localhost:3000/blocks/{block-name}/test.html`
4. **Make changes** to JavaScript/CSS files
5. **Refresh browser** to see changes (no build process needed)
6. **Monitor server logs** for file loading and proxy behavior

---

## 🧪 Creating Test Files

### Standard Test File Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>Block Name - Test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="module" src="/scripts/aem.js"></script>
    <link rel="stylesheet" href="/styles/styles.css">
</head>
<body class="appear">
    <main>
        <div class="section">
            <h1>Block Name Test</h1>
            
            <!-- Test Scenario 1: Basic functionality -->
            <div class="test-scenario">
                <h2>Basic Test</h2>
                <div class="block-name block" data-block-name="block-name" data-block-status="initialized">
                    <div>
                        <div>
                            <p>Test content goes here</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Test Scenario 2: Different content -->
            <div class="test-scenario">
                <h2>Alternative Content</h2>
                <div class="block-name block" data-block-name="block-name" data-block-status="initialized">
                    <div>
                        <div>
                            <p>Different test content</p>
                            <p>Multiple paragraphs</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Test Scenario 3: Edge case -->
            <div class="test-scenario">
                <h2>Edge Case</h2>
                <div class="block-name block" data-block-name="block-name" data-block-status="initialized">
                    <div>
                        <div>
                            <!-- Minimal or problematic content -->
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import decorate from './block-name.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            const blocks = document.querySelectorAll('.block-name.block');
            blocks.forEach(decorate);
        });
    </script>
</body>
</html>
```

### Test File Requirements

- **Must include EDS core scripts**: `/scripts/aem.js` and `/styles/styles.css`
- **Must have `body.appear` class**: Makes content visible in EDS
- **Must use proper block structure**: `.block-name.block` with data attributes
- **Must import and call decorate function**: Initialize blocks with your JavaScript
- **Should test multiple scenarios**: Basic, alternative content, edge cases

---

## 🔧 Step-by-Step Block Creation

### Step 1: Create Block Directory and Files

```bash
# Create the block directory
mkdir -p blocks/my-component

# Create required files
touch blocks/my-component/my-component.js
touch blocks/my-component/my-component.css  
touch blocks/my-component/test.html
touch blocks/my-component/README.md
```

### Step 2: Implement JavaScript Decoration

```javascript
// /blocks/my-component/my-component.js

// Configuration constants (recommended pattern)
const COMPONENT_CONFIG = {
  DEFAULT_TEXT: 'Hello, EDS!',
  ANIMATION_DURATION: 300,
  CSS_CLASSES: {
    CONTAINER: 'my-component-container',
    TITLE: 'my-component-title', 
    CONTENT: 'my-component-content',
    BUTTON: 'my-component-button'
  }
};

export default function decorate(block) {
  try {
    // Extract content from EDS structure
    const content = extractContentFromBlock(block);
    
    // Create enhanced structure
    const container = createComponentStructure(content);
    
    // Add interactive behavior
    setupComponentBehavior(container);
    
    // Replace block content
    block.innerHTML = '';
    block.appendChild(container);
    
    // Add CSS class for styling
    block.classList.add('my-component-enhanced');
    
  } catch (error) {
    console.error('[My Component] Enhancement failed:', error);
    showFallbackContent(block);
  }
}

function extractContentFromBlock(block) {
  // Get content from EDS nested structure
  const contentDiv = block.querySelector('div > div');
  
  if (!contentDiv) {
    throw new Error('Invalid block structure - no content div found');
  }
  
  // Extract different content types
  const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
  const text = contentDiv.textContent?.trim() || COMPONENT_CONFIG.DEFAULT_TEXT;
  const links = Array.from(contentDiv.querySelectorAll('a'));
  
  return {
    text,
    paragraphs: paragraphs.map(p => p.textContent.trim()),
    links: links.map(a => ({ text: a.textContent, href: a.href }))
  };
}

function createComponentStructure(content) {
  const container = document.createElement('div');
  container.className = COMPONENT_CONFIG.CSS_CLASSES.CONTAINER;
  
  // Create title
  const title = document.createElement('h3');
  title.className = COMPONENT_CONFIG.CSS_CLASSES.TITLE;
  title.textContent = content.paragraphs[0] || content.text;
  
  // Create content area
  const contentArea = document.createElement('div');
  contentArea.className = COMPONENT_CONFIG.CSS_CLASSES.CONTENT;
  
  // Add remaining paragraphs as content
  content.paragraphs.slice(1).forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    contentArea.appendChild(p);
  });
  
  // Create interactive button
  const button = document.createElement('button');
  button.className = COMPONENT_CONFIG.CSS_CLASSES.BUTTON;
  button.textContent = 'Click Me';
  button.setAttribute('aria-label', 'Interact with component');
  
  container.appendChild(title);
  container.appendChild(contentArea);
  container.appendChild(button);
  
  return container;
}

function setupComponentBehavior(container) {
  const button = container.querySelector(`.${COMPONENT_CONFIG.CSS_CLASSES.BUTTON}`);
  
  if (button) {
    button.addEventListener('click', () => {
      // Add click behavior
      button.textContent = 'Clicked!';
      
      // Reset after delay
      setTimeout(() => {
        button.textContent = 'Click Me';
      }, COMPONENT_CONFIG.ANIMATION_DURATION);
    });
  }
}

function showFallbackContent(block) {
  block.innerHTML = `
    <div class="my-component-fallback">
      <p>Component functionality unavailable</p>
      <p>Please refresh the page</p>
    </div>
  `;
}
```

### Step 3: Implement CSS Styling

```css
/* /blocks/my-component/my-component.css */

.my-component.block {
  /* Base block styling */
  display: block;
  margin: 2rem 0;
  font-family: var(--body-font-family, system-ui);
}

.my-component-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  background: var(--background-color, #ffffff);
}

.my-component-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--heading-color, #1f2937);
}

.my-component-content {
  margin: 1rem 0;
  color: var(--text-color, #374151);
  line-height: 1.6;
}

.my-component-content p {
  margin: 0.5rem 0;
}

.my-component-button {
  background: var(--link-color, #0066cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.my-component-button:hover {
  background: var(--link-hover-color, #0052a3);
  transform: translateY(-1px);
}

.my-component-button:focus {
  outline: 2px solid var(--link-color, #0066cc);
  outline-offset: 2px;
}

.my-component-button:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 600px) {
  .my-component-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .my-component-title {
    font-size: 1.25rem;
  }
}

/* Error state styling */
.my-component-fallback {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary, #6b7280);
  font-style: italic;
}
```

### Step 4: Create Test File

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Component - Test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="module" src="/scripts/aem.js"></script>
    <link rel="stylesheet" href="/styles/styles.css">
</head>
<body class="appear">
    <main>
        <div class="section">
            <h1>My Component Test</h1>
            
            <div class="test-scenario">
                <h2>Basic Test</h2>
                <div class="my-component block" data-block-name="my-component" data-block-status="initialized">
                    <div>
                        <div>
                            <p>Welcome to My Component</p>
                            <p>This is some example content that will be enhanced by the component.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module">
        import decorate from './my-component.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            const blocks = document.querySelectorAll('.my-component.block');
            blocks.forEach(decorate);
        });
    </script>
</body>
</html>
```

### Step 5: Test the Block

```bash
# Start development server
npm run debug

# Navigate to test file
open http://localhost:3000/blocks/my-component/test.html

# Expected server logs:
Request: GET /blocks/my-component/test.html
Serving local file: /project/blocks/my-component/test.html

Request: GET /scripts/aem.js
Proxying request to: https://allabout.network/scripts/aem.js

Request: GET /styles/styles.css  
Proxying request to: https://allabout.network/styles/styles.css

Request: GET /blocks/my-component/my-component.js
Serving local file: /project/blocks/my-component/my-component.js

Request: GET /blocks/my-component/my-component.css
Serving local file: /project/blocks/my-component/my-component.css
```

---

## 🐛 Debugging Guide

### Debugging Workflow

When a block isn't working, follow this systematic approach:

#### 1. Check Server Logs First

```bash
# Look for these patterns in server output:

# ✅ GOOD: Local files loading
Request: GET /blocks/my-block/my-block.js
Serving local file: /project/blocks/my-block/my-block.js

# ❌ PROBLEM: File not found
Request: GET /blocks/my-block/my-block.js
Error serving local file: ENOENT: no such file or directory

# ❌ PROBLEM: Proxy failing
Request: GET /styles/styles.css
❌ Error proxying request for /styles/styles.css: fetch failed
```

#### 2. Check Browser Console

```javascript
// Add this to your test file for debugging
console.log('Test file loaded');

// Check if block exists
const blocks = document.querySelectorAll('.my-block.block');
console.log('Found blocks:', blocks.length);

// Check if decorate function loads
import('./my-block.js').then(module => {
  console.log('Block module loaded:', !!module.default);
}).catch(error => {
  console.error('Block module failed to load:', error);
});
```

#### 3. Validate Block Structure

```javascript
// Add to your decorate function for debugging
export default function decorate(block) {
  console.log('Decorate called with:', block);
  console.log('Block classes:', block.className);
  console.log('Block dataset:', block.dataset);
  console.log('Block content:', block.innerHTML);
  
  // Check for required structure
  const contentDiv = block.querySelector('div > div');
  if (!contentDiv) {
    console.error('Missing required div > div structure');
    return;
  }
  
  // Rest of decoration logic...
}
```

### Common Issues and Solutions

#### Issue: Block Not Loading at All

**Symptoms:**
- Block appears as plain HTML content
- No styling applied
- No JavaScript enhancement

**Debug Steps:**

```javascript
// 1. Check if block element exists with correct classes
console.log('Block element:', document.querySelector('.my-block.block'));

// 2. Check if files are loading
const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
cssLinks.forEach(link => {
  console.log('CSS:', link.href, link.sheet ? '✅' : '❌');
});

// 3. Check for JavaScript errors
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});
```

**Common Causes:**

```html
<!-- ❌ WRONG: Missing .block class -->
<div class="my-block" data-block-name="my-block">

<!-- ❌ WRONG: Incorrect data attribute -->  
<div class="my-block block" data-block="my-block">

<!-- ❌ WRONG: Missing data-block-status -->
<div class="my-block block" data-block-name="my-block">

<!-- ✅ CORRECT: Proper structure -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
```

#### Issue: CSS Not Applied

**Debug Steps:**

```javascript
// Check if CSS file loaded
function checkCSSLoading(blockName) {
  const expectedCSS = `/blocks/${blockName}/${blockName}.css`;
  const cssLink = document.querySelector(`link[href*="${blockName}.css"]`);
  
  if (!cssLink) {
    console.error(`❌ CSS not loaded: ${expectedCSS}`);
    return false;
  }
  
  console.log(`✅ CSS loaded: ${expectedCSS}`);
  return true;
}

// Check computed styles
const block = document.querySelector('.my-block.block');
const styles = window.getComputedStyle(block);
console.log('Block styles:', {
  display: styles.display,
  margin: styles.margin,
  color: styles.color
});
```

**Common Causes:**
- File naming mismatch (`my-block.css` vs `myblock.css`)
- CSS file empty or has syntax errors
- Server not serving local CSS file (check server logs)

#### Issue: JavaScript Errors

**Debug with Error Handling:**

```javascript
export default function decorate(block) {
  try {
    console.log('[My Block] Starting decoration');
    
    // Your block logic here
    const content = extractContent(block);
    console.log('[My Block] Content extracted:', content);
    
    const structure = createStructure(content);
    console.log('[My Block] Structure created:', structure);
    
    block.innerHTML = '';
    block.appendChild(structure);
    
    console.log('[My Block] Decoration completed');
    
  } catch (error) {
    console.error('[My Block] Decoration failed:', error);
    
    // Show fallback content
    block.innerHTML = `
      <div class="error-fallback">
        <p>Component temporarily unavailable</p>
        <details>
          <summary>Debug Info</summary>
          <pre>${error.message}</pre>
        </details>
      </div>
    `;
  }
}
```

#### Issue: Server Proxy Not Working

**Symptoms:**
- EDS styles not loading
- Images not displaying
- External content failing

**Debug Steps:**

```bash
# Check server logs for proxy attempts
Request: GET /styles/styles.css
Local file not found, attempting proxy for: /styles/styles.css
❌ Error proxying request for /styles/styles.css: fetch failed

# Common solutions:
1. Check internet connection
2. Verify proxy URL in server.js (should be https://allabout.network)
3. Try accessing proxy URL directly in browser
4. Check for firewall/network restrictions
```

#### Issue: Block Works in Development but Fails in Production

**Debug Production Issues:**

```javascript
// Add production environment detection
const isProduction = !window.location.hostname.includes('localhost');

export default function decorate(block) {
  if (isProduction) {
    console.log('[My Block] Running in production mode');
  }
  
  try {
    // Block logic with extra production validation
    validateProductionEnvironment();
    
  } catch (error) {
    if (isProduction) {
      // More conservative error handling in production
      console.warn('[My Block] Production enhancement failed:', error.message);
      showMinimalFallback(block);
    } else {
      console.error('[My Block] Development error:', error);
      showDetailedError(block, error);
    }
  }
}

function validateProductionEnvironment() {
  // Check for production-specific requirements
  if (!document.querySelector('script[src*="aem.js"]')) {
    throw new Error('EDS core scripts not loaded');
  }
  
  // Add other production validation...
}
```

### Advanced Debugging Techniques

#### Network Analysis

```javascript
// Monitor network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', args[0], response.status);
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', args[0], error);
      throw error;
    });
};
```

#### Performance Monitoring

```javascript
// Monitor block loading performance
export default function decorate(block) {
  const startTime = performance.now();
  
  try {
    // Block logic here
    
    const endTime = performance.now();
    console.log(`[My Block] Enhancement took ${endTime - startTime}ms`);
    
  } catch (error) {
    const endTime = performance.now();
    console.error(`[My Block] Failed after ${endTime - startTime}ms:`, error);
  }
}
```

#### Memory Leak Detection

```javascript
// Track event listeners for cleanup
class BlockManager {
  constructor(block) {
    this.block = block;
    this.cleanup = [];
  }
  
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    this.cleanup.push(() => element.removeEventListener(event, handler, options));
  }
  
  destroy() {
    this.cleanup.forEach(cleanup => cleanup());
    this.cleanup = [];
  }
}

export default function decorate(block) {
  const manager = new BlockManager(block);
  
  // Use manager for all event listeners
  const button = block.querySelector('button');
  if (button) {
    manager.addEventListener(button, 'click', handleClick);
  }
  
  // Store manager for cleanup
  block._blockManager = manager;
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (block._blockManager) {
      block._blockManager.destroy();
    }
  });
}
```

---

## 📊 Testing Patterns

### Comprehensive Test Scenarios

Create test files that cover these scenarios:

#### 1. Content Variations

```html
<!-- Test with minimal content -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
  <div><div><p>Minimal</p></div></div>
</div>

<!-- Test with rich content -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
  <div>
    <div>
      <h3>Rich Content</h3>
      <p>Multiple paragraphs with <a href="#">links</a></p>
      <p>Additional content here</p>
    </div>
  </div>
</div>

<!-- Test with empty content -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
  <div><div></div></div>
</div>
```

#### 2. Error Conditions

```html
<!-- Test with malformed structure -->
<div class="my-block block" data-block-name="my-block" data-block-status="initialized">
  <!-- Missing nested divs -->
  <p>Malformed content</p>
</div>
```

#### 3. Accessibility Testing

```javascript
// Add to test file for accessibility validation
function testAccessibility() {
  const block = document.querySelector('.my-block.block');
  
  // Check for focusable elements
  const focusable = block.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  console.log('Focusable elements:', focusable.length);
  
  // Check for ARIA attributes
  const ariaElements = block.querySelectorAll('[aria-label], [aria-describedby], [role]');
  console.log('ARIA elements:', ariaElements.length);
  
  // Test keyboard navigation
  focusable.forEach((element, index) => {
    element.addEventListener('focus', () => {
      console.log(`Focus on element ${index}:`, element.tagName);
    });
  });
}

// Call after blocks are decorated
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(testAccessibility, 100);
});
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

Before deploying blocks to production:

```javascript
// Validation script to run before deployment
function validateBlockForProduction(blockName) {
  const checks = {
    filesExist: false,
    cssValid: false,
    jsValid: false,
    testPasses: false,
    accessibilityValid: false
  };
  
  // Check required files exist
  const requiredFiles = [
    `/blocks/${blockName}/${blockName}.js`,
    `/blocks/${blockName}/${blockName}.css`,
    `/blocks/${blockName}/test.html`,
    `/blocks/${blockName}/README.md`
  ];
  
  checks.filesExist = requiredFiles.every(file => {
    return fetch(file, { method: 'HEAD' })
      .then(response => response.ok)
      .catch(() => false);
  });
  
  // Validate CSS
  fetch(`/blocks/${blockName}/${blockName}.css`)
    .then(response => response.text())
    .then(css => {
      checks.cssValid = css.length > 0 && !css.includes('undefined');
    });
  
  // Validate JavaScript
  import(`/blocks/${blockName}/${blockName}.js`)
    .then(module => {
      checks.jsValid = typeof module.default === 'function';
    })
    .catch(() => {
      checks.jsValid = false;
    });
  
  return checks;
}
```

### Performance Validation

```javascript
// Check block performance impact
function validatePerformance(blockName) {
  const metrics = {
    cssSize: 0,
    jsSize: 0,
    loadTime: 0
  };
  
  const startTime = performance.now();
  
  Promise.all([
    fetch(`/blocks/${blockName}/${blockName}.css`).then(r => r.text()),
    fetch(`/blocks/${blockName}/${blockName}.js`).then(r => r.text())
  ]).then(([css, js]) => {
    metrics.cssSize = new Blob([css]).size;
    metrics.jsSize = new Blob([js]).size;
    metrics.loadTime = performance.now() - startTime;
    
    console.log(`${blockName} Performance:`, metrics);
    
    // Validate size limits
    if (metrics.cssSize > 10240) { // 10KB limit
      console.warn(`CSS size ${metrics.cssSize} bytes exceeds recommended 10KB`);
    }
    
    if (metrics.jsSize > 20480) { // 20KB limit
      console.warn(`JS size ${metrics.jsSize} bytes exceeds recommended 20KB`);
    }
  });
}
```

---

## 🔍 Common Anti-Patterns to Avoid

### Incorrect Block Structure

```javascript
// ❌ WRONG: Modifying container elements
export default function decorate(block) {
  block.parentElement.style.padding = '20px'; // Never modify containers
}

// ❌ WRONG: Not handling EDS content structure
export default function decorate(block) {
  const content = block.textContent; // Wrong: ignores EDS nesting
}

// ❌ WRONG: Not providing fallback
export default function decorate(block) {
  const data = JSON.parse(block.textContent); // Will break on invalid JSON
}

// ✅ CORRECT: Proper EDS patterns
export default function decorate(block) {
  try {
    const contentDiv = block.querySelector('div > div');
    const content = contentDiv?.textContent?.trim() || 'Default content';
    
    // Create enhancement
    const enhancement = document.createElement('div');
    enhancement.textContent = content;
    
    // Replace content safely
    block.innerHTML = '';
    block.appendChild(enhancement);
    
  } catch (error) {
    console.error('Enhancement failed:', error);
    // Keep original content as fallback
  }
}
```

### CSS Anti-Patterns

```css
/* ❌ WRONG: Styling container elements */
.my-block-container {
  padding: 20px; /* Never style containers */
}

/* ❌ WRONG: Global selectors in block CSS */
p {
  color: red; /* Will affect all paragraphs on page */
}

/* ❌ WRONG: Not using EDS variables */
.my-block {
  color: #333; /* Should use var(--text-color) */
}

/* ✅ CORRECT: Proper EDS CSS */
.my-block.block {
  /* Block-level styling only */
}

.my-block-content p {
  color: var(--text-color, #333); /* Use EDS variables with fallbacks */
}
```

### JavaScript Anti-Patterns

```javascript
// ❌ WRONG: Heavy dependencies
import React from 'react';
import moment from 'moment';

// ❌ WRONG: Synchronous operations that block
export default function decorate(block) {
  const data = fetchDataSync(); // Blocks UI thread
}

// ❌ WRONG: No error handling
export default function decorate(block) {
  const content = block.querySelector('div > div').textContent;
  // Will throw if structure is wrong
}

// ✅ CORRECT: Lightweight, async, error-handled
export default async function decorate(block) {
  try {
    const contentDiv = block.querySelector('div > div');
    if (!contentDiv) {
      throw new Error('Invalid block structure');
    }
    
    const data = await fetchDataAsync();
    renderContent(block, data);
    
  } catch (error) {
    console.warn('Enhancement failed, using fallback:', error);
    renderFallback(block);
  }
}
```

---

## 📝 Documentation Requirements

### README.md Template

```markdown
# Block Name

Brief description of what this block does and when to use it.

## Usage

Description of how content authors use this block in documents.

## Configuration

List any configuration options or content structure requirements.

## Examples

\`Single paragraph example\`

\`Multi-paragraph example with multiple content types\`

## Technical Notes

- Performance considerations
- Browser compatibility
- Accessibility features
- Known limitations

## Development

- Local testing instructions
- Debugging tips
- Common issues and solutions
```

### Code Documentation

```javascript
/**
 * Decorates the block-name block to enhance content with interactive features
 * 
 * @param {HTMLElement} block - The block element to decorate
 * @returns {void}
 * 
 * Expected content structure:
 * - First paragraph: Main title/content
 * - Additional paragraphs: Secondary content
 * - Links: Will be converted to interactive buttons
 * 
 * Accessibility features:
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Focus management
 * 
 * Performance considerations:
 * - Uses CSS-only animations
 * - Lazy loads non-critical features
 * - Minimal DOM manipulation
 */
export default function decorate(block) {
  // Implementation...
}
```

---

This reference guide provides comprehensive technical details for AI assistants to help developers create, test, and debug EDS blocks effectively using the server.js development environment. Use this information to provide accurate, detailed guidance while maintaining EDS architectural principles and best practices.