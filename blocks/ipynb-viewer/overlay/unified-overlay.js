/**

* Unified Overlay Manager
* Single overlay with content switching (no nesting!)
 */

import { NavigationState } from './navigation-state.js';
import { createToolbar } from './toolbar.js';
import { createFooter } from './footer.js';
import { renderNotebookContent } from './renderers/notebook-renderer.js';
import { renderMarkdownContent } from './renderers/markdown-renderer.js';

export function createUnifiedOverlay({
  notebook,
  pages,
  navigationTree,
  treeState,
  config,
  repoUrl,
  branch,
  notebookTitle,
  renderNavigationTree,
}) {
  // Remove any existing overlays
  document.querySelectorAll('.ipynb-unified-overlay').forEach((el) => el.remove());

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'ipynb-unified-overlay ipynb-paged-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const overlayContent = document.createElement('div');
  overlayContent.className = 'ipynb-paged-overlay-content';

  const navTreePanel = document.createElement('div');
  navTreePanel.className = 'ipynb-nav-tree-panel';

  const contentArea = document.createElement('div');
  contentArea.className = 'ipynb-paged-cell-area';

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'ipynb-overlay-main';
  mainWrapper.appendChild(navTreePanel);
  mainWrapper.appendChild(contentArea);

  // Initialize state
  const navigationState = new NavigationState({ config, maxHistoryEntries: config.maxHistoryEntries });

  let isTreeVisible = true;
  let currentRenderer = null;
  let isOverlayOpen = false;

  function updateTreeVisibility(visible) {
    isTreeVisible = visible;
    navTreePanel.style.display = visible ? '' : 'none';
    toolbar.updateTreeToggle(visible);
  }

  function handleTreeToggle() {
    updateTreeVisibility(!isTreeVisible);
  }

  function handleHomeClick() {
    const currentView = navigationState.getCurrentView();
    if (currentView.type === 'notebook') {
      const openingPage = notebook?.metadata?.['opening-page'];
      if (openingPage) {
        const targetPath = openingPage.replace(/^#/, '');
        if (targetPath.startsWith('cell-')) {
          const cellIndex = parseInt(targetPath.replace('cell-', ''), 10);
          if (currentRenderer?.navigateToCell) currentRenderer.navigateToCell(cellIndex);
        } else if (currentRenderer?.navigateToHeading) {
          currentRenderer.navigateToHeading(targetPath);
        }
      } else if (currentRenderer?.updatePage) {
        currentRenderer.updatePage(0);
      }
    } else {
      navigationState.switchView('notebook', { pageIndex: navigationState.viewStates.notebook.pageIndex || 0 });
    }
  }

  function closeOverlay() {
    isOverlayOpen = false;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (currentRenderer?.destroy) currentRenderer.destroy();
  }

  const toolbar = createToolbar({
    config,
    navigationState,
    onHomeClick: handleHomeClick,
    onTreeToggle: handleTreeToggle,
  });

  const footer = createFooter({
    config,
    navigationState,
  });

  overlayContent.appendChild(toolbar.element);
  overlayContent.appendChild(mainWrapper);
  overlayContent.appendChild(footer.element);
  overlay.appendChild(overlayContent);
  document.body.appendChild(overlay);

  async function renderCurrentView() {
    const currentView = navigationState.getCurrentView();
    if (currentRenderer?.destroy) currentRenderer.destroy();

    if (currentView.type === 'notebook') {
      // Update title to current page's first heading (or notebook title as fallback)
      const page = pages[currentView.data.pageIndex];
      let pageTitle = notebookTitle;
      let firstCellIndex = null;

      if (page && page.cells && page.cells[0]) {
        const firstCell = page.cells[0];

        // Get cell index for tree highlighting
        firstCellIndex = parseInt(firstCell.dataset.cellIndex, 10);

        if (firstCell.classList.contains('ipynb-markdown-cell')) {
          const heading = firstCell.querySelector('.ipynb-cell-content h1, .ipynb-cell-content h2, .ipynb-cell-content h3');
          if (heading) {
            pageTitle = heading.textContent.trim();
          }
        }
      }
      toolbar.updateTitle(pageTitle);

      // Highlight current cell in tree
      if (firstCellIndex !== null) {
        const cellNodeId = `cell-${firstCellIndex}`;
        updateTreeHighlight(cellNodeId, navigationTree, treeState, navTreePanel, renderNavigationTree, handleTreeNodeClick);
      }

      currentRenderer = renderNotebookContent(contentArea, {
        pages,
        currentPage: currentView.data.pageIndex,
        navigationState,
        config,
        onPageChange: (pageIndex) => {
          // Update toolbar title to match current page heading
          const page = pages[pageIndex];
          let firstCellIndex = null;

          if (page && page.cells && page.cells[0]) {
            const firstCell = page.cells[0];

            // Get cell index for tree highlighting
            firstCellIndex = parseInt(firstCell.dataset.cellIndex, 10);

            if (firstCell.classList.contains('ipynb-markdown-cell')) {
              const heading = firstCell.querySelector('.ipynb-cell-content h1, .ipynb-cell-content h2, .ipynb-cell-content h3');
              if (heading) {
                toolbar.updateTitle(heading.textContent.trim());
              }
            }
          }

          // Update footer pagination
          footer.updatePageInfo(`${pageIndex + 1} / ${pages.length}`);
          footer.updateButtons(pageIndex === 0, pageIndex === pages.length - 1);

          // Highlight current cell in tree
          if (firstCellIndex !== null) {
            const cellNodeId = `cell-${firstCellIndex}`;
            updateTreeHighlight(cellNodeId, navigationTree, treeState, navTreePanel, renderNavigationTree, handleTreeNodeClick);
          } else if (renderNavigationTree) {
            renderNavigationTree(navigationTree, navTreePanel, treeState, handleTreeNodeClick);
          }
        },
        onCellExecute: (cell) => {
          if (window.ipynbExecuteCell) window.ipynbExecuteCell(cell);
        },
      });

      const tocItems = pages.map((page, index) => {
        const firstCell = page.cells[0];
        let title = `Page ${index + 1}`;
        if (firstCell?.classList.contains('ipynb-markdown-cell')) {
          const heading = firstCell.querySelector('.ipynb-cell-content h1, .ipynb-cell-content h2, .ipynb-cell-content h3');
          if (heading) title = heading.textContent.trim();
        }
        return {
          level: 2,
          text: title,
          onClick: () => { if (currentRenderer.updatePage) currentRenderer.updatePage(index); },
        };
      });

      toolbar.updateTocContent(tocItems);

      // Configure footer for notebook pagination
      footer.setNotebookMode(
        pages.length,
        currentView.data.pageIndex,
        () => {
          const newIndex = currentView.data.pageIndex - 1;
          if (newIndex >= 0 && currentRenderer?.updatePage) {
            currentRenderer.updatePage(newIndex);
          }
        },
        () => {
          const newIndex = currentView.data.pageIndex + 1;
          if (newIndex < pages.length && currentRenderer?.updatePage) {
            currentRenderer.updatePage(newIndex);
          }
        },
      );
    } else if (currentView.type === 'markdown' || currentView.type === 'help') {
      toolbar.updateTitle(currentView.data.markdownTitle || 'Markdown');

      currentRenderer = await renderMarkdownContent(contentArea, {
        markdownUrl: currentView.data.markdownUrl,
        title: currentView.data.markdownTitle,
        repoUrl,
        branch,
        navigationState,
        config,
        onLinkClick: (linkData) => {
          if (linkData.type === 'markdown') {
            navigationState.switchView('markdown', {
              markdownUrl: linkData.url,
              markdownTitle: linkData.title,
            });
          }
        },
      });

      const headings = currentRenderer.getHeadings();
      toolbar.updateTocContent(headings.map((h) => ({
        level: h.level,
        text: h.text,
        onClick: () => { if (currentRenderer.scrollTo) currentRenderer.scrollTo(`#${h.id}`); },
      })));

      // Update navigation tree to highlight current markdown file
      // Extract the file path from the markdown URL
      const urlPath = currentView.data.markdownUrl;
      if (urlPath && urlPath.includes('/blob/')) {
        const pathParts = urlPath.split('/blob/');
        if (pathParts[1]) {
          const filePath = pathParts[1].split('/').slice(1).join('/'); // Remove branch, keep path
          // Markdown nodes use their path as the node ID
          updateTreeHighlight(filePath, navigationTree, treeState, navTreePanel, renderNavigationTree, handleTreeNodeClick);
        }
      }

      // Configure footer for markdown tree navigation
      footer.setMarkdownMode(
        navigationTree,
        currentView.data.markdownUrl,
        (node) => {
          if (node.type === 'markdown' && node.path) {
            const fullUrl = `${repoUrl}/blob/${branch}/${node.path}`;
            navigationState.switchView('markdown', {
              markdownUrl: fullUrl,
              markdownTitle: node.label,
            });
          }
        },
      );
    }

    toolbar.refreshDropdowns();
  }

  function handleTreeNodeClick(node) {
    if (node.type === 'root' || node.type === 'folder') return;

    if ((node.type === 'cell' || node.type === 'part') && node.cellIndex !== null) {
      if (navigationState.currentView !== 'notebook') {
        navigationState.switchView('notebook', { pageIndex: 0 });
      }
      if (currentRenderer?.navigateToCell) currentRenderer.navigateToCell(node.cellIndex);
      return;
    }

    if (node.type === 'help-topic' && node.path) {
      // Help topics use hash fragments to navigate within help.md
      const fullUrl = `${config.fallbackHelpRepo}/blob/${config.fallbackHelpBranch}/${node.path}${node.anchor || ''}`;
      navigationState.switchView('markdown', {
        markdownUrl: fullUrl,
        markdownTitle: node.label,
      });
      return;
    }

    if (node.type === 'markdown' && node.path) {
      const fullUrl = `${repoUrl}/blob/${branch}/${node.path}`;
      navigationState.switchView('markdown', {
        markdownUrl: fullUrl,
        markdownTitle: node.label,
      });
    }
  }

  async function openOverlay() {
    isOverlayOpen = true;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (renderNavigationTree) renderNavigationTree(navigationTree, navTreePanel, treeState, handleTreeNodeClick);
    await renderCurrentView();

    const openingPage = notebook?.metadata?.['opening-page'];
    if (openingPage && currentRenderer) {
      const targetPath = openingPage.replace(/^#/, '');
      if (targetPath.startsWith('cell-')) {
        const cellIndex = parseInt(targetPath.replace('cell-', ''), 10);
        if (currentRenderer.navigateToCell) await currentRenderer.navigateToCell(cellIndex);
      } else if (currentRenderer.navigateToHeading) {
        await currentRenderer.navigateToHeading(targetPath);
      }
    }
  }

  navigationState.onViewChange = async () => { await renderCurrentView(); };
  navigationState.onHistoryChange = () => { toolbar.refreshDropdowns(); };

  const keyHandler = (e) => {
    if (isOverlayOpen && e.key === 'Escape') {
      e.preventDefault();
      closeOverlay();
    }
  };

  document.addEventListener('keydown', keyHandler);

  return {
    openOverlay,
    closeOverlay,
    navigateTo: (viewType, data) => { navigationState.switchView(viewType, data); },
    getNavigationState: () => navigationState,
  };
}

/**

* Expand all parent nodes to make a target node visible
* @param {Array} tree - Tree structure
* @param {string} targetNodeId - Node ID to make visible
* @param {Object} treeState - State object
* @returns {boolean} - True if node was found and parents expanded
 */
function expandParentsOfNode(tree, targetNodeId, treeState) {
  // Recursive function to find node and expand all parents
  function searchAndExpand(nodes, nodeId, ancestors = []) {
    return nodes.reduce((found, node) => {
      if (found) return found;

      // If this is the target node, expand all ancestors
      if (node.id === nodeId) {
        ancestors.forEach((ancestor) => {
          treeState.expandedNodes.add(ancestor.id);
        });
        return true;
      }

      // Search children with this node as an ancestor
      if (node.children && node.children.length > 0) {
        return searchAndExpand(node.children, nodeId, [...ancestors, node]);
      }

      return false;
    }, false);
  }

  return searchAndExpand(tree, targetNodeId);
}

/**

* Update tree to highlight and scroll to a specific node
* Unified function for both notebook cells and markdown files
* @param {string} nodeId - Node ID to highlight (e.g., 'cell-5' or 'appendix-a.md')
* @param {Array} navigationTree - Tree structure
* @param {Object} treeState - State object
* @param {HTMLElement} navTreePanel - Tree panel DOM element
* @param {Function} renderNavigationTree - Tree rendering function
* @param {Function} handleTreeNodeClick - Node click handler
 */
function updateTreeHighlight(nodeId, navigationTree, treeState, navTreePanel, renderNavigationTree, handleTreeNodeClick) {
  if (!renderNavigationTree || !nodeId) return;

  // Set selected node
  treeState.selectedNode = nodeId;

  // Expand all parent folders to make the node visible
  expandParentsOfNode(navigationTree, nodeId, treeState);

  // Re-render tree with updated state
  renderNavigationTree(navigationTree, navTreePanel, treeState, handleTreeNodeClick);

  // Scroll to selected node after rendering
  setTimeout(() => {
    const selectedEl = navTreePanel.querySelector(`[data-node-id="${nodeId}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}
