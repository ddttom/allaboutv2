/**
 * Toolbar Manager - Creates unified toolbar that adapts to current view
 */

export function createToolbar({ config, navigationState, onHomeClick, onTreeToggle }) {
  const topBar = document.createElement('div');
  topBar.className = 'ipynb-overlay-top-bar';

  // Left section
  const leftSection = document.createElement('div');
  leftSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-left';

  const treeToggleButton = document.createElement('button');
  treeToggleButton.className = 'ipynb-overlay-button ipynb-tree-toggle-button';
  treeToggleButton.innerHTML = '&#9664;'; // ◄ left arrow when tree open
  treeToggleButton.setAttribute('aria-label', config.ariaLabels.toggleTree);
  treeToggleButton.setAttribute('title', config.tooltips.hideTree);

  const homeButton = document.createElement('button');
  homeButton.className = 'ipynb-overlay-button ipynb-home-button';
  homeButton.innerHTML = '🏠'; // Home emoji
  homeButton.setAttribute('title', config.tooltips.home);

  leftSection.appendChild(homeButton);
  leftSection.appendChild(treeToggleButton);

  // Center section
  const titleSection = document.createElement('div');
  titleSection.className = 'ipynb-overlay-title';
  titleSection.textContent = 'Jupyter Notebook';

  // Right section
  const rightSection = document.createElement('div');
  rightSection.className = 'ipynb-overlay-controls ipynb-overlay-controls-right';

  const historyButton = document.createElement('button');
  historyButton.className = 'ipynb-overlay-button ipynb-history-button';
  historyButton.innerHTML = '&#128337;'; // 🕘 clock/history icon
  historyButton.setAttribute('title', config.tooltips.history);

  const historyDropdown = document.createElement('div');
  historyDropdown.className = 'ipynb-history-dropdown';
  historyDropdown.style.display = 'none';

  const tocButton = document.createElement('button');
  tocButton.className = 'ipynb-overlay-button ipynb-hamburger-menu';
  tocButton.innerHTML = '&#9776;'; // ☰ hamburger menu
  tocButton.setAttribute('title', config.tooltips.tableOfContents);

  const tocDropdown = document.createElement('div');
  tocDropdown.className = 'ipynb-toc-dropdown';
  tocDropdown.style.display = 'none';

  rightSection.appendChild(historyButton);
  rightSection.appendChild(historyDropdown);
  rightSection.appendChild(tocButton);
  rightSection.appendChild(tocDropdown);

  topBar.appendChild(leftSection);
  topBar.appendChild(titleSection);
  topBar.appendChild(rightSection);

  // Dropdown management
  function closeAllDropdowns() {
    historyDropdown.style.display = 'none';
    tocDropdown.style.display = 'none';
  }

  function toggleDropdown(dropdown, button, updateFn) {
    const isOpen = dropdown.style.display === 'block';
    closeAllDropdowns();
    if (!isOpen) {
      if (updateFn) updateFn();
      dropdown.style.display = 'block';
    }
  }

  function updateHistoryDropdown() {
    historyDropdown.innerHTML = '';
    const history = navigationState.getHistory();

    if (history.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'ipynb-history-empty';
      emptyMsg.textContent = config.emptyMessages.noHistory;
      historyDropdown.appendChild(emptyMsg);
      return;
    }

    history.forEach((entry) => {
      const item = document.createElement('button');
      item.className = 'ipynb-history-item';
      item.textContent = `${entry.icon} ${entry.title}`;
      item.addEventListener('click', () => {
        navigationState.switchView(entry.type, entry.data);
        closeAllDropdowns();
      });
      historyDropdown.appendChild(item);
    });
  }

  // Event listeners
  treeToggleButton.addEventListener('click', (e) => { e.stopPropagation(); if (onTreeToggle) onTreeToggle(); });
  homeButton.addEventListener('click', (e) => { e.stopPropagation(); if (onHomeClick) onHomeClick(); });
  historyButton.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(historyDropdown, historyButton, updateHistoryDropdown); });
  tocButton.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(tocDropdown, tocButton, null); });

  document.addEventListener('click', (e) => {
    if (!historyDropdown.contains(e.target) && !historyButton.contains(e.target)) historyDropdown.style.display = 'none';
    if (!tocDropdown.contains(e.target) && !tocButton.contains(e.target)) tocDropdown.style.display = 'none';
  });

  return {
    element: topBar,
    updateTitle: (title) => { titleSection.textContent = title; },
    updateTreeToggle: (isTreeVisible) => {
      treeToggleButton.innerHTML = isTreeVisible ? '&#9664;' : '&#9654;'; // ◄ or ►
      treeToggleButton.setAttribute('title', isTreeVisible ? config.tooltips.hideTree : config.tooltips.showTree);
    },
    updateTocContent: (tocItems) => {
      tocDropdown.innerHTML = '';
      if (!tocItems || tocItems.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'ipynb-toc-empty';
        emptyMsg.textContent = config.emptyMessages.noHeadings;
        tocDropdown.appendChild(emptyMsg);
        return;
      }
      tocItems.forEach((item) => {
        const menuItem = document.createElement('button');
        menuItem.className = `ipynb-toc-item ipynb-toc-h${item.level}`;
        menuItem.textContent = item.text;
        menuItem.addEventListener('click', () => {
          if (item.onClick) item.onClick();
          closeAllDropdowns();
        });
        tocDropdown.appendChild(menuItem);
      });
    },
    refreshDropdowns: () => { updateHistoryDropdown(); },
  };
}
