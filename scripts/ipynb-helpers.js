/**
 * IPYNB Helper Functions for Browser Testing
 *
 * Simple helper functions for testing EDS blocks in Jupyter notebooks.
 * Just import and use - no initialization needed!
 *
 * Usage in any cell:
 * ```javascript
 * const { testBlock, showPreview } = await import('/scripts/ipynb-helpers.js');
 * const block = await testBlock('accordion', '<div>content</div>');
 * await showPreview('accordion', '<div>content</div>');
 * return block.outerHTML;
 * ```
 *
 * **NOTE**: Cell code executes in async context automatically (via AsyncFunction).
 * Just write your code naturally with `await` and `return` - no IIFE wrapper needed!
 */

/**
 * Test a block's decoration in browser
 * @param {string} blockName - Name of the block to test
 * @param {string} [innerHTML=''] - HTML content to place inside the block
 * @returns {Promise<HTMLElement>} The decorated block element
 */
export async function testBlock(blockName, innerHTML = '') {
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
 * Create and show overlay preview with styled block
 * @param {string} blockName - Name of the block
 * @param {string} [innerHTML=''] - HTML content to place inside the block
 * @returns {Promise<string>} Success message
 */
export async function showPreview(blockName, innerHTML = '') {
  // Remove existing overlay if present
  document.querySelector('.ipynb-preview-overlay')?.remove();

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-preview-overlay';
  overlay.innerHTML = `
    <style>
      .ipynb-preview-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
      .ipynb-preview-container{background:#fff;border-radius:8px;width:90%;max-width:1200px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 4px 24px rgba(0,0,0,0.3)}
      .ipynb-preview-header{background:#1e1e1e;color:#fff;padding:12px 20px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center}
      .ipynb-preview-title{font-size:14px;font-weight:500;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
      .ipynb-preview-controls{display:flex;gap:8px}
      .ipynb-preview-btn{background:#2d2d2d;border:1px solid #3e3e3e;color:#fff;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;transition:background .2s}
      .ipynb-preview-btn:hover{background:#3e3e3e}
      .ipynb-preview-content{overflow:auto;padding:20px;flex:1}
    </style>
    <div class="ipynb-preview-container">
      <div class="ipynb-preview-header">
        <div class="ipynb-preview-title">${blockName} Block Preview</div>
        <div class="ipynb-preview-controls">
          <button class="ipynb-preview-btn" onclick="this.closest('.ipynb-preview-overlay').remove()">✕ Close</button>
        </div>
      </div>
      <div class="ipynb-preview-content">
        <div class="${blockName} block">${innerHTML}</div>
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(overlay);

  // Close on ESC key or clicking backdrop
  overlay.addEventListener('keydown', (e) => e.key === 'Escape' && overlay.remove());
  overlay.addEventListener('click', (e) => e.target === overlay && overlay.remove());

  // Focus overlay for keyboard events
  overlay.tabIndex = -1;
  overlay.focus();

  // Decorate the block
  const block = overlay.querySelector(`.${blockName}.block`);
  try {
    const module = await import(`/blocks/${blockName}/${blockName}.js`);
    if (module.default) {
      await module.default(block);
      console.log('✓ Block decorated');
    }
  } catch (error) {
    console.error('Block decoration error:', error);
  }

  return `✓ Preview overlay opened for ${blockName}`;
}
