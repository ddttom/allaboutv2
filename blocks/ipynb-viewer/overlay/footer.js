/**

* Footer Manager - Creates unified footer bar for navigation
* Shows page navigation for notebook view, tree navigation for markdown view
 */

export function createFooter({ config, navigationState }) {
  const footer = document.createElement('div');
  footer.className = 'ipynb-pagination'; // Reuse existing pagination CSS
  footer.style.display = 'none'; // Hidden by default

  const prevButton = document.createElement('button');
  prevButton.className = 'ipynb-pagination-button ipynb-prev-button';
  prevButton.textContent = config.buttonLabels.previous;

  const pageInfo = document.createElement('span');
  pageInfo.className = 'ipynb-page-info';

  const nextButton = document.createElement('button');
  nextButton.className = 'ipynb-pagination-button ipynb-next-button';
  nextButton.textContent = config.buttonLabels.next;

  footer.appendChild(prevButton);
  footer.appendChild(pageInfo);
  footer.appendChild(nextButton);

  let currentHandler = null;

  return {
    element: footer,

    /**
     * Configure footer for notebook pagination
     */
    setNotebookMode: (totalPages, currentPage, onPrevious, onNext) => {
      footer.style.display = 'flex';
      pageInfo.textContent = `${currentPage + 1} / ${totalPages}`;

      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === totalPages - 1;

      // Remove old handlers
      if (currentHandler) {
        prevButton.removeEventListener('click', currentHandler.prev);
        nextButton.removeEventListener('click', currentHandler.next);
      }

      // Add new handlers
      currentHandler = {
        prev: () => { if (onPrevious) onPrevious(); },
        next: () => { if (onNext) onNext(); },
      };

      prevButton.addEventListener('click', currentHandler.prev);
      nextButton.addEventListener('click', currentHandler.next);
    },

    /**
     * Configure footer for markdown tree navigation
     */
    setMarkdownMode: (navigationTree, currentPath, onNavigate) => {
      footer.style.display = 'flex';

      // Get all navigable nodes (markdown files) in tree order
      const allNodes = getAllNavigableNodes(navigationTree);
      // eslint-disable-next-line no-console
      console.log('[FOOTER] setMarkdownMode called with:', { currentPath, totalNodes: allNodes.length });

      const currentNode = findNodeByPath(navigationTree, currentPath);
      // eslint-disable-next-line no-console
      console.log('[FOOTER] Found current node:', currentNode);

      const currentIndex = allNodes.indexOf(currentNode);
      // eslint-disable-next-line no-console
      console.log('[FOOTER] Current index:', currentIndex, 'of', allNodes.length);

      const prevNode = allNodes[currentIndex - 1];
      const nextNode = allNodes[currentIndex + 1];

      prevButton.disabled = !prevNode || currentIndex === 0;
      nextButton.disabled = !nextNode || currentIndex === allNodes.length - 1;

      // Show position like "3 / 15"
      pageInfo.textContent = currentNode ? `${currentIndex + 1} / ${allNodes.length}` : '';

      // Remove old handlers
      if (currentHandler) {
        prevButton.removeEventListener('click', currentHandler.prev);
        nextButton.removeEventListener('click', currentHandler.next);
      }

      // Add new handlers
      currentHandler = {
        prev: () => { if (prevNode && onNavigate) onNavigate(prevNode); },
        next: () => { if (nextNode && onNavigate) onNavigate(nextNode); },
      };

      prevButton.addEventListener('click', currentHandler.prev);
      nextButton.addEventListener('click', currentHandler.next);
    },

    /**
     * Hide footer
     */
    hide: () => {
      footer.style.display = 'none';
    },

    /**
     * Update page info text
     */
    updatePageInfo: (text) => {
      pageInfo.textContent = text;
    },

    /**
     * Update button states
     */
    updateButtons: (prevDisabled, nextDisabled) => {
      prevButton.disabled = prevDisabled;
      nextButton.disabled = nextDisabled;
    },
  };
}

/**

* Get all navigable nodes (markdown files) in tree order
 */
function getAllNavigableNodes(tree) {
  if (!tree) {
    // eslint-disable-next-line no-console
    console.log('[FOOTER] getAllNavigableNodes: tree is null/undefined');
    return [];
  }

  // eslint-disable-next-line no-console
  console.log('[FOOTER] getAllNavigableNodes: tree root:', tree);

  const nodes = [];

  function traverse(node, depth = 0) {
    // eslint-disable-next-line no-console
    console.log(`[FOOTER] Traversing node at depth ${depth}:`, { type: node.type, path: node.path, label: node.label, hasChildren: !!node.children });

    // Only include markdown file nodes, not folders or root
    if (node.type === 'markdown' && node.path) {
      // eslint-disable-next-line no-console
      console.log('[FOOTER] Found markdown node:', node);
      nodes.push(node);
    }

    // Recurse into children
    if (node.children) {
      node.children.forEach((child) => traverse(child, depth + 1));
    }
  }

  // Handle case where tree is an array at the root level
  if (Array.isArray(tree)) {
    // eslint-disable-next-line no-console
    console.log('[FOOTER] Tree is an array with', tree.length, 'root nodes');
    tree.forEach((rootNode) => traverse(rootNode, 0));
  } else {
    traverse(tree, 0);
  }

  // eslint-disable-next-line no-console
  console.log('[FOOTER] Total navigable nodes found:', nodes.length);
  return nodes;
}

/**

* Find a node in the tree by its path
 */
function findNodeByPath(tree, path) {
  if (!tree || !path) {
    // eslint-disable-next-line no-console
    console.log('[FOOTER] findNodeByPath: Invalid input', { tree: !!tree, path });
    return null;
  }

  // Extract just the path component from a full URL
  let searchPath = path;
  if (path.includes('/blob/')) {
    // Convert "https://github.com/user/repo/blob/main/file.md" to "file.md"
    const parts = path.split('/blob/');
    if (parts[1]) {
      searchPath = parts[1].split('/').slice(1).join('/'); // Remove branch, keep path
    }
  }

  // eslint-disable-next-line no-console
  console.log('[FOOTER] Searching for path:', { originalPath: path, searchPath });

  function search(node) {
    if (node.path === searchPath || node.path === path) {
      // eslint-disable-next-line no-console
      console.log('[FOOTER] Found match:', node);
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = search(child);
        if (found) return found;
      }
    }
    return null;
  }

  // Handle case where tree is an array at the root level
  if (Array.isArray(tree)) {
    // eslint-disable-next-line no-console
    console.log('[FOOTER] findNodeByPath: Searching array with', tree.length, 'root nodes');
    for (const rootNode of tree) {
      const found = search(rootNode);
      if (found) return found;
    }
    return null;
  }

  return search(tree);
}
