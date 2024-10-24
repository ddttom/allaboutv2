// Configuration object for the DAM block
const DAM_CONFIG = {
  ERROR_MESSAGES: {
    MISSING_IMAGE: 'Image element is missing or invalid',
    PARSING_ERROR: 'Error parsing row data',
  },
  SELECTORS: {
    IMAGE: 'img',
    LINK: 'a',
  },
  OUTPUT_INDENT: 2,
  ARIA: {
    ROLE: 'region',
    LABEL: 'Digital Asset Metadata JSON Output',
  },
};

/**
 * Extracts the path from an image or link element
 * @param {HTMLElement} element - The element containing the path
 * @returns {string} The extracted path
 */
function extractPath(element) {
  if (!element) return '';
  
  const img = element.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
  const link = element.querySelector(DAM_CONFIG.SELECTORS.LINK);
  
  if (img) {
    const url = new URL(img.src);
    return url.pathname;
  }
  
  if (link) {
    const url = new URL(link.href);
    return url.pathname;
  }
  
  return '';
}

/**
 * Creates a JSON display element
 * @param {Object[]} data - The data to display
 * @returns {HTMLElement} The pre/code element containing the JSON
 */
function createJsonDisplay(data) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  
  // Add ARIA attributes
  pre.setAttribute('role', DAM_CONFIG.ARIA.ROLE);
  pre.setAttribute('aria-label', DAM_CONFIG.ARIA.LABEL);
  pre.setAttribute('tabindex', '0');
  
  code.textContent = JSON.stringify(data, null, DAM_CONFIG.OUTPUT_INDENT);
  pre.appendChild(code);
  return pre;
}

/**
 * Decorates the DAM block
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  const rows = Array.from(block.children);
  const data = [];

  // Skip the header row and process remaining rows
  rows.slice(1).forEach((row) => {
    try {
      const cells = Array.from(row.children);
      if (cells.length >= 5) {
        data.push({
          note: cells[0]?.textContent?.trim() || '',
          description: cells[1]?.textContent?.trim() || '',
          classification: cells[2]?.textContent?.trim() || '',
          tag: cells[3]?.textContent?.trim() || '',
          path: extractPath(cells[4]),
          additionalInfo: cells[5]?.textContent?.trim() || '',
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(DAM_CONFIG.ERROR_MESSAGES.PARSING_ERROR, error);
    }
  });

  // Clear the block and add the JSON display
  block.textContent = '';
  block.appendChild(createJsonDisplay(data));
}
