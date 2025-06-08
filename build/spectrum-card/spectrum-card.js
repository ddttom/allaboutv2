// Import Spectrum Web Components (these will be bundled by Vite)
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';

// The decorate function is called by Franklin/EDS for this block
export default function decorate(block) {
  // Extract content from the block table
  const rows = Array.from(block.children);
  const title = rows[0]?.textContent.trim() || 'Card Title';
  const description = rows[1]?.textContent.trim() || 'Card description';
  const buttonText = rows[2]?.textContent.trim() || 'Action';

  // Clear the block
  block.textContent = '';

  // Ensure a single <sp-theme> exists on the page
  let themeElement = document.querySelector('sp-theme');
  if (!themeElement) {
    themeElement = document.createElement('sp-theme');
    themeElement.setAttribute('color', 'light');
    themeElement.setAttribute('scale', 'medium');
    document.body.insertBefore(themeElement, document.body.firstChild);
  }

  // Create the card structure
  const card = document.createElement('sp-card');
  card.setAttribute('heading', title);
  card.setAttribute('variant', 'quiet');
  card.style.maxWidth = '400px';

  // Add card content
  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = description;

  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');

  const button = document.createElement('sp-button');
  button.setAttribute('treatment', 'accent');
  button.setAttribute('size', 'm');
  button.textContent = buttonText;

  button.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('Card action clicked');
    // Add your action logic here
  });

  footerDiv.appendChild(button);
  card.appendChild(descriptionDiv);
  card.appendChild(footerDiv);
  block.appendChild(card);
}
