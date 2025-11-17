/**
 * Overlay Block
 * Creates a button that triggers a full-viewport overlay with content
 */

// Configuration
const CONFIG = {
  animationDuration: 300, // milliseconds
  backdropColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '16px',
  maxWidth: '800px',
  closeButtonLabel: 'Close overlay',
};

/**
 * Creates the overlay structure
 * @param {string} title - The header title for the overlay
 * @param {HTMLElement} contentElement - The content to display in the overlay
 * @returns {HTMLElement} The overlay container element
 */
function createOverlay(title, contentElement) {
  // Create overlay container (backdrop)
  const overlayContainer = document.createElement('div');
  overlayContainer.className = 'overlay-container';
  overlayContainer.setAttribute('role', 'dialog');
  overlayContainer.setAttribute('aria-modal', 'true');
  overlayContainer.setAttribute('aria-labelledby', 'overlay-title');

  // Create modal wrapper
  const modal = document.createElement('div');
  modal.className = 'overlay-modal';

  // Create header
  const header = document.createElement('div');
  header.className = 'overlay-header';

  const headerTitle = document.createElement('h2');
  headerTitle.id = 'overlay-title';
  headerTitle.className = 'overlay-title';
  headerTitle.textContent = title;

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'overlay-close';
  closeButton.setAttribute('aria-label', CONFIG.closeButtonLabel);
  closeButton.innerHTML = '×';

  header.appendChild(headerTitle);
  header.appendChild(closeButton);

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'overlay-content';
  contentWrapper.appendChild(contentElement);

  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(contentWrapper);
  overlayContainer.appendChild(modal);

  return overlayContainer;
}

/**
 * Shows the overlay with animation
 * @param {HTMLElement} overlay - The overlay element to show
 * @param {HTMLElement} triggerButton - The button that triggered the overlay (for focus return)
 */
function showOverlay(overlay, triggerButton) {
  // Add to DOM
  document.body.appendChild(overlay);
  document.body.classList.add('overlay-open');

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('overlay-container--visible');
  });

  // Focus management
  const modal = overlay.querySelector('.overlay-modal');
  const closeButton = overlay.querySelector('.overlay-close');
  closeButton.focus();

  // Store the trigger button for focus return
  overlay.dataset.triggerButton = 'stored';
  overlay.triggerButtonRef = triggerButton;

  // Setup event handlers
  setupOverlayEventHandlers(overlay);
}

/**
 * Closes the overlay with animation
 * @param {HTMLElement} overlay - The overlay element to close
 */
function closeOverlay(overlay) {
  // Start exit animation
  overlay.classList.remove('overlay-container--visible');
  overlay.classList.add('overlay-container--dismissing');

  // Wait for animation to complete
  setTimeout(() => {
    // Return focus to trigger button
    if (overlay.triggerButtonRef) {
      overlay.triggerButtonRef.focus();
    }

    // Remove from DOM
    overlay.remove();
    document.body.classList.remove('overlay-open');
  }, CONFIG.animationDuration);
}

/**
 * Sets up event handlers for the overlay
 * @param {HTMLElement} overlay - The overlay element
 */
function setupOverlayEventHandlers(overlay) {
  const closeButton = overlay.querySelector('.overlay-close');
  const modal = overlay.querySelector('.overlay-modal');

  // Close button click
  closeButton.addEventListener('click', () => closeOverlay(overlay));

  // Click outside modal to close
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeOverlay(overlay);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function escapeHandler(event) {
    if (event.key === 'Escape') {
      closeOverlay(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  });

  // Tab trapping
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

/**
 * Decorates the overlay block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  try {
    // Extract content from EDS structure
    const rows = Array.from(block.children);

    if (rows.length < 2) {
      throw new Error('Overlay block requires at least 2 rows (button text and content)');
    }

    // Row 1: Button text
    const buttonRow = rows[0];
    const buttonText = buttonRow.querySelector('div')?.textContent?.trim() || 'Open';

    // Row 2: Overlay content
    const contentRow = rows[1];
    const contentCell = contentRow.querySelector('div');

    if (!contentCell) {
      throw new Error('Overlay block requires content in the second row');
    }

    // Clone the content to preserve it
    const overlayContent = contentCell.cloneNode(true);

    // Create trigger button
    const triggerButton = document.createElement('button');
    triggerButton.type = 'button';
    triggerButton.className = 'overlay-trigger';
    triggerButton.textContent = buttonText;
    triggerButton.setAttribute('aria-label', `Open overlay: ${buttonText}`);

    // Button click handler
    triggerButton.addEventListener('click', () => {
      const overlay = createOverlay(buttonText, overlayContent.cloneNode(true));
      showOverlay(overlay, triggerButton);
    });

    // Replace block content with trigger button
    block.textContent = '';
    block.appendChild(triggerButton);
  } catch (error) {
    console.error('Overlay block decoration failed:', error);
    block.innerHTML = '<p class="error-message">Unable to load overlay</p>';
  }
}
