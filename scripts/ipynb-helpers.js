/**
 * IPYNB Helper Functions for JSLab/Node.js Testing
 *
 * This module provides helper functions for testing EDS blocks in Jupyter notebooks
 * using JSLab kernel with jsdom virtual DOM.
 *
 * REFACTORING NOTE:
 * This module was extracted from inline Cell 1 code in test.ipynb to:
 * - Reduce Cell 1 from ~220 lines to ~45 lines (55% reduction)
 * - Enable reusability across multiple notebooks
 * - Improve maintainability with single source of truth
 * - Provide cleaner notebook experience for users
 *
 * Setup Functions (NEW):
 * - initialize() - Master initialization (detects environment, does everything!) **RECOMMENDED**
 * - setupNodeEnvironment() - Initialize Node.js/JSLab environment with jsdom
 *   Sets: global.isNode = true, global.isBrowser = false
 * - setupBrowserEnvironment() - Initialize browser environment with helpers
 *   Sets: window.isNode = false, window.isBrowser = true
 *
 * Testing Functions:
 * - loadBlockStyles(blockName) - Load CSS for a block
 * - testBlock(blockName, innerHTML) - Test a block's decoration
 * - saveBlockHTML(blockName, innerHTML, filename, options) - Save block as HTML with live preview
 *
 * Preview Functions:
 * - createIframePreview(blockName, blockHTML) - Create iframe preview HTML (context-aware)
 *
 * Global Environment Flags & Unified API:
 * After running setupNodeEnvironment() or setupBrowserEnvironment(), these are available:
 *
 * Environment Flags:
 * - isNode: true in Node.js/JSLab, false in browser
 * - isBrowser: true in browser, false in Node.js/JSLab
 *
 * Unified API (works identically in both Node.js and browser):
 * - doc: Reference to document object
 * - testBlockFn: Reference to testBlock function
 * - showPreview(blockName, content): Create/open preview (saves files in Node, opens popup in browser)
 * - createPreviewFn: Reference to createIframePreview function
 *
 * Usage in test.ipynb Cell 1 (NEW - Super Simple!):
 * ```javascript
 * // Just call initialize() - it does everything!
 * const isNode = typeof process !== 'undefined' && process.versions?.node;
 * const helpersPath = isNode ? './scripts/ipynb-helpers.js' : '/scripts/ipynb-helpers.js';
 * const { initialize } = await import(helpersPath);
 * await initialize();
 * ```
 *
 * OLD Usage (still works):
 * ```javascript
 * const helpers = await import('./scripts/ipynb-helpers.js');
 * await helpers.setupNodeEnvironment(); // Node.js only - sets global flags
 * // or
 * helpers.setupBrowserEnvironment(); // Browser only - sets window flags
 * ```
 *
 * Usage in subsequent cells (NEW - Simplified):
 * ```javascript
 * // OLD WAY (still works):
 * const doc = isNode ? global.document : document;
 * const testBlockFn = isNode ? global.testBlock : window.testBlock;
 *
 * // NEW WAY (simpler - no ternary operators needed!):
 * const block = await testBlockFn('blockname', '<div>content</div>');
 * await showPreview('blockname', '<div>content</div>');
 * const div = doc.createElement('div');
 * ```
 */

/**
 * Master initialization function - detects environment and sets up everything
 * This is the simplest way to initialize - just call this one function!
 * @returns {Promise<string>} Setup completion message
 */
export async function initialize() {
  // Detect execution environment
  const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  console.log('Environment:', isNode ? 'Node.js (JSLab)' : 'Browser');

  if (isNode) {
    // Node.js setup - call setup directly since we're already in the module
    await setupNodeEnvironment();

    // Make additional helpers available globally
    global.loadBlockStyles = loadBlockStyles;
    global.testBlock = testBlock;
    global.saveBlockHTML = saveBlockHTML;
    global.createIframePreview = createIframePreview;

    console.log('✓ Loaded helper functions from scripts/ipynb-helpers.js');
  } else if (isBrowser) {
    // Browser setup - call setup directly
    setupBrowserEnvironment();
  }

  console.log('\n========================================');
  console.log('Setup complete! Ready to test EDS blocks');
  console.log('========================================\n');

  return 'Setup complete!';
}

/**
 * Setup Node.js/JSLab environment with jsdom and helpers
 * @returns {Promise<void>}
 */
