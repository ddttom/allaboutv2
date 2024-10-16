// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
};

/**
 * Applies basic syntax highlighting to Markdown content
 * @param {string} markdown - The Markdown content to highlight
 * @returns {string} The highlighted Markdown content
 */
function highlightMarkdown(markdown) {
  return markdown
    .replace(/^(#{1,6}\s.*)/gm, '<span class="md-heading">$1</span>')
    .replace(/(\*\*.*?\*\*)/g, '<span class="md-bold">$1</span>')
    .replace(/(\*.*?\*)/g, '<span class="md-italic">$1</span>')
    .replace(/(`.*?`)/g, '<span class="md-code">$1</span>')
    .replace(/^(\s*[-*+]\s.*)/gm, '<span class="md-list-item">$1</span>')
    .replace(/(\[.*?\]\(.*?\))/g, '<span class="md-link">$1</span>');
}

/**
 * Converts Markdown to HTML while preserving raw Markdown syntax
 * @param {string} markdown - The Markdown content to convert
 * @returns {string} The converted HTML with preserved Markdown syntax
 */
function convertMarkdownToHtml(markdown) {
  const trimmedMarkdown = markdown
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  const escapedMarkdown = trimmedMarkdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const highlightedMarkdown = highlightMarkdown(escapedMarkdown);

  return highlightedMarkdown.replace(/\n/g, '<br>');
}

/**
 * Decorates the markdown block
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'markdown-container markdown-border'; // Added markdown-border class

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
