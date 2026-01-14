/**
 * Integration Module
 * Creates overlay instances for the ipynb-viewer block
 */

import createUnifiedOverlay from './unified-overlay.js';
import renderNotebookContent from './renderers/notebook.js';
import renderMarkdownContent from './renderers/markdown.js';
import createUnifiedNavigationTree from './tree.js';

/**
 * Create notebook overlay
 * @param {Array} cells - Notebook cells
 * @param {Object} metadata - Notebook metadata
 * @returns {Object} Overlay instance
 */
function createNotebookOverlay(cells, metadata = {}) {
  const overlay = createUnifiedOverlay({
    mode: 'notebook',
    content: { cells },
    metadata: {
      title: metadata.title || 'Notebook',
      repo: metadata.repo,
      branch: metadata.branch || 'main',
      autorun: metadata.autorun || false,
      help: metadata.help,
    },
    renderers: {
      notebook: renderNotebookContent,
      markdown: renderMarkdownContent,
    },
  });

  // Create navigation tree
  const state = overlay.getState();
  const tree = createUnifiedNavigationTree(
    state,
    state.element?.querySelector('.ipynb-nav-tree-panel'),
    (target) => overlay.navigate(target),
  );

  state.tree = tree;
  state.overlay = overlay;

  return overlay;
}

/**
 * Create markdown overlay
 * @param {string} url - Markdown file URL
 * @param {string} title - Title
 * @param {Object} options - Additional options
 * @returns {Object} Overlay instance
 */
function createMarkdownOverlay(url, title, options = {}) {
  const overlay = createUnifiedOverlay({
    mode: 'markdown',
    content: {},
    metadata: {
      title,
      repo: options.repo,
      branch: options.branch || 'main',
      help: options.help,
    },
    renderers: {
      notebook: renderNotebookContent,
      markdown: renderMarkdownContent,
    },
  });

  // Create navigation tree
  const state = overlay.getState();
  const tree = createUnifiedNavigationTree(
    state,
    state.element?.querySelector('.ipynb-nav-tree-panel'),
    (target) => overlay.navigate(target),
  );

  state.tree = tree;
  state.overlay = overlay;

  // Navigate to the markdown file
  overlay.show({
    mode: 'markdown',
    type: 'file',
    identifier: url,
    title,
  });

  return overlay;
}

export { createNotebookOverlay, createMarkdownOverlay };
