/**
 * Overlay Block
 * Creates a button that triggers a full-viewport overlay with content
 *
 * Structure (from author perspective):
 * Row 1: "Overlay" (block name - processed by EDS)
 * Row 2: Button text
 * Row 3: Overlay content
 *
 * Note: EDS processes the header row before the decorate function runs,
 * so extractedRows[0] contains Row 2 (button text) and extractedRows[1] contains Row 3 (content)
 */

// Configuration
const CONFIG = {
  animationDuration: 300, // milliseconds - used in JavaScript timeout
  backdropColor: 'rgba(0, 0, 0, 0.5)', // Documentation only - actual value hardcoded in CSS
  borderRadius: '16px', // Documentation only - actual value hardcoded in CSS (12px on mobile)
  maxWidth: '800px', // Documentation only - actual value hardcoded in CSS (100% on mobile)
  closeButtonLabel: 'Close overlay', // Accessibility label - used in JavaScript
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
  const closeButton = overlay.querySelector('.overlay-close');
  closeButton.focus();

  // Store the trigger button for focus return
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

  // Keyboard navigation - ESC key
  const escapeHandler = (event) => {
    if (event.key === 'Escape') {
      closeOverlay(overlay);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  // Tab trapping - keeps focus within modal
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab - reverse navigation
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab - forward navigation
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
 *
 * Expected structure (from author perspective):
 * Row 1: "Overlay" (block name)
 * Row 2: Button text
 * Row 3: Overlay content
 *
 * Note: EDS extracts only data rows, so:
 * - extractedRows[0] = Row 2 (button text)
 * - extractedRows[1] = Row 3 (overlay content)
 */
export default function decorate(block) {
  try {
    // Extract rows from block
    const rows = Array.from(block.children);

    if (rows.length < 2) {
      throw new Error(
        `Overlay block requires exactly 3 rows: row 1 = "Overlay", row 2 = button text, row 3 = content. Found only ${rows.length} data rows (EDS processes the header row automatically).`,
      );
    }

    // Row 2 (from author perspective): Button text
    // This is extractedRows[0] because EDS already processed Row 1
    const buttonRow = rows[0];
    const buttonCell = buttonRow.querySelector('div');
    const buttonText = buttonCell?.textContent?.trim() || 'Learn More';

    // Row 3 (from author perspective): Overlay content
    // This is extractedRows[1] because EDS already processed Row 1
    const contentRow = rows[1];
    const contentCell = contentRow.querySelector('div');

    if (!contentCell || !contentCell.textContent.trim()) {
      throw new Error(
        'Overlay block requires content in row 3. The content row appears to be empty.',
      );
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

    // Display user-friendly error message
    block.innerHTML = `<p class="error-message" style="padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
      Unable to load overlay: ${error.message}
    </p>`;
  }
}
