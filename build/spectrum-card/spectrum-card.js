// Import Spectrum Web Components
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';

// Configuration
const SPECTRUM_CARD_CONFIG = {
  CARD_VARIANT: 'quiet',
  BUTTON_TREATMENT: 'accent',
  BUTTON_SIZE: 'm',
  MAX_WIDTH: '400px',
  DEFAULT_TITLE: 'Card Title',
  DEFAULT_DESCRIPTION: 'Card description',
  DEFAULT_BUTTON_TEXT: 'Action',
};

// The decorate function is called by Franklin/EDS for this block
export default function decorate(block) {
  // Extract content from the block table
  const rows = Array.from(block.children);
  const title = rows[0]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
  const description = rows[1]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
  const buttonText = rows[2]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;
  const imageUrl = rows[3]?.textContent.trim();

  // Clear the block
  block.textContent = '';

  // Create the card structure
  const card = document.createElement('sp-card');
  card.setAttribute('heading', title);
  card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
  card.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;

  // Add card content
  const descriptionDiv = document.createElement('div');
  descriptionDiv.setAttribute('slot', 'description');
  descriptionDiv.textContent = description;

  const footerDiv = document.createElement('div');
  footerDiv.setAttribute('slot', 'footer');
  footerDiv.style.display = 'flex';
  footerDiv.style.justifyContent = 'flex-end';

  const button = document.createElement('sp-button');
  button.setAttribute('treatment', SPECTRUM_CARD_CONFIG.BUTTON_TREATMENT);
  button.setAttribute('size', SPECTRUM_CARD_CONFIG.BUTTON_SIZE);
  button.textContent = buttonText;

  // Add icon to button
  const icon = document.createElement('sp-icon-arrow-right');
  icon.setAttribute('slot', 'icon');
  button.appendChild(icon);

  button.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('Card action clicked:', { title, description });
  });

  footerDiv.appendChild(button);
  card.appendChild(descriptionDiv);
  card.appendChild(footerDiv);

  // Add image if present
  if (imageUrl) {
    const img = document.createElement('img');
    img.setAttribute('slot', 'preview');
    img.src = imageUrl;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = 'auto';
    card.appendChild(img);
  }

  block.appendChild(card);
}
