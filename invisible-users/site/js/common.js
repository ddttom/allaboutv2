/**
 * The Invisible Users - Common JavaScript
 * Shared functionality across all tutorial pages
 */

/**
 * Smooth scroll to top functionality
 * Used by the floating "Back to Top" button
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  return false;
}

/**
 * Initialize floating navigation buttons
 * Sets up event listeners for scroll-to-top functionality
 */
function initializeFloatingButtons() {
  const topButton = document.querySelector('.floating-top-button');
  if (topButton) {
    topButton.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });
  }
}

/**
 * Set page load state
 * Marks the page as fully loaded for AI agents
 */
function setPageLoadState() {
  const main = document.querySelector('main[role="main"]');
  if (main && !main.hasAttribute('data-load-state')) {
    main.setAttribute('data-load-state', 'complete');
  }
}

/**
 * Initialize all common functionality
 * Called when DOM is ready
 */
function initialize() {
  setPageLoadState();
  initializeFloatingButtons();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
