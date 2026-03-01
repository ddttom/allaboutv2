/**

* Notebook Content Renderer
* Renders paged notebook cells with pagination controls
 */

export function renderNotebookContent(contentArea, {
  pages,
  currentPage,
  navigationState,
  config,
  onPageChange,
  onCellExecute,
}) {
  contentArea.innerHTML = '';
  // Keep existing class name - don't override

  const cellsContainer = document.createElement('div');
  cellsContainer.className = 'ipynb-cells-display';

  contentArea.appendChild(cellsContainer);

  let currentPageIndex = currentPage || 0;
  const totalPages = pages.length;

  async function updatePage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    currentPageIndex = pageIndex;

    cellsContainer.innerHTML = '';

    const page = pages[currentPageIndex];
    page.cells.forEach((cell) => {
      const clonedCell = cell.cloneNode(true);
      cellsContainer.appendChild(clonedCell);

      if (cell.classList.contains('ipynb-code-cell')) {
        const runButton = clonedCell.querySelector('.ipynb-run-button');
        if (runButton && onCellExecute) {
          runButton.addEventListener('click', () => onCellExecute(clonedCell));
        }
      }
    });

    if (onPageChange) onPageChange(currentPageIndex);
    navigationState.updateCurrentData({ pageIndex: currentPageIndex });
  }

  // Initialize first page
  updatePage(currentPageIndex);

  return {
    updatePage,
    getCurrentPage: () => currentPageIndex,
    getTotalPages: () => totalPages,
    destroy: () => {},
    navigateToCell: async (cellIndex) => {
      const pageIndex = pages.findIndex((page) => page.cells.some(
        (cell) => parseInt(cell.dataset.cellIndex, 10) === cellIndex,
      ));
      if (pageIndex !== -1) { await updatePage(pageIndex); return true; }
      return false;
    },
    navigateToHeading: async (slug) => {
      const pageIndex = pages.findIndex((page) => {
        const firstCell = page.cells[0];
        if (firstCell && firstCell.classList.contains('ipynb-markdown-cell')) {
          const content = firstCell.querySelector('.ipynb-cell-content');
          if (content) {
            const heading = content.querySelector('h1, h2, h3');
            if (heading) {
              const headingSlug = heading.textContent.toLowerCase().trim()
                .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
              return headingSlug === slug;
            }
          }
        }
        return false;
      });
      if (pageIndex !== -1) { await updatePage(pageIndex); return true; }
      return false;
    },
  };
}
