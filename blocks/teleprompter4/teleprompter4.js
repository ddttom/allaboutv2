import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create teleprompter icon
  const createIcon = () => {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');
    icon.innerHTML = '<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" fill="currentColor"/>';
    icon.style.cssText = 'position: fixed; top: 10px; left: 10px; cursor: pointer; z-index: 1001; background: rgba(0,0,0,0.5); color: white; padding: 5px; border-radius: 5px;';
    icon.setAttribute('aria-label', 'Open Teleprompter');
    icon.setAttribute('tabindex', '0');
    return icon;
  };

  // Create and append icon
  const icon = createIcon();
  document.body.appendChild(icon);

  // Rest of the code remains the same...
  // (Create teleprompter container, initialize variables, event listeners, etc.)

  // Make sure to call processContent() when the page loads
  window.addEventListener('load', processContent);
}
