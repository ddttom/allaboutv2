// Configuration constants
const LOADING_MESSAGE = 'Loading code snippets...';
const ERROR_MESSAGE = 'Error loading code snippets. Please try again.';

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
    // Collect all code blocks enclosed in single backticks
    const codeBlocks = Array.from(document.querySelectorAll('code')).filter(
      (code) => code.textContent.trim().startsWith('`') && code.textContent.trim().endsWith('`')
    );

    if (codeBlocks.length === 0) {
      throw new Error('No code blocks found');
    }

    // Remove loading message
    container.removeChild(loadingElement);

    // Create book interface
    const bookContainer = createElement('div', 'showcaser-book');
    container.appendChild(bookContainer);

    const leftPanel = createElement('div', 'showcaser-left-panel');
    const rightPanel = createElement('div', 'showcaser-right-panel');
    bookContainer.appendChild(leftPanel);
    bookContainer.appendChild(rightPanel);

    // Process code blocks
    codeBlocks.forEach((codeBlock, index) => {
      const content = codeBlock.textContent.trim().slice(1, -1); // Remove backticks
      const lines = content.split('\n');
      const title = lines[0].trim();
      const code = lines.slice(1).join('\n');

      // Create title element in left panel
      const titleElement = createElement('button', 'showcaser-title', title);
      titleElement.setAttribute('aria-controls', `showcaser-content-${index}`);
      titleElement.setAttribute('aria-expanded', 'false');
      leftPanel.appendChild(titleElement);

      // Create content element in right panel
      const contentElement = createElement('div', 'showcaser-content');
      contentElement.id = `showcaser-content-${index}`;
      contentElement.setAttribute('role', 'region');
      contentElement.setAttribute('aria-labelledby', titleElement.id);
      contentElement.innerHTML = code;
      contentElement.hidden = true;
      rightPanel.appendChild(contentElement);

      // Add click event listener
      titleElement.addEventListener('click', () => {
        updateContent(titleElement, contentElement);
      });

      // Remove original code block
      codeBlock.parentNode.removeChild(codeBlock);
    });

    // Activate first item by default
    leftPanel.querySelector('.showcaser-title').click();

    // Add keyboard navigation
    leftPanel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const titles = Array.from(leftPanel.querySelectorAll('.showcaser-title'));
        const currentIndex = titles.findIndex(title => title === document.activeElement);
        let newIndex = currentIndex;

        if (e.key === 'ArrowDown') {
          newIndex = (currentIndex + 1) % titles.length;
        } else {
          newIndex = (currentIndex - 1 + titles.length) % titles.length;
        }

        titles[newIndex].focus();
      }
    });

    function updateContent(titleElement, contentElement) {
      // Hide all content elements
      rightPanel.querySelectorAll('.showcaser-content').forEach((el) => {
        el.hidden = true;
        el.setAttribute('aria-hidden', 'true');
      });
      // Show clicked content
      contentElement.hidden = false;
      contentElement.setAttribute('aria-hidden', 'false');
      // Update active state of titles
      leftPanel.querySelectorAll('.showcaser-title').forEach((el) => {
        el.classList.remove('active');
        el.setAttribute('aria-expanded', 'false');
      });
      titleElement.classList.add('active');
      titleElement.setAttribute('aria-expanded', 'true');
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Showcaser Error:', error);
    container.innerHTML = `<p class="showcaser-error">${ERROR_MESSAGE}</p>`;
  }
}
