// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
};

/**
 * Decorates the markdown block
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'markdown';

  try {
    const markdownContent = block.textContent.trim();
    const contentElement = document.createElement('div');
    contentElement.className = 'markdown-content';
    contentElement.textContent = markdownContent;
    container.appendChild(contentElement);
    
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
}
