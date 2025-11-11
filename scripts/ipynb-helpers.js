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
 * Global Environment Flags:
 * After running setupNodeEnvironment() or setupBrowserEnvironment(), these flags are available:
 * - isNode: true in Node.js/JSLab, false in browser
 * - isBrowser: true in browser, false in Node.js/JSLab
 * Use these flags in subsequent cells without re-detecting the environment.
 *
 * Usage in test.ipynb Cell 1:
 * ```javascript
 * const helpers = await import('./scripts/ipynb-helpers.js');
 * await helpers.setupNodeEnvironment(); // Node.js only - sets global flags
 * // or
 * helpers.setupBrowserEnvironment(); // Browser only - sets window flags
 * ```
 *
 * Usage in subsequent cells:
 * ```javascript
 * // Simply use the global flags directly
 * const doc = isNode ? global.document : document;
 * const testBlockFn = isNode ? global.testBlock : window.testBlock;
 * ```
 */

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

  // Browser helpers use native APIs
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
    const previewHTML = createIframePreview(blockName, blockHTML);
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=1200,height=800');
    console.log('✓ Opened iframe preview in new window');
    return win;
  };

  console.log('✓ Browser helpers ready');
  console.log('✓ Available: window.testBlock(), window.displayBlock()');
  console.log('✓ Available: window.createIframePreview(), window.openIframePreview()');
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
export function createIframePreview(blockName, blockHTML) {
  return `<!DOCTYPE html>
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
    .preview-content { flex: 1; overflow: auto; background: #f5f5f5; padding: 20px; }
    .preview-container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .status { font-size: 11px; color: #888; padding: 0 8px; }
  </style>
</head>
<body>
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
        ${blockHTML}
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
</body>
</html>`;
}
