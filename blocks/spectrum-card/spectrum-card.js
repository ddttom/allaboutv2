import { loadCSS, loadScript } from '../../scripts/aem.js';
const SPECTRUM_CONFIG = {
  VERSION: '0.30.0',
  CDN_BASE: 'https://cdn.jsdelivr.net/npm/@spectrum-web-components',
  THEME: 'spectrum',
  COLOR: 'light',
  SCALE: 'medium'
};

export default async function decorate(block) {
  try {
    // Load Spectrum Web Components theme
    await loadCSS(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/theme-light.css`);
    // Load required Spectrum components
    await Promise.all([
loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/theme-light.js`, { type: 'module' }),      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/card@${SPECTRUM_CONFIG.VERSION}/sp-card.js`, { type: 'module' }),   loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/button@${SPECTRUM_CONFIG.VERSION}/sp-button.js`, { type: 'module' }),
loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/icons-workflow@${SPECTRUM_CONFIG.VERSION}/icons/Info.js`, { type: 'module' })
    ]);
    
    // Extract content from the block table
    const rows = Array.from(block.children);
    const title = rows[0]?.textContent.trim() || 'Card Title';
    const description = rows[1]?.textContent.trim() || 'Card description';
    const buttonText = rows[2]?.textContent.trim() || 'Action';
   
    // Clear the block
    block.textContent = '';
    // Create the card structure

    const card = document.createElement('sp-card');
    card.setAttribute('heading', title);
    card.setAttribute('variant', 'quiet');
    card.style.maxWidth = '400px';
    // Add card content
    card.innerHTML = `
      <div slot="description">${description}</div>
      <div slot="footer">
        <sp-button treatment="accent" size="m">
          ${buttonText}
        </sp-button>
      </div>
    `;
    // Add interaction
    const button = card.querySelector('sp-button');
    button.addEventListener('click', () => {
      // eslint-disable-next-line no-console
      console.log('Card action clicked');
      // Add your action logic here
    });

    block.appendChild(card);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading Spectrum Web Components:', error);
    block.innerHTML = '<p>Error loading component. Please try again.</p>';
  }
}
