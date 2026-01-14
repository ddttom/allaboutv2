/**
 * Example Usage of Unified Overlay
 * This file demonstrates how to use the unified overlay system
 */

import { createNotebookOverlay, createMarkdownOverlay } from './integration.js';

/**
 * Example 1: Create and show notebook overlay
 */
function exampleNotebook() {
  const cells = [
    {
      cell_type: 'markdown',
      source: ['# Welcome\n', 'This is a notebook.'],
      metadata: {},
    },
    {
      cell_type: 'code',
      source: ['console.log("Hello World!");'],
      metadata: {},
      outputs: [],
    },
  ];

  const overlay = createNotebookOverlay(cells, {
    title: 'My Notebook',
    repo: 'https://github.com/user/repo',
    branch: 'main',
    autorun: false,
  });

  overlay.show();

  return overlay;
}

/**
 * Example 2: Create and show markdown overlay
 */
function exampleMarkdown() {
  const overlay = createMarkdownOverlay(
    'https://github.com/user/repo/blob/main/docs/README.md',
    'README',
    {
      repo: 'https://github.com/user/repo',
      branch: 'main',
    },
  );

  // Overlay automatically shows and navigates to the markdown file
  return overlay;
}

/**
 * Example 3: Navigate between content
 */
function exampleNavigation() {
  const overlay = createNotebookOverlay(cells, { title: 'Demo' });
  overlay.show();

  // Navigate to different cell
  overlay.navigate({
    mode: 'notebook',
    type: 'cell',
    identifier: 'cell-5',
    title: 'Cell 5',
  });

  // Navigate to markdown file
  overlay.navigate({
    mode: 'markdown',
    type: 'file',
    identifier: 'docs/guide.md',
    title: 'Guide',
  });

  // Go home (back to first cell)
  overlay.home();

  return overlay;
}

/**
 * Example 4: Mode switching
 */
function exampleModeSwitching() {
  const overlay = createNotebookOverlay(cells, {
    title: 'Notebook',
    repo: 'https://github.com/user/repo',
  });

  overlay.show();

  // Switch to markdown mode
  overlay.updateMode('markdown');

  // Navigate to markdown file
  overlay.navigate({
    mode: 'markdown',
    identifier: 'README.md',
    title: 'README',
  });

  // Switch back to notebook mode
  overlay.updateMode('notebook');
  overlay.home();

  return overlay;
}

export {
  exampleNotebook,
  exampleMarkdown,
  exampleNavigation,
  exampleModeSwitching,
};