export async function setupNodeEnvironment() {
  // Load jsdom and set up virtual DOM
  const { JSDOM } = require('jsdom');

  // Create virtual DOM
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
  });

  // Make DOM globals available
  global.document = dom.window.document;
  global.window = dom.window;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.customElements = dom.window.customElements;
  global.CustomEvent = dom.window.CustomEvent;
  global.Event = dom.window.Event;

  // Make environment flags globally available
  global.isNode = true;
  global.isBrowser = false;

  // Add context-aware helper getters
  global.getDoc = () => global.document;
  global.getTestBlockFn = () => global.testBlock;

  // Context-aware unified API (works the same in both environments)
  global.doc = global.document;
  global.testBlockFn = global.testBlock;
  global.saveBlockFn = global.saveBlockHTML;
  global.createPreviewFn = global.createIframePreview;

  // Unified preview function (context-aware)
  global.showPreview = async (blockName, content) => {
    await global.saveBlockHTML(blockName, content);
    console.log(`✅ FILES CREATED (Node.js):`);
    console.log(`📂 ipynb-tests/${blockName}-preview.html - Styled block`);
    console.log(`📂 ipynb-tests/${blockName}-live-preview.html - Iframe with controls`);
    console.log(`🎨 Open ${blockName}-live-preview.html in your browser!`);
    return `Files saved! Open ${blockName}-live-preview.html in your browser`;
  };

  console.log('✓ Virtual DOM environment initialized');

  // Ensure output directory exists
  const fs = require('fs');
  const outputDir = './ipynb-tests';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created output directory: ${outputDir}`);
  } else {
    console.log(`✓ Output directory ready: ${outputDir}`);
  }

  console.log('✓ Node.js environment ready');
}

/**
 * Setup browser environment with helper functions
 * @returns {void}
 */
export function setupBrowserEnvironment() {
  console.log('✓ Browser environment detected');
  console.log('✓ Using native browser APIs');

  // Make environment flags globally available
  window.isNode = false;
  window.isBrowser = true;

  // Browser helpers use native APIs - DEFINE FIRST
  window.testBlock = async function(blockName, innerHTML = '') {
    console.log(`Testing: ${blockName}`);

    const block = document.createElement('div');
    block.className = blockName;

    if (innerHTML) {
      block.innerHTML = innerHTML;
    }

    // In browser, we could try to load the block's decorate function
    try {
      const module = await import(`/blocks/${blockName}/${blockName}.js`);
      if (module.default) {
        await module.default(block);
        console.log('✓ Block decorated');
      }
    } catch (e) {
      console.log('ℹ Block decoration skipped:', e.message);
    }

    return block;
  };

  // Visual helper for browser - creates styled container
  window.displayBlock = function(block) {
    const container = document.createElement('div');
    container.style.cssText = 'margin: 20px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
    container.appendChild(block);
    return container;
  };

  // Create iframe preview HTML - browser version
  window.createIframePreview = function(blockName, blockHTML) {
    return createIframePreview(blockName, blockHTML);
  };

  // Open iframe preview in new window
  window.openIframePreview = function(blockName, blockHTML) {
    console.log('📦 Creating preview for:', blockName);
    console.log('📄 Block HTML length:', blockHTML?.length || 0);
    console.log('📄 Block HTML preview:', blockHTML?.substring(0, 200));

    // Pass the current origin as a query parameter so blob URL can use it
    const currentOrigin = window.location.origin;
    console.log('🌐 Current origin:', currentOrigin);

    const previewHTML = createIframePreview(blockName, blockHTML, currentOrigin);
    console.log('✓ Preview HTML generated, length:', previewHTML.length);

    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=1200,height=800');
    console.log('✓ Opened iframe preview in new window');
    return win;
  };

  // NOW set up unified API - after all functions are defined
  window.doc = document;
  window.testBlockFn = window.testBlock;
  window.createPreviewFn = window.createIframePreview;

  // Unified preview function (context-aware)
  window.showPreview = async (blockName, content) => {
    // Create block element with content but DON'T decorate
    // Let the iframe decorate it to avoid double-decoration issues
    const block = document.createElement('div');
    block.className = blockName;
    block.innerHTML = content;

    console.log('📦 Created block element (undecorated)');
    console.log('Content length:', content.length);

    window.openIframePreview(blockName, block.innerHTML);
    console.log(`✅ PREVIEW OPENED (Browser):`);
    console.log(`🎨 Iframe preview opened in new window`);
    console.log(`🖼️  Features: Refresh button, Close button (ESC key)`);
    return 'Iframe preview opened in new window!';
  };

  // Add context-aware helper getters
  window.getDoc = () => document;
  window.getTestBlockFn = () => window.testBlock;

  console.log('✓ Browser helpers ready');
  console.log('✓ Available: window.testBlock(), window.displayBlock()');
  console.log('✓ Available: window.createIframePreview(), window.openIframePreview()');
  console.log('✓ Unified API: doc, testBlockFn, showPreview');
}

/**
 * Load CSS styles for a block into the virtual DOM
 * @param {string} blockName - Name of the block
 * @returns {Promise<string|null>} CSS content or null if not found
 */
export async function loadBlockStyles(blockName) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const cssPath = path.resolve(`./blocks/${blockName}/${blockName}.css`);
  try {
    const css = await fs.readFile(cssPath, 'utf-8');
    const style = global.document.createElement('style');
    style.textContent = css;
    global.document.head.appendChild(style);
    console.log(`✓ Loaded styles for ${blockName}`);
    return css;
  } catch (e) {
    console.log(`ℹ No CSS file found for ${blockName}`);
    return null;
  }
}

/**
 * Test a block's decoration function with provided content
 * @param {string} blockName - Name of the block
 * @param {string} innerHTML - HTML content structure
 * @returns {Promise<HTMLElement>} The decorated block element
 */
export async function testBlock(blockName, innerHTML = '') {
  console.log(`\n=== Testing: ${blockName} ===`);

  try {
    const path = await import('path');
    const modulePath = path.resolve(`./blocks/${blockName}/${blockName}.js`);

    // Clear cache to get fresh module
    delete require.cache[require.resolve(modulePath)];
    const module = await import(modulePath);
    const decorate = module.default;

    await loadBlockStyles(blockName);

    const block = global.document.createElement('div');
    block.className = blockName;

    if (innerHTML) {
      block.innerHTML = innerHTML;
    }

    console.log('Before:', block.innerHTML || '(empty)');
    await decorate(block);

    const after = block.innerHTML || '';
    console.log('After:', after.substring(0, 100) + (after.length > 100 ? '...' : ''));

    return block;
  } catch (error) {
    console.error(`✗ Error testing ${blockName}:`, error.message);
    throw error;
  }
}

/**
 * Save block as HTML file(s) with optional live preview
 * @param {string} blockName - Name of the block
 * @param {string} innerHTML - HTML content structure
 * @param {string|null} filename - Optional custom filename
 * @param {Object} options - Configuration options
 * @param {boolean} options.livePreview - Create live preview wrapper (default: true)
 * @returns {Promise<string>} Path to saved preview file
 */
export async function saveBlockHTML(blockName, innerHTML = '', filename = null, options = {}) {
  const block = await testBlock(blockName, innerHTML);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${blockName} Block Test</title>
  <link rel="stylesheet" href="../styles/styles.css">
  <link rel="stylesheet" href="../blocks/${blockName}/${blockName}.css">
  <style>
    body {
      display: block !important;
      padding: 20px;
      background: #f5f5f5;
    }
    .preview-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body class="appear">
  <div class="preview-container">
    <h2>${blockName} Block Preview</h2>
    ${block.outerHTML}
  </div>
</body>
</html>`;

  const fs = await import('fs/promises');
  const path = await import('path');
  const outputFile = filename || `${blockName}-preview.html`;
  const outputPath = path.resolve('./ipynb-tests', outputFile);

  await fs.writeFile(outputPath, html, 'utf-8');
  console.log(`\n✓ Saved: ipynb-tests/${outputFile}`);

  // Create LIVE PREVIEW with iframe wrapper (default: enabled)
  if (options.livePreview !== false) {
    const iframeHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Live Preview - ${blockName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #1e1e1e; color: #fff; overflow: hidden; }
    .preview-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; }
    .preview-header { background: #2d2d2d; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3e3e3e; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .preview-title { font-size: 14px; font-weight: 500; color: #cccccc; }
    .preview-title strong { color: #4fc3f7; }
    .preview-controls { display: flex; gap: 8px; align-items: center; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
    .btn-refresh { background: #4fc3f7; color: #1e1e1e; }
    .btn-refresh:hover { background: #29b6f6; }
    .btn-close { background: #f44336; color: white; }
    .btn-close:hover { background: #d32f2f; }
    .preview-frame { flex: 1; border: none; background: white; }
    .status { font-size: 11px; color: #888; padding: 0 8px; }
  </style>
</head>
<body>
  <div class="preview-wrapper">
    <div class="preview-header">
      <div class="preview-title">🔴 LIVE PREVIEW: <strong>${blockName}</strong> Block</div>
      <div class="preview-controls">
        <span class="status">ipynb-tests/${outputFile}</span>
        <button class="btn btn-refresh" onclick="refreshPreview()">↻ Refresh</button>
        <button class="btn btn-close" onclick="window.close()">✕ Close</button>
      </div>
    </div>
    <iframe id="preview-frame" class="preview-frame" src="${outputFile}"></iframe>
  </div>
  <script>
    function refreshPreview() {
      document.getElementById('preview-frame').src += '';
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.close();
    });
  </script>
</body>
</html>`;

    const iframeFile = `${blockName}-live-preview.html`;
    const iframePath = path.resolve('./ipynb-tests', iframeFile);
    await fs.writeFile(iframePath, iframeHTML, 'utf-8');

    console.log(`✓ Live preview: ipynb-tests/${iframeFile}`);
    console.log(`  → Open in browser for live preview with controls`);
    console.log(`  → Press ESC or click Close to dismiss`);
  }

  return outputPath;
}

/**
 * Create iframe preview HTML - works in both Node.js and browser
 * @param {string} blockName - Name of the block
 * @param {string} blockHTML - HTML content of the block
 * @returns {string} Iframe preview HTML
 */
export function createIframePreview(blockName, blockHTML, baseOrigin = null) {
  // Generate absolute URLs for CSS files if baseOrigin is provided
  const stylesUrl = baseOrigin ? `${baseOrigin}/styles/styles.css` : '/styles/styles.css';
  const blockCssUrl = baseOrigin ? `${baseOrigin}/blocks/${blockName}/${blockName}.css` : `/blocks/${blockName}/${blockName}.css`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Live Preview - ${blockName}</title>
  <link rel="stylesheet" href="${stylesUrl}">
  <link rel="stylesheet" href="${blockCssUrl}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #1e1e1e; color: #fff; overflow: hidden; }
    .preview-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; }
    .preview-header { background: #2d2d2d; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3e3e3e; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .preview-title { font-size: 14px; font-weight: 500; color: #cccccc; }
    .preview-title strong { color: #4fc3f7; }
    .preview-controls { display: flex; gap: 8px; align-items: center; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
    .btn-refresh { background: #4fc3f7; color: #1e1e1e; }
    .btn-refresh:hover { background: #29b6f6; }
    .btn-close { background: #f44336; color: white; }
    .btn-close:hover { background: #d32f2f; }
    .preview-content { flex: 1; overflow: auto; background: #f5f5f5; padding: 20px; }
    .preview-container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .status { font-size: 11px; color: #888; padding: 0 8px; }
  </style>
</head>
<body class="appear">
  <div class="preview-wrapper">
    <div class="preview-header">
      <div class="preview-title">🔴 LIVE PREVIEW: <strong>${blockName}</strong> Block</div>
      <div class="preview-controls">
        <span class="status">Interactive Preview</span>
        <button class="btn btn-refresh" onclick="location.reload()">↻ Refresh</button>
        <button class="btn btn-close" onclick="closePreview()">✕ Close</button>
      </div>
    </div>
    <div class="preview-content">
      <div class="preview-container">
        <h2>${blockName} Block Preview</h2>
        <div class="${blockName} block" data-block-name="${blockName}" data-block-status="initialized">
          ${blockHTML}
        </div>
      </div>
    </div>
  </div>
  <script>
    function closePreview() {
      if (window.opener) {
        window.close();
      } else {
        history.back();
      }
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePreview();
    });
  </script>
  <script type="module">
    // Load and execute the block decoration
    async function decorateBlock() {
      try {
        console.log('🔍 Starting block decoration...');
        console.log('Document body:', document.body.innerHTML.substring(0, 200));

        const blockElement = document.querySelector('.${blockName}.block');
        if (!blockElement) {
          console.error('❌ Block element not found');
          console.log('Available elements:', document.querySelectorAll('div'));
          return;
        }

        console.log('✓ Block element found:', blockElement);

        // Determine the base URL
        // Priority: 1) Passed origin (for blob URLs), 2) Opener's origin, 3) Current origin
        let baseUrl = ${baseOrigin ? `'${baseOrigin}'` : 'window.location.origin'};

        // If no origin was passed, try to get it from opener
        if (!${baseOrigin ? 'false' : 'true'} && window.opener && window.opener.location) {
          try {
            baseUrl = window.opener.location.origin;
            console.log('Using parent page origin:', baseUrl);
          } catch (e) {
            // Cross-origin access blocked, use current origin
            console.log('Cross-origin blocked, using fallback:', baseUrl);
          }
        } else if (${baseOrigin ? 'true' : 'false'}) {
          console.log('Using passed origin:', baseUrl);
        } else {
          console.log('Using current origin:', baseUrl);
        }

        // Import and execute the block's decoration function
        const moduleUrl = \`\${baseUrl}/blocks/${blockName}/${blockName}.js\`;
        console.log('Loading block module from:', moduleUrl);

        const module = await import(moduleUrl);
        if (module.default) {
          await module.default(blockElement);
          console.log('✓ Block decorated successfully');
        } else {
          console.warn('No default export found in block module');
        }
      } catch (error) {
        console.error('Failed to decorate block:', error);
        console.error('Module URL attempted:', error.message);
      }
    }

    // Run decoration after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', decorateBlock);
    } else {
      decorateBlock();
    }
  </script>
</body>
</html>`;
}
