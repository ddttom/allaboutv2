/**
 * Unified Navigation Tree
 * Single tree that shows notebook cells, repository files, and help pages
 */

/**
 * Create unified navigation tree
 * @param {Object} state - State object
 * @param {HTMLElement} treePanel - Tree panel element
 * @param {Function} onNodeClick - Callback when node is clicked
 * @returns {Object} Tree API
 */
function createUnifiedNavigationTree(state, treePanel, onNodeClick) {
  // Tree state
  const treeState = {
    expandedNodes: new Set(['notebook', 'repository', 'help']),
    selectedNode: null,
  };

  /**
   * Build tree structure from state
   * @returns {Array} Tree nodes
   */
  function buildTree() {
    const tree = [];

    // Notebook section (if we have notebook content)
    if (state.content && state.content.cells) {
      tree.push(buildNotebookSection(state.content.cells));
    }

    // Repository section (if we have repo metadata)
    if (state.metadata && state.metadata.repo) {
      tree.push(buildRepositorySection(state.metadata));
    }

    // Help section (if we have help metadata)
    if (state.metadata && state.metadata.help) {
      tree.push(buildHelpSection(state.metadata));
    }

    return tree;
  }

  /**
   * Build notebook section of tree
   * @param {Array} cells - Notebook cells
   * @returns {Object} Notebook tree node
   */
  function buildNotebookSection(cells) {
    const children = [];

    // Group cells by parts if they exist
    const parts = new Map();
    cells.forEach((cell, index) => {
      const partNum = cell.metadata?.part;
      if (partNum) {
        if (!parts.has(partNum)) {
          parts.set(partNum, []);
        }
        parts.get(partNum).push({ cell, index });
      } else {
        // Add ungrouped cell
        children.push({
          id: `cell-${index}`,
          label: getCellTitle(cell, index),
          type: 'cell',
          mode: 'notebook',
          identifier: `cell-${index}`,
        });
      }
    });

    // Add parts to children
    parts.forEach((partCells, partNum) => {
      children.push({
        id: `part-${partNum}`,
        label: `Part ${partNum}`,
        type: 'part',
        children: partCells.map(({ cell, index }) => ({
          id: `cell-${index}`,
          label: getCellTitle(cell, index),
          type: 'cell',
          mode: 'notebook',
          identifier: `cell-${index}`,
        })),
      });
    });

    return {
      id: 'notebook',
      label: 'Notebook',
      type: 'root',
      children,
    };
  }

  /**
   * Build repository section of tree
   * @param {Object} metadata - Metadata with repo info
   * @returns {Object} Repository tree node
   */
  function buildRepositorySection(metadata) {
    // For now, create a simple placeholder
    // Real implementation would fetch repo structure from GitHub API
    return {
      id: 'repository',
      label: 'Repository',
      type: 'root',
      children: [
        {
          id: 'docs',
          label: 'docs',
          type: 'folder',
          children: [
            {
              id: 'docs/README.md',
              label: 'README.md',
              type: 'file',
              mode: 'markdown',
              identifier: 'docs/README.md',
            },
          ],
        },
      ],
    };
  }

  /**
   * Build help section of tree
   * @param {Object} metadata - Metadata with help info
   * @returns {Object} Help tree node
   */
  function buildHelpSection(metadata) {
    return {
      id: 'help',
      label: 'Help',
      type: 'root',
      children: [
        {
          id: 'help/index',
          label: 'Getting Started',
          type: 'page',
          mode: 'manual',
          identifier: 'help/index',
        },
      ],
    };
  }

  /**
   * Get title for a cell
   * @param {Object} cell - Cell object
   * @param {number} index - Cell index
   * @returns {string} Cell title
   */
  function getCellTitle(cell, index) {
    // Try to get title from first line of markdown
    if (cell.cell_type === 'markdown') {
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
      const lines = source.split('\n');
      const firstLine = lines[0].trim();

      // Check if first line is a heading
      const headingMatch = firstLine.match(/^#+\s+(.+)$/);
      if (headingMatch) {
        return headingMatch[1];
      }

      // Otherwise use first line (truncated)
      return firstLine.length > 30 ? `${firstLine.substring(0, 30)}...` : firstLine;
    }

    // For code cells, just show index
    return `Cell ${index}`;
  }

  /**
   * Render tree
   */
  function render() {
    const tree = buildTree();
    treePanel.innerHTML = '';

    tree.forEach((rootNode) => {
      renderNode(rootNode, treePanel, 0);
    });
  }

  /**
   * Render a tree node
   * @param {Object} node - Node to render
   * @param {HTMLElement} container - Container element
   * @param {number} level - Nesting level
   */
  function renderNode(node, container, level) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'ipynb-nav-tree-item';
    nodeElement.setAttribute('data-node-id', node.id);
    nodeElement.setAttribute('data-type', node.type);
    nodeElement.style.paddingLeft = `${level * 1.5}rem`;

    // Expand/collapse icon (if has children)
    if (node.children && node.children.length > 0) {
      const icon = document.createElement('span');
      icon.className = 'ipynb-tree-icon';
      icon.textContent = treeState.expandedNodes.has(node.id) ? '▼' : '▶';
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNode(node.id);
      });
      nodeElement.appendChild(icon);
    } else {
      // Spacer for leaf nodes
      const spacer = document.createElement('span');
      spacer.className = 'ipynb-tree-spacer';
      nodeElement.appendChild(spacer);
    }

    // Label
    const label = document.createElement('span');
    label.className = 'ipynb-tree-label';
    label.textContent = node.label;
    nodeElement.appendChild(label);

    // Click handler
    nodeElement.addEventListener('click', () => {
      if (node.mode && node.identifier) {
        // Navigable node
        onNodeClick({
          mode: node.mode,
          type: node.type,
          identifier: node.identifier,
          title: node.label,
        });
        selectNode(node.id);
      } else if (node.children) {
        // Folder/part node - toggle expansion
        toggleNode(node.id);
      }
    });

    container.appendChild(nodeElement);

    // Render children if expanded
    if (node.children && treeState.expandedNodes.has(node.id)) {
      node.children.forEach((child) => {
        renderNode(child, container, level + 1);
      });
    }
  }

  /**
   * Toggle node expansion
   * @param {string} nodeId - Node ID
   */
  function toggleNode(nodeId) {
    if (treeState.expandedNodes.has(nodeId)) {
      treeState.expandedNodes.delete(nodeId);
    } else {
      treeState.expandedNodes.add(nodeId);
    }
    render();
  }

  /**
   * Select node
   * @param {string} nodeId - Node ID
   */
  function selectNode(nodeId) {
    // Remove previous selection
    if (treeState.selectedNode) {
      const prevNode = treePanel.querySelector(`[data-node-id="${treeState.selectedNode}"]`);
      if (prevNode) {
        prevNode.classList.remove('selected');
      }
    }

    // Add new selection
    treeState.selectedNode = nodeId;
    const newNode = treePanel.querySelector(`[data-node-id="${nodeId}"]`);
    if (newNode) {
      newNode.classList.add('selected');
    }
  }

  // Initial render
  render();

  // Return tree API
  return {
    render,
    select: selectNode,
    toggle: toggleNode,
    getState: () => treeState,
  };
}

export default createUnifiedNavigationTree;
