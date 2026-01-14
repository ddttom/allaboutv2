/**
 * Unified Navigation System
 * Handles all navigation operations across all overlay modes
 */

import hashManager from './hash-manager.js';

/**
 * Maximum number of history entries to keep
 */
const MAX_HISTORY_ENTRIES = 50;

/**
 * Create unified navigation system
 * @param {Object} state - Overlay state object
 * @param {Object} overlay - Overlay DOM element and components
 * @param {Object} renderers - Mode-specific content renderers
 * @returns {Object} Navigation API
 */
function createUnifiedNavigation(state, overlay, renderers) {
  /**
   * Navigate to a specific target
   * @param {Object} target - Navigation target
   * @param {string} target.mode - Mode ('notebook' | 'markdown' | 'manual')
   * @param {string} target.type - Content type (e.g., 'cell', 'file', 'page')
   * @param {string} target.identifier - Content identifier
   * @param {string} [target.title] - Optional title for history
   * @param {boolean} [skipHashUpdate=false] - Skip updating URL hash
   */
  function navigate(target, skipHashUpdate = false) {
    if (!target || !target.mode || !target.identifier) {
      console.error('[NAV] Invalid target:', target);
      return;
    }

    // eslint-disable-next-line no-console
    console.log('[NAV] Navigating to:', target);

    // Update state
    state.currentMode = target.mode;
    state.currentIdentifier = target.identifier;

    // Add to history
    addToHistory(target);

    // Update hash (unless explicitly skipped)
    if (!skipHashUpdate) {
      hashManager.update(target);
    }

    // Get appropriate renderer for mode
    const renderer = renderers[target.mode];
    if (!renderer) {
      console.error(`[NAV] No renderer found for mode: ${target.mode}`);
      return;
    }

    // Render content
    try {
      renderer(overlay, state, target);
    } catch (error) {
      console.error('[NAV] Renderer error:', error);
      overlay.contentArea.innerHTML = `
        <div class="ipynb-error">
          Failed to render content: ${error.message}
        </div>
      `;
    }
  }

  /**
   * Add navigation entry to history
   * @param {Object} target - Navigation target
   */
  function addToHistory(target) {
    const entry = {
      mode: target.mode,
      type: target.type,
      identifier: target.identifier,
      title: target.title || target.identifier,
      timestamp: Date.now(),
    };

    // Remove duplicate if exists (same mode and identifier)
    const existingIndex = state.history.findIndex(
      (h) => h.mode === entry.mode && h.identifier === entry.identifier,
    );
    if (existingIndex !== -1) {
      state.history.splice(existingIndex, 1);
    }

    // Add to front of history
    state.history.unshift(entry);

    // Limit to MAX_HISTORY_ENTRIES
    if (state.history.length > MAX_HISTORY_ENTRIES) {
      state.history.pop();
    }

    // eslint-disable-next-line no-console
    console.log(`[NAV] History updated (${state.history.length} entries)`);
  }

  /**
   * Go to home (first page)
   * Always clears hash and returns to first page in current mode
   */
  function home() {
    // eslint-disable-next-line no-console
    console.log('[NAV] Going home');

    // Clear hash
    hashManager.clear();

    // Get first page for current mode
    const firstPage = getFirstPage(state.currentMode);

    // Navigate without updating hash (we just cleared it)
    navigate(firstPage, true);
  }

  /**
   * Get first page for a mode
   * @param {string} mode - Mode ('notebook' | 'markdown' | 'manual')
   * @returns {Object} Navigation target for first page
   */
  function getFirstPage(mode) {
    switch (mode) {
      case 'notebook':
        return {
          mode: 'notebook',
          type: 'cell',
          identifier: 'cell-0',
          title: 'First Cell',
        };
      case 'markdown':
        // Return first markdown file from history or default
        return state.history.find((h) => h.mode === 'markdown') || {
          mode: 'markdown',
          type: 'file',
          identifier: 'README.md',
          title: 'README',
        };
      case 'manual':
        return {
          mode: 'manual',
          type: 'page',
          identifier: 'home',
          title: 'Home',
        };
      default:
        console.warn(`[NAV] Unknown mode for first page: ${mode}`);
        return { mode, identifier: 'home' };
    }
  }

  /**
   * Go back in history
   */
  function back() {
    if (state.history.length <= 1) {
      // eslint-disable-next-line no-console
      console.log('[NAV] No history to go back to');
      return;
    }

    // Remove current entry
    state.history.shift();

    // Get previous entry
    const previous = state.history[0];

    // eslint-disable-next-line no-console
    console.log('[NAV] Going back to:', previous);

    // Navigate to previous (will update hash)
    navigate(previous);
  }

  /**
   * Navigate to hash target from URL
   * Used on page load or when hash changes externally
   */
  function navigateToHash() {
    const target = hashManager.parse();

    if (!target) {
      // eslint-disable-next-line no-console
      console.log('[NAV] No hash to navigate to');
      return false;
    }

    // eslint-disable-next-line no-console
    console.log('[NAV] Navigating to hash:', target);

    // Navigate without updating hash (already set)
    navigate(target, true);
    return true;
  }

  /**
   * Update mode without changing current content
   * Used when switching between modes while staying on same logical content
   * @param {string} newMode - New mode to switch to
   */
  function updateMode(newMode) {
    // eslint-disable-next-line no-console
    console.log(`[NAV] Switching mode: ${state.currentMode} → ${newMode}`);

    state.currentMode = newMode;

    // Update overlay data attribute for styling
    overlay.element.setAttribute('data-mode', newMode);
  }

  // Return navigation API
  return {
    navigate,
    home,
    back,
    navigateToHash,
    updateMode,
    getHistory: () => state.history,
    getCurrentMode: () => state.currentMode,
    getCurrentIdentifier: () => state.currentIdentifier,
  };
}

export default createUnifiedNavigation;
