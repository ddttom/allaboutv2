// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
};

/**
 * Decorates the markdown block
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  try {
    const markdownContent = block.textContent.trim();
    const pre = document.createElement('pre');
    pre.className = 'markdown';
    pre.setAttribute('aria-label', 'Markdown content');
    
    // Split the content by lines and join them back with proper line breaks
    const lines = markdownContent.split('\n');
    pre.textContent = lines.map(line => line.trim()).join('\n');
    
    block.textContent = '';
    block.appendChild(pre);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Markdown Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'markdown-error';
    errorElement.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
    block.appendChild(errorElement);
  }
}
