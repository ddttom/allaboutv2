import { createOptimizedPicture } from '../../scripts/aem.js';

const MARKDOWN_CONFIG = {
  CONTAINER_CLASS: 'markdown-content',
  ERROR_MESSAGE: 'Error processing markdown content.',
};

// Function to trim all lines in the content
function trimLines(content) {
  return content.split('\n').map(line => line.trim()).join('\n');
}

// Function to convert markdown to HTML
async function markdownToHtml(markdown) {
  // For this example, we'll use a simple markdown-it library
  // In a real implementation, you might want to use a more robust markdown parser
  const response = await fetch('https://unpkg.com/markdown-it@13.0.1/dist/markdown-it.min.js');
  const script = await response.text();
  // eslint-disable-next-line no-eval
  eval(script);
  // eslint-disable-next-line no-undef
  const md = window.markdownit();
  return md.render(markdown);
}

export default async function decorate(block) {
  const content = block.textContent.trim();
  const trimmedContent = trimLines(content);

  try {
    const htmlContent = await markdownToHtml(trimmedContent);
    
    const container = document.createElement('div');
    container.className = MARKDOWN_CONFIG.CONTAINER_CLASS;
    container.innerHTML = htmlContent;

    // Replace images with optimized versions
    container.querySelectorAll('img').forEach((img) => {
      const optimizedImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.parentElement.replaceChild(optimizedImg, img);
    });

    // Clear the original content and append the processed content
    block.textContent = '';
    block.appendChild(container);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(MARKDOWN_CONFIG.ERROR_MESSAGE, error);
    block.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
  }
}
