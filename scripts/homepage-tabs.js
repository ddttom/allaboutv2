/* eslint-disable import/prefer-default-export, no-use-before-define, prefer-destructuring, no-unused-vars, max-len */
/**
 * Homepage Category Tabs
 * Handles category filtering for blog posts on the homepage
 */

const HOMEPAGE_TABS_CONFIG = {
  ACTIVE_CLASS: 'active',
  HIDDEN_CLASS: 'hidden',
  ERROR_MESSAGE: 'Unable to switch categories. Please try again.',
};

/**
 * Initialize category tabs functionality
 * Sets up click handlers and checks for URL hash on load
 */
export function initCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tabs button');
  const containers = document.querySelectorAll('.blogroll-container');

  // Guard clause: exit if no tabs or containers found
  if (!tabs.length || !containers.length) {
    return;
  }

  // Add click listeners to each tab
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      handleTabClick(tab, tabs, containers);
    });

    // Add keyboard support (Enter and Space)
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTabClick(tab, tabs, containers);
      }
    });
  });

  // Check for hash on page load to restore category state
  initializeFromHash(tabs);
}

/**
 * Handle tab click event
 * Updates active states and shows/hides corresponding blogroll containers
 */
function handleTabClick(clickedTab, allTabs, containers) {
  const category = clickedTab.dataset.category;

  // Validate category exists
  if (!category) {
    // eslint-disable-next-line no-console
    console.error('Tab missing data-category attribute');
    return;
  }

  // Update tab active states
  allTabs.forEach((tab) => {
    if (tab === clickedTab) {
      tab.classList.add(HOMEPAGE_TABS_CONFIG.ACTIVE_CLASS);
      tab.setAttribute('aria-pressed', 'true');
    } else {
      tab.classList.remove(HOMEPAGE_TABS_CONFIG.ACTIVE_CLASS);
      tab.setAttribute('aria-pressed', 'false');
    }
  });

  // Show/hide blogroll containers
  containers.forEach((container) => {
    const containerCategory = container.dataset.category;

    if (containerCategory === category) {
      container.classList.remove(HOMEPAGE_TABS_CONFIG.HIDDEN_CLASS);
      container.setAttribute('aria-hidden', 'false');
    } else {
      container.classList.add(HOMEPAGE_TABS_CONFIG.HIDDEN_CLASS);
      container.setAttribute('aria-hidden', 'true');
    }
  });

  // Update URL hash (bookmarkable state)
  updateUrlHash(category);
}

/**
 * Update URL hash without scrolling
 */
function updateUrlHash(category) {
  const newHash = `#category-${category}`;

  // Use pushState to avoid scroll jump
  if (window.history.pushState) {
    window.history.pushState(null, '', newHash);
  } else {
    // Fallback for older browsers
    window.location.hash = newHash;
  }
}

/**
 * Initialize category from URL hash on page load
 */
function initializeFromHash(tabs) {
  const hash = window.location.hash.replace('#category-', '');

  if (hash) {
    const targetTab = document.querySelector(`[data-category="${hash}"]`);

    if (targetTab) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        targetTab.click();
      }, 100);
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategoryTabs);
} else {
  initCategoryTabs();
}
