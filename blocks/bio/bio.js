/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-absolute-path */
import { renderExpressions } from '/plusplus/plugins/expressions/src/expressions.js';

// eslint-disable-next-line no-unused-vars
export default function decorate(block) {
  // Check the current block, not a global selector
  if (!block.classList.contains('hide-author')) {
    // Check if the first cell contains a link to an image and replace it with the actual image
    const firstCell = block.querySelector('div > div:first-child');
    if (firstCell) {
      const link = firstCell.querySelector('a');
      if (link && link.href) {
        // Check if the link points to an image file
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const isImageLink = imageExtensions.some(ext => 
          link.href.toLowerCase().includes(ext)
        );
        
        if (isImageLink) {
          // Create an img element to replace the link
          const img = document.createElement('img');
          img.src = link.href;
          img.alt = link.textContent || 'Bio image';

          // Replace the link with the image (atomic operation)
          link.replaceWith(img);
        }
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
