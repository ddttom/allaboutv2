// Configuration constants
const LOADING_MESSAGE = 'Loading content...';
const ERROR_MESSAGE = 'Error loading content. Please try again.';

// Helper function to create DOM elements
const createElement = (tag, className, textContent = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

// Main function to decorate the showcaser block
export default async function decorate(block) {
  // Check for compact variation
  const isCompact = block.classList.contains('showcaser--compact');

  // Create main container
  const container = createElement('div', 'showcaser-container');
  if (isCompact) container.classList.add('showcaser-container--compact');
  block.appendChild(container);

  // Create loading message
  const loadingElement = createElement('p', 'showcaser-loading', LOADING_MESSAGE);
  container.appendChild(loadingElement);

  try {
    // Get the content from the first row of the table
    const content = block.querySelector('td').textContent.trim();

    if (!content) {
      throw new Error('No content found');
    }

    // Remove loading message
    container.removeChild(loadingElement);

    // Create showcaser interface
    const showcaserContent = createElement('div', 'showcaser-content', content);
    showcaserContent.setAttribute('role', 'region');
    showcaserContent.setAttribute('aria-label', 'Showcaser content');
    container.appendChild(showcaserContent);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Showcaser Error:', error);
    container.innerHTML = `<p class="showcaser-error">${ERROR_MESSAGE}</p>`;
  }
}
