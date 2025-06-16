// Configuration for the floating alert block
const FLOATING_ALERT_CONFIG = {
  STORAGE_KEY: 'floating-alert-dismissed',
  ANIMATION_DURATION: 300,
  SPARKLE_INTERVAL: 2000,
  SPARKLE_DURATION: 1000,
};

// Create sparkle effect
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'floating-alert-sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  return sparkle;
}

// Add sparkle animation
function addSparkleEffect(container) {
  // Store interval id for later cleanup
  const intervalId = setInterval(() => {
    const sparkle = createSparkle();
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), FLOATING_ALERT_CONFIG.SPARKLE_DURATION);
  }, FLOATING_ALERT_CONFIG.SPARKLE_INTERVAL);
  return intervalId;
}

// Dismiss the alert
function dismissAlert(overlay) {
  const modal = overlay.querySelector('.floating-alert');
  if (modal && modal._sparkleIntervalId) {
    clearInterval(modal._sparkleIntervalId);
    modal._sparkleIntervalId = null;
  }
  if (modal) {
    modal.classList.add('floating-alert--dismissing');
  }
  setTimeout(() => {
    if (modal) {
      const sparkles = modal.querySelectorAll('.floating-alert-sparkle');
      sparkles.forEach((el) => el.remove());
    }
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    localStorage.setItem(FLOATING_ALERT_CONFIG.STORAGE_KEY, 'true');
  }, FLOATING_ALERT_CONFIG.ANIMATION_DURATION);
}

// Handle keyboard navigation
function handleKeyboard(event, modal) {
  if (event.key === 'Escape') {
    dismissAlert(modal);
  } else if (event.key === 'Tab') {
    // Ensure focus stays within modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
}

// Main decorate function
export default async function decorate(block) {
  // Check if alert was previously dismissed
  if (localStorage.getItem(FLOATING_ALERT_CONFIG.STORAGE_KEY) === 'true') {
    return;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'floating-alert-overlay';

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'floating-alert';
  modal.setAttribute('role', 'alert');
  modal.setAttribute('aria-live', 'polite');

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'floating-alert-content';

  // Move block content to modal
  while (block.firstChild) {
    contentWrapper.appendChild(block.firstChild);
  }

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'floating-alert-close';
  closeButton.setAttribute('aria-label', 'Dismiss alert');
  closeButton.innerHTML = '×';
  closeButton.addEventListener('click', () => dismissAlert(overlay));

  // Add elements to modal
  modal.appendChild(contentWrapper);
  modal.appendChild(closeButton);

  // Add modal to overlay
  overlay.appendChild(modal);

  // Add overlay to document
  document.body.appendChild(overlay);

  // Add sparkle effect and store interval id for cleanup
  modal._sparkleIntervalId = addSparkleEffect(modal);

  // Add keyboard event listener
  modal.addEventListener('keydown', (event) => handleKeyboard(event, modal));

  // Add click outside listener (on overlay)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      dismissAlert(overlay);
    }
  });

  // Focus the close button for keyboard navigation
  closeButton.focus();
}
