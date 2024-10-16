import { createOptimizedPicture } from '../../scripts/aem.js';

const MARKDOWN_CONFIG = {
  CONTAINER_CLASS: 'markdown-content',
  ERROR_MESSAGE: 'Error processing markdown content.',
};

// Function to trim all lines in the content
function trimLines(content) {
  return content.split('\n').map(line => line.trim()).join('\n');
}

export default function decorate(block) {
  try {
    const content = block.textContent.trim();
    const trimmedContent = trimLines(content);
    
    const container = document.createElement('div');
    container.className = MARKDOWN_CONFIG.CONTAINER_CLASS;
    
    // Create a pre element to preserve formatting
    const preElement = document.createElement('pre');
    preElement.textContent = trimmedContent;
    
    container.appendChild(preElement);

    // Clear the original content and append the processed content
    block.textContent = '';
    block.appendChild(container);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(MARKDOWN_CONFIG.ERROR_MESSAGE, error);
    block.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
  }
}
