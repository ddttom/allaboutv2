// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
};

/**
 * Escapes HTML special characters in the Markdown content
 * @param {string} markdown - The Markdown content to escape
 * @returns {string} The escaped Markdown content
 */
function escapeHtml(markdown) {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Decorates the markdown block
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  const container = document.createElement('pre');
  container.className = 'markdown markdown-border';

  try {
    const markdownContent = block.textContent.trim();
    container.textContent = markdownContent;
    block.textContent = '';
    block.appendChild(container);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Markdown Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'markdown-error';
    errorElement.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
    container.appendChild(errorElement);
  }

  block.classList.add('markdown--initialized');
}
