// Configuration object for the DAM block
const DAM_CONFIG = {
  ERROR_MESSAGES: {
    MISSING_IMAGE: 'Image element is missing or invalid',
    PARSE_ERROR: 'Error parsing image data',
  },
  SELECTORS: {
    IMAGE: 'img',
    LINK: 'a',
    PICTURE: 'picture',
  },
  OUTPUT_INDENT: 2,
};

/**
 * Extracts the path from an image, picture, or link element
 * @param {HTMLElement} element - The element containing the image or link
 * @returns {string} The extracted path
 */
function extractPath(element) {
  if (!element) return '';
  
  // Check for picture element first (Franklin's preferred format)
  const picture = element.querySelector(DAM_CONFIG.SELECTORS.PICTURE);
  if (picture) {
    const img = picture.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
    if (img) {
      const url = new URL(img.src);
      // Remove query parameters and get base path
      return url.pathname.split('?')[0];
    }
  }
  
  // Fallback to direct image
  const img = element.querySelector(DAM_CONFIG.SELECTORS.IMAGE);
  if (img) {
    const url = new URL(img.src);
    return url.pathname.split('?')[0];
  }
  
  // Fallback to link
  const link = element.querySelector(DAM_CONFIG.SELECTORS.LINK);
  if (link) {
    const url = new URL(link.href);
    return url.pathname.split('?')[0];
  }
  
  return '';
}

/**
 * Creates a JSON display element
 * @param {Array} data - The data to display as JSON
 * @returns {HTMLElement} The pre/code element containing the formatted JSON
 */
function createJsonDisplay(data) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = JSON.stringify(data, null, DAM_CONFIG.OUTPUT_INDENT);
  pre.appendChild(code);
  return pre;
}

/**
 * Decorates the DAM block
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  const rows = [...block.children];
  
  // Skip the header row
  const dataRows = rows.slice(1);
  
  const damData = dataRows.map((row) => {
    const [note, description, classification, tag, imageCell, additionalInfo] = [...row.children];
    
    return {
      note: note?.textContent?.trim() || '',
      description: description?.textContent?.trim() || '',
      classification: classification?.textContent?.trim() || '',
      tag: tag?.textContent?.trim() || '',
      path: extractPath(imageCell),
      additionalInfo: additionalInfo?.textContent?.trim() || '',
    };
  });

  // Clear the block and add the JSON display
  block.textContent = '';
  block.appendChild(createJsonDisplay(damData));
}
