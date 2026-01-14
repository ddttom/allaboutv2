/**
 * Unified Overlay System
 * Single overlay that handles all content types (notebook cells, markdown files, manual pages)
 */

import hashManager from './hash-manager.js';
import createUnifiedNavigation from './navigation.js';

/**
 * Create unified overlay
 * @param {Object} config - Configuration
 * @param {string} config.mode - Initial mode ('notebook' | 'markdown' | 'manual')
 * @param {Object} config.content - Content to display
 * @param {Object} config.metadata - Metadata (title, repo, etc.)
 * @param {Object} [config.parentOverlay] - Optional parent overlay reference
 * @param {Object} config.renderers - Mode-specific renderers
 * @returns {Object} Overlay API
 */
function createUnifiedOverlay(config) {
  const {
    mode,
    content,
    metadata = {},
    parentOverlay = null,
    renderers = {},
  } = config;

  // eslint-disable-next-line no-console
  console.log(`[OVERLAY] Creating unified overlay in mode: ${mode}`);

  // Create overlay DOM structure
  const overlay = createOverlayStructure(mode, metadata);

  // Initialize state
  const state = {
    mode,
    currentMode: mode,
    currentIdentifier: null,
    history: [],
    content,
    metadata,
    parentOverlay,
    isOpen: false,
  };

  // Create navigation system
  const navigation = createUnifiedNavigation(state, overlay, renderers);

  /**
   * Show overlay
   * @param {Object} [initialTarget] - Optional target to navigate to immediately
   */
  function show(initialTarget = null) {
    // eslint-disable-next-line no-console
    console.log('[OVERLAY] Showing overlay');

    overlay.element.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    state.isOpen = true;

    // Navigate to initial target if provided
    if (initialTarget) {
      navigation.navigate(initialTarget);
    } else {
      // Try to navigate to hash, otherwise go to first page
      if (!navigation.navigateToHash()) {
        navigation.home();
      }
    }
  }

  /**
   * Hide overlay
   */
  function hide() {
    // eslint-disable-next-line no-console
    console.log('[OVERLAY] Hiding overlay');

    overlay.element.style.display = 'none';
    document.body.style.overflow = '';
    state.isOpen = false;

    // Clear hash when hiding
    hashManager.clear();
  }

  /**
   * Toggle overlay visibility
   */
  function toggle() {
    if (state.isOpen) {
      hide();
    } else {
      show();
    }
  }

  // Set up event listeners
  setupEventListeners(overlay, navigation, state);

  // Return overlay API
  return {
    show,
    hide,
    toggle,
    navigate: navigation.navigate,
    home: navigation.home,
    back: navigation.back,
    updateMode: navigation.updateMode,
    getState: () => state,
    getNavigation: () => navigation,
  };
}

/**
 * Create overlay DOM structure
 * @param {string} mode - Initial mode
 * @param {Object} metadata - Metadata
 * @returns {Object} Overlay DOM references
 */
