import { loadCSS, loadScript } from '../../scripts/aem.js';

const SPECTRUM_CONFIG = {
  VERSION: '1.6.0',
  CDN_BASE: 'https://cdn.jsdelivr.net/npm/@spectrum-web-components',
  THEME: 'spectrum',
  COLOR: 'light',
  SCALE: 'medium'
};

export default async function decorate(block) {
  try {
    // eslint-disable-next-line no-console
    console.log('Starting Spectrum Web Components load...');
    
    // Load base theme first
    // eslint-disable-next-line no-console
    console.log('Loading base component...');
    await loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/base@${SPECTRUM_CONFIG.VERSION}/sp-base.js`, { type: 'module' })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load base component:', error);
        throw error;
      });
    
    // Load theme and scale
    // eslint-disable-next-line no-console
    console.log('Loading theme components...');
    await Promise.all([
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/sp-theme.js`, { type: 'module' }),
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/scale-medium.js`, { type: 'module' }),
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/theme@${SPECTRUM_CONFIG.VERSION}/theme-light.js`, { type: 'module' })
    ]).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load theme components:', error);
      throw error;
    });

    // Load component dependencies
    // eslint-disable-next-line no-console
    console.log('Loading component dependencies...');
    await Promise.all([
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/card@${SPECTRUM_CONFIG.VERSION}/sp-card.js`, { type: 'module' }),
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/button@${SPECTRUM_CONFIG.VERSION}/sp-button.js`, { type: 'module' }),
      loadScript(`${SPECTRUM_CONFIG.CDN_BASE}/icons-workflow@${SPECTRUM_CONFIG.VERSION}/icons/Info.js`, { type: 'module' })
    ]).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load component dependencies:', error);
      throw error;
    });

    // eslint-disable-next-line no-console
    console.log('All components loaded successfully');

    // Create and add theme element if it doesn't exist
    let themeElement = document.querySelector('sp-theme');
    if (!themeElement) {
      // eslint-disable-next-line no-console
      console.log('Creating theme element...');
      themeElement = document.createElement('sp-theme');
      themeElement.setAttribute('color', SPECTRUM_CONFIG.COLOR);
      themeElement.setAttribute('scale', SPECTRUM_CONFIG.SCALE);
      document.body.insertBefore(themeElement, document.body.firstChild);
    }
    
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

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading Spectrum Web Components:', error);
    // eslint-disable-next-line no-console
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      target: error.target?.src
    });
    block.innerHTML = '<p>Error loading component. Please try again.</p>';
  }
}
