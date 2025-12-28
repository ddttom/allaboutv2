// External dependency from sibling repository
// eslint-disable-next-line import/no-unresolved, import/no-absolute-path
import { renderExpressions } from '../../../../../../../plusplus/plugins/expressions/src/expressions.js';

const BIO_CONFIG = {
  DEFAULT_ALT_TEXT: 'Bio image',
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
};

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  // Check the current block, not a global selector
  if (!block.classList.contains('hide-author')) {
    // Get all divs in the first row and find the actual first cell
    const firstRow = block.querySelector('div > div:first-child');
    if (!firstRow) return;

    // Get all immediate child divs (cells) in the first row
    const cells = Array.from(firstRow.querySelectorAll(':scope > div'));
    if (cells.length === 0) return;

    const firstCell = cells[0];

    // Check if the first cell contains a link to an image
    const link = firstCell.querySelector('a');
    if (link && link.href) {
      // Check if the link points to an image file
      const isImageLink = BIO_CONFIG.IMAGE_EXTENSIONS.some(
        (ext) => link.href.toLowerCase().includes(ext),
      );

      if (isImageLink) {
        // Create an img element to replace the link
        const img = document.createElement('img');
        img.src = link.href;

        // Check if link text is a URL (not a proper author name)
        const linkText = link.textContent || '';
        const isLinkTextUrl = linkText.startsWith('http://') || linkText.startsWith('https://');

        // Only use link text as alt if it's NOT a URL
        // If it's a URL, leave alt empty - author name will be extracted from meta tag
        img.alt = isLinkTextUrl ? '' : linkText || 'Bio image';

        // Replace the link with the image (atomic operation)
        link.replaceWith(img);
      }
    }
    // Find the <img> element within the current block
    const imgElement = block.querySelector('img');

    let author = '';

    // Check if the <img> element has a non-empty alt attribute
    if (imgElement && imgElement.getAttribute('alt')) {
      author = imgElement.getAttribute('alt');
    }

    // If the alt attribute is empty or not present, fall back to the <meta> tag's author content
    if (!author) {
      const metaAuthor = document.querySelector('meta[name="author"]');
      if (metaAuthor) {
        author = metaAuthor.getAttribute('content');
      }
    }

    // Create a new <strong> element to hold the author name
    const authorElement = document.createElement('strong');
    authorElement.textContent = author;

    // Insert the author element as the last child of the current block
    block.appendChild(authorElement);
  }
  renderExpressions(document.querySelector('.bio-wrapper'));
}
