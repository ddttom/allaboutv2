/**
 * IPYNB Helper Functions for Browser Testing
 *
 * This module provides helper functions for testing EDS blocks in Jupyter notebooks
 * in the browser via the ipynb-viewer block.
 *
 * Setup Functions:
 * - initialize() - Initialize browser environment and register helpers on window object
 *
 * Testing Functions:
 * - testBlockFn(blockName, innerHTML) - Test a block's decoration (available as window.testBlockFn)
 * - showPreview(blockName, innerHTML) - Open popup window with styled preview (available as window.showPreview)
 *
 * Global Functions (Available After initialize()):
 * After running initialize(), these are available on the window object:
 * - window.testBlockFn(blockName, content) - Test block decoration
 * - window.showPreview(blockName, content) - Open popup preview
 * - window.doc - Reference to document object
 *
 * Usage in test.ipynb Cell 1:
 * ```javascript
 * const { initialize } = await import('/scripts/ipynb-helpers.js');
 * await initialize();
 * return '✅ Browser environment ready';
 * ```
 *
 * Usage in subsequent cells:
 * ```javascript
 * const block = await window.testBlockFn('blockname', '<div>content</div>');
 * await window.showPreview('blockname', '<div>content</div>');
 * const div = window.doc.createElement('div');
 * return block.outerHTML;
 * ```
 *
 * **NOTE**: Cell code executes in async context automatically (via AsyncFunction).
 * Just write your code naturally with `await` and `return` - no IIFE wrapper needed!
 */

/**
 * Master initialization function - sets up browser environment
 * @returns {Promise<void>}
 */
export async function initialize() {
  setupBrowserEnvironment();
  console.log('✅ Browser environment ready');
}

/**
 * Setup browser environment with helper functions
 */
function setupBrowserEnvironment() {
  // Register document shorthand
  window.doc = document;

  // Register helper functions
  window.testBlockFn = testBlock;
  window.showPreview = showPreview;
}

/**
 * Test a block's decoration in browser
 * @param {string} blockName - Name of the block to test
 * @param {string} [innerHTML=''] - HTML content to place inside the block
 * @returns {Promise<HTMLElement>} The decorated block element
 */
async function testBlock(blockName, innerHTML = '') {
  // Create block element
  const block = document.createElement('div');
  block.className = `${blockName} block`;
  block.innerHTML = innerHTML;

  try {
    // Import and run the block's decoration function
    const module = await import(`/blocks/${blockName}/${blockName}.js`);
    if (module.default) {
      await module.default(block);
    } else {
      throw new Error(`Block module ${blockName} does not export a default function`);
    }

    return block;
  } catch (error) {
    console.error(`Error testing block ${blockName}:`, error);
    throw error;
  }
}

/**
 * Create and open popup window with styled preview
 * @param {string} blockName - Name of the block
 * @param {string} [innerHTML=''] - HTML content to place inside the block
 * @returns {Promise<string>} Success message
 */
async function showPreview(blockName, innerHTML = '') {
  // Decorate the block
  const block = await testBlock(blockName, innerHTML);

  // Get current origin for base tag
  const currentOrigin = window.location.origin;

  // Create HTML with base tag and minimal DOM structure
  const html = `<!DOCTYPE html>
<html>
<head>
  <base href="${currentOrigin}/">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blockName} Preview</title>
  <link rel="stylesheet" href="styles/styles.css">
  <link rel="stylesheet" href="blocks/${blockName}/${blockName}.css">
  <style>
    /* Fixed position header - doesn't affect document flow */
    .preview-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      background: #1e1e1e;
      color: #fff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .preview-title {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }
    .preview-controls {
      display: flex;
      gap: 8px;
    }
    .preview-btn {
      background: #2d2d2d;
      border: 1px solid #3e3e3e;
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-family: inherit;
      transition: background 0.2s;
    }
    .preview-btn:hover {
      background: #3e3e3e;
    }
    /* Main content area - top padding to clear fixed header */
    main {
      padding-top: 68px; /* 48px header + 20px gap */
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 40px;
    }
    /* Ensure block is direct child of main - no wrapper divs! */
    body {
      margin: 0;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div class="preview-header">
    <div class="preview-title">${blockName} Block Preview</div>
    <div class="preview-controls">
      <button class="preview-btn" onclick="location.reload()">↻ Refresh</button>
      <button class="preview-btn" onclick="window.close()">✕ Close</button>
    </div>
  </div>
  <main>
    ${block.outerHTML}
  </main>
  <script type="module">
    // Decorate the block after page loads
    const blockElement = document.querySelector('.${blockName}.block');
    if (blockElement) {
      try {
        // Get base URL from base tag
        const baseUrl = document.querySelector('base')?.href || window.location.origin;
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

        // Import and decorate
        const module = await import(\`\${cleanBaseUrl}/blocks/${blockName}/${blockName}.js\`);
        if (module.default) {
          // Block is already decorated (testBlock did it), but we import to ensure JS loads
          console.log('✓ Block JavaScript loaded');
        }
      } catch (error) {
        console.error('Error loading block JavaScript:', error);
      }
    }

    // Allow ESC key to close window
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.close();
      }
    });
  </script>
</body>
</html>`;

  // Create blob URL and open popup
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const popup = window.open(url, '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no');

  if (!popup) {
    console.warn('⚠ Popup blocked! Please allow popups for this site.');
    return '⚠ Popup blocked - please allow popups and try again';
  }

  // Clean up blob URL after popup loads
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return `✓ Preview window opened for ${blockName}`;
}

// Export functions for direct import (if needed)
export { testBlock, showPreview };
