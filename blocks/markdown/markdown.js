// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
};

/**
 * Converts Markdown to HTML while preserving raw Markdown syntax
 * @param {string} markdown - The Markdown content to convert
 * @returns {string} The converted HTML with preserved Markdown syntax
 */
function convertMarkdownToHtml(markdown) {
  return markdown
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

/**
 * Decorates the markdown block
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'markdown-container';

  try {
    const markdownContent = block.textContent.trim();
    container.innerHTML = convertMarkdownToHtml(markdownContent);
    block.textContent = '';
    block.appendChild(container);
  } catch (error) {
    console.error('Markdown Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'markdown-error';
    errorElement.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
    container.appendChild(errorElement);
  }

  block.classList.add('markdown--initialized');
}
