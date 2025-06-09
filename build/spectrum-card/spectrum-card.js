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
  // Debug: log when decorate is called and the block
  // eslint-disable-next-line no-console
  console.debug('[spectrum-card] decorate called', block);

  try {
    const rows = Array.from(block.children);
    // Debug: log extracted rows
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] extracted rows', rows.map((r) => r.textContent));

    const imageUrl = rows[0]?.textContent.trim();
    const title = rows[1]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_TITLE;
    const description = rows[2]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_DESCRIPTION;
    const buttonText = rows[3]?.textContent.trim() || SPECTRUM_CARD_CONFIG.DEFAULT_BUTTON_TEXT;

    // Debug: log extracted content
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] content', {
      imageUrl,
      title,
      description,
      buttonText,
    });

    block.textContent = '';
    // Debug: log after clearing block
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] block cleared');

    const card = document.createElement('sp-card');
    card.setAttribute('heading', title);
    card.setAttribute('variant', SPECTRUM_CARD_CONFIG.CARD_VARIANT);
    card.style.maxWidth = SPECTRUM_CARD_CONFIG.MAX_WIDTH;

    if (imageUrl) {
      const img = document.createElement('img');
      img.setAttribute('slot', 'preview');
      img.src = imageUrl;
      img.alt = title;
      img.style.width = '100%';
      img.style.height = 'auto';
      card.appendChild(img);
      // Debug: log image added
      // eslint-disable-next-line no-console
      console.debug('[spectrum-card] image added', imageUrl);
    }

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
    const icon = document.createElement('sp-icon-arrow-right');
    icon.setAttribute('slot', 'icon');
    button.appendChild(icon);
    button.addEventListener('click', () => {
      // eslint-disable-next-line no-console
      console.log('Card action clicked:', {
        title,
        description,
      });
    });
    footerDiv.appendChild(button);
    card.appendChild(descriptionDiv);
    card.appendChild(footerDiv);
    block.appendChild(card);
    // Debug: log after card appended
    // eslint-disable-next-line no-console
    console.debug('[spectrum-card] card appended to block');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[spectrum-card] decorate error', err);
  }
}
