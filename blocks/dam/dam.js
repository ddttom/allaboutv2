// Configuration object for the DAM block
const DAM_CONFIG = {
  ERROR_MESSAGES: {
    MISSING_IMAGE: 'Image element is missing or invalid',
    PARSING_ERROR: 'Error parsing row data',
    URL_PARSE_ERROR: 'Error parsing URL',
  },
  SELECTORS: {
    IMAGE: 'img',
    PICTURE: 'picture',
  },
  OUTPUT_INDENT: 2,
  ARIA: {
    ROLE: 'region',
    LABEL: 'Digital Asset Metadata JSON Output',
  },
};

/**
 * Extracts the base path from a URL with query parameters
 * @param {string} url - The full URL
 * @returns {string} The path without query parameters
 */
function extractBasePath(url) {
  try {
    const urlObj = new URL(url);
    // Get the pathname and remove query parameters
    const path = urlObj.pathname.split('?')[0];
    return path;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(DAM_CONFIG.ERROR_MESSAGES.URL_PARSE_ERROR, error);
    return '';
  }
}

/**
 * Extracts the path from an image or picture element
 * @param {HTMLElement} element - The element containing the path
 * @returns {string} The extracted path
 */
function extractPath(element) {
  if (!element) return '';
  
  // Check for picture element
  const picture = element.querySelector(DAM_CONFIG.SELECTORS.PICTURE);
  if (picture) {
    const img = picture.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
    if (img && img.src) {
      return extractBasePath(img.src);
    }
  }
  
  // Fallback to direct image
  const img = element.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
  if (img && img.src) {
    return extractBasePath(img.src);
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
        const rowData = {
          note: cells[0]?.textContent?.trim() || '',
          description: cells[1]?.textContent?.trim() || '',
          classification: cells[2]?.textContent?.trim() || '',
          tag: cells[3]?.textContent?.trim() || '',
          path: extractPath(cells[5]), // Image is in the 6th cell (index 5)
          additionalInfo: cells[6]?.textContent?.trim() || '',
        };
        
        data.push(rowData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(DAM_CONFIG.ERROR_MESSAGES.PARSING_ERROR, error);
    }
  });

  block.textContent = '';
  block.appendChild(createJsonDisplay(data));
}
