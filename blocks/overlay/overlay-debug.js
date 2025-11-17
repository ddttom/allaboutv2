/**
 * Overlay Block - DEBUG VERSION
 * Creates a button that triggers a full-viewport overlay with content
 * WITH COMPREHENSIVE DEBUGGING
 */

// Debug mode detection
const DEBUG_MODE = true;

function debugLog(message, data = null) {
  if (DEBUG_MODE) {
    if (data) {
      console.log(`[OVERLAY-DEBUG] ${message}`, data);
    } else {
      console.log(`[OVERLAY-DEBUG] ${message}`);
    }
  }
}

// Configuration
const CONFIG = {
  animationDuration: 300, // milliseconds
  backdropColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '16px',
  maxWidth: '800px',
  closeButtonLabel: 'Close overlay',
};

debugLog('Overlay module loaded');
debugLog('Config:', CONFIG);

/**
 * Creates the overlay structure
 * @param {string} title - The header title for the overlay
 * @param {HTMLElement} contentElement - The content to display in the overlay
 * @returns {HTMLElement} The overlay container element
 */
function createOverlay(title, contentElement) {
  debugLog('Creating overlay with title:', title);

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

  debugLog('Overlay created successfully');
  return overlayContainer;
}

/**
 * Shows the overlay with animation
 * @param {HTMLElement} overlay - The overlay element to show
 * @param {HTMLElement} triggerButton - The button that triggered the overlay (for focus return)
 */
function showOverlay(overlay, triggerButton) {
  debugLog('Showing overlay');

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

  debugLog('Overlay displayed successfully');
}

/**
 * Closes the overlay with animation
 * @param {HTMLElement} overlay - The overlay element to close
 */
function closeOverlay(overlay) {
  debugLog('Closing overlay');

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

    debugLog('Overlay closed successfully');
  }, CONFIG.animationDuration);
}

/**
 * Sets up event handlers for the overlay
 * @param {HTMLElement} overlay - The overlay element
 */
function setupOverlayEventHandlers(overlay) {
  debugLog('Setting up event handlers');

  const closeButton = overlay.querySelector('.overlay-close');
  const modal = overlay.querySelector('.overlay-modal');

  // Close button click
  closeButton.addEventListener('click', () => {
    debugLog('Close button clicked');
    closeOverlay(overlay);
  });

  // Click outside modal to close
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      debugLog('Clicked outside modal');
      closeOverlay(overlay);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function escapeHandler(event) {
    if (event.key === 'Escape') {
      debugLog('ESC key pressed');
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
 * Extracts content from EDS block structure
 * Navigates through EDS wrapper divs to find actual content
 * @param {HTMLElement} block - The block element
 * @returns {Array} Array of row content elements
 */
function extractBlockContent(block) {
  debugLog('Extracting block content');
  debugLog('Block HTML:', block.innerHTML);
  debugLog('Block children count:', block.children.length);

  const rows = Array.from(block.children);
  debugLog('Found rows:', rows.length);

  const extractedRows = [];

  rows.forEach((row, rowIndex) => {
    debugLog(`Processing row ${rowIndex + 1}`);

    // Navigate through nested divs to find content
    const cells = Array.from(row.children);
    debugLog(`  Row ${rowIndex + 1} has ${cells.length} cells`);

    const rowContent = [];

    cells.forEach((cell, cellIndex) => {
      debugLog(`  Processing cell ${cellIndex + 1} of row ${rowIndex + 1}`);

      // For each cell, extract the innermost content
      let contentSource = cell;

      // Navigate through wrapper divs
      const firstDiv = cell.querySelector('div');
      if (firstDiv) {
        debugLog(`    Found first nested div in cell ${cellIndex + 1}`);

        const secondDiv = firstDiv.querySelector('div');
        if (secondDiv && (secondDiv.children.length > 0 || secondDiv.textContent.trim())) {
          debugLog(`    Using second nested div as content source`);
          contentSource = secondDiv;
        } else if (firstDiv.children.length > 0 || firstDiv.textContent.trim()) {
          debugLog(`    Using first nested div as content source`);
          contentSource = firstDiv;
        }
      }

      debugLog(`    Content source text:`, contentSource.textContent.trim().substring(0, 50));
      rowContent.push(contentSource);
    });

    extractedRows.push(rowContent);
  });

  debugLog('Extraction complete. Extracted rows:', extractedRows.length);
  return extractedRows;
}

/**
 * Decorates the overlay block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  console.group('🔧 OVERLAY BLOCK DECORATION');
  debugLog('='.repeat(60));
  debugLog('Starting decoration');
  debugLog('Block element:', block);
  debugLog('Block classes:', block.className);
  debugLog('Block dataset:', block.dataset);

  try {
    // Extract content from EDS structure using standard pattern
    debugLog('Step 1: Extracting content');
    const extractedRows = extractBlockContent(block);

    if (extractedRows.length < 2) {
      throw new Error(`Overlay block requires at least 2 rows (button text and content). Found: ${extractedRows.length}`);
    }

    // Row 1: Button text (first cell of first row)
    debugLog('Step 2: Getting button text');
    const buttonCell = extractedRows[0][0];
    const buttonText = buttonCell?.textContent?.trim() || 'Open';
    debugLog('Button text:', buttonText);

    // Row 2: Overlay content (first cell of second row)
    debugLog('Step 3: Getting overlay content');
    const contentCell = extractedRows[1][0];
    debugLog('Content cell:', contentCell);

    if (!contentCell) {
      throw new Error('Overlay block requires content in the second row');
    }

    // Clone the content to preserve it
    const overlayContent = contentCell.cloneNode(true);
    debugLog('Cloned content for overlay');

    // Create trigger button
    debugLog('Step 4: Creating trigger button');
    const triggerButton = document.createElement('button');
    triggerButton.type = 'button';
    triggerButton.className = 'overlay-trigger';
    triggerButton.textContent = buttonText;
    triggerButton.setAttribute('aria-label', `Open overlay: ${buttonText}`);
    debugLog('Trigger button created:', triggerButton);

    // Button click handler
    triggerButton.addEventListener('click', () => {
      debugLog('Trigger button clicked!');
      const overlay = createOverlay(buttonText, overlayContent.cloneNode(true));
      showOverlay(overlay, triggerButton);
    });

    // Replace block content with trigger button
    debugLog('Step 5: Replacing block content with button');
    debugLog('Block innerHTML before replacement:', block.innerHTML);

    block.textContent = '';
    block.appendChild(triggerButton);

    debugLog('Block innerHTML after replacement:', block.innerHTML);
    debugLog('Button in DOM:', document.body.contains(triggerButton));
    debugLog('✅ Decoration completed successfully!');
    debugLog('='.repeat(60));

  } catch (error) {
    console.error('❌ Overlay block decoration failed:', error);
    console.error('Error stack:', error.stack);
    debugLog('Error details:', {
      message: error.message,
      stack: error.stack,
      blockHTML: block.innerHTML
    });

    block.innerHTML = `
      <div class="error-message" style="padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px;">
        <p style="margin: 0; color: #c00;">Unable to load overlay: ${error.message}</p>
      </div>
    `;
  } finally {
    console.groupEnd();
  }
}

debugLog('Overlay module ready for export');
