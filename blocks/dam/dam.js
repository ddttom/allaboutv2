// Configuration object for the DAM block
const DAM_CONFIG = {
  ERROR_MESSAGES: {
    MISSING_IMAGE: 'Image element is missing or invalid',
    PARSING_ERROR: 'Error parsing row data',
    URL_PARSE_ERROR: 'Error parsing URL',
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
  
  // The image is directly in the cell, not nested
  if (element.tagName === 'IMG') {
    try {
      const url = new URL(element.src);
      return url.pathname;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(DAM_CONFIG.ERROR_MESSAGES.URL_PARSE_ERROR, error);
      return '';
    }
  }
  
  // Check for nested image
  const img = element.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
  if (img) {
    try {
      const url = new URL(img.src);
      return url.pathname;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(DAM_CONFIG.ERROR_MESSAGES.URL_PARSE_ERROR, error);
      return '';
    }
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
          path: extractPath(cells[4].firstElementChild), // Get the first child element (img)
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