function createOverlayStructure(mode, metadata) {
  // Main overlay container
  const element = document.createElement('div');
  element.className = 'ipynb-unified-overlay';
  element.setAttribute('data-mode', mode);
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  element.setAttribute('aria-label', 'Content viewer');
  element.style.display = 'none';

  // Overlay content wrapper
  const content = document.createElement('div');
  content.className = 'ipynb-overlay-content';

  // Top bar with controls
  const topBar = document.createElement('div');
  topBar.className = 'ipynb-overlay-top-bar';

  // Left controls section
  const leftControls = document.createElement('div');
  leftControls.className = 'ipynb-overlay-controls ipynb-overlay-controls-left';

  // Home button
  const homeButton = document.createElement('button');
  homeButton.type = 'button';
  homeButton.className = 'ipynb-overlay-button ipynb-home-button';
  homeButton.innerHTML = '🏠';
  homeButton.setAttribute('aria-label', 'Go home');
  homeButton.setAttribute('title', 'Home');

  // Tree toggle button
  const treeToggle = document.createElement('button');
  treeToggle.type = 'button';
  treeToggle.className = 'ipynb-overlay-button ipynb-tree-toggle-button';
  treeToggle.innerHTML = '&#9664;'; // Left arrow (◄)
  treeToggle.setAttribute('aria-label', 'Toggle navigation tree');
  treeToggle.setAttribute('aria-expanded', 'true');
  treeToggle.setAttribute('title', 'Hide Tree');

  leftControls.appendChild(homeButton);
  leftControls.appendChild(treeToggle);

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ipynb-overlay-title';
  titleSection.textContent = metadata.title || 'Content Viewer';
  titleSection.setAttribute('title', metadata.title || 'Content Viewer');

  // Right controls section
  const rightControls = document.createElement('div');
  rightControls.className = 'ipynb-overlay-controls ipynb-overlay-controls-right';

  // History button
  const historyButton = document.createElement('button');
  historyButton.type = 'button';
  historyButton.className = 'ipynb-overlay-button ipynb-history-button';
  historyButton.innerHTML = '&#128337;'; // Clock icon (🕘)
  historyButton.setAttribute('aria-label', 'Navigation History');
  historyButton.setAttribute('aria-expanded', 'false');
  historyButton.setAttribute('title', 'History');

  // Close button
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'ipynb-overlay-button ipynb-close-button';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close viewer');

  rightControls.appendChild(historyButton);
  rightControls.appendChild(closeButton);

  // Assemble top bar
  topBar.appendChild(leftControls);
  topBar.appendChild(titleSection);
  topBar.appendChild(rightControls);

  // Main content area wrapper
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'ipynb-overlay-main';

  // Navigation tree panel
  const treePanel = document.createElement('div');
  treePanel.className = 'ipynb-nav-tree-panel';
  treePanel.setAttribute('role', 'navigation');
  treePanel.setAttribute('aria-label', 'Navigation tree');

  // Content area
  const contentArea = document.createElement('div');
  contentArea.className = 'ipynb-overlay-content-area';
  contentArea.setAttribute('role', 'main');

  mainWrapper.appendChild(treePanel);
  mainWrapper.appendChild(contentArea);

  // Assemble overlay
  content.appendChild(topBar);
  content.appendChild(mainWrapper);
  element.appendChild(content);

  // Append to body
  document.body.appendChild(element);

  // Return references
  return {
    element,
    content,
    topBar,
    leftControls,
    rightControls,
    titleSection,
    homeButton,
    treeToggle,
    historyButton,
    closeButton,
    mainWrapper,
    treePanel,
    contentArea,
  };
}

/**
 * Set up event listeners
 * @param {Object} overlay - Overlay DOM references
 * @param {Object} navigation - Navigation API
 * @param {Object} state - State object
 */
function setupEventListeners(overlay, navigation, state) {
  // Home button
  overlay.homeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigation.home();
  });

  // Close button
  overlay.closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If there's a parent overlay, hide this one and show parent
    if (state.parentOverlay) {
      state.parentOverlay.show();
    }

    // Hide this overlay
    overlay.element.style.display = 'none';
    document.body.style.overflow = '';
    state.isOpen = false;
    hashManager.clear();
  });

  // Tree toggle button
  overlay.treeToggle.addEventListener('click', () => {
    const isVisible = overlay.treePanel.style.display !== 'none';
    if (isVisible) {
      overlay.treePanel.style.display = 'none';
      overlay.treeToggle.innerHTML = '&#9654;'; // Right arrow (►)
      overlay.treeToggle.setAttribute('aria-expanded', 'false');
      overlay.treeToggle.setAttribute('title', 'Show Tree');
    } else {
      overlay.treePanel.style.display = '';
      overlay.treeToggle.innerHTML = '&#9664;'; // Left arrow (◄)
      overlay.treeToggle.setAttribute('aria-expanded', 'true');
      overlay.treeToggle.setAttribute('title', 'Hide Tree');
    }
  });

  // Close on overlay background click
  overlay.element.addEventListener('click', (e) => {
    if (e.target === overlay.element) {
      overlay.closeButton.click();
    }
  });

  // Close on Escape key
  const keyHandler = (e) => {
    if (e.key === 'Escape' && state.isOpen) {
      overlay.closeButton.click();
    }
  };
  document.addEventListener('keydown', keyHandler);

  // Listen for hash changes (e.g., browser back button)
  window.addEventListener('hashchange', () => {
    if (state.isOpen) {
      navigation.navigateToHash();
    }
  });
}

export default createUnifiedOverlay;
