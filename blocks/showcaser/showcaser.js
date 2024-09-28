// Showcaser block - Displays a visually appealing showcase for code
export default async function decorate(block) {
  // Configuration
  const bookTitle = 'Code Showcase';
  const loadingMessage = 'Loading code samples...';
  const errorMessage = 'Error loading code samples. Please try again.';

  // Check for compact variation
  const isCompact = block.classList.contains('compact');

  // Create book structure
  const book = document.createElement('div');
  book.className = `showcaser-book ${isCompact ? 'compact' : ''}`;
  const leftPanel = document.createElement('div');
  leftPanel.className = 'showcaser-left-panel';
  const rightPanel = document.createElement('div');
  rightPanel.className = 'showcaser-right-panel';
  book.appendChild(leftPanel);
  book.appendChild(rightPanel);

  // Create and append book title
  const titleElement = document.createElement('h2');
  titleElement.textContent = bookTitle;
  titleElement.className = 'showcaser-title';
  leftPanel.appendChild(titleElement);

  // Create loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'showcaser-loading';
  loadingIndicator.textContent = loadingMessage;
  block.appendChild(loadingIndicator);

  try {
    // Collect all <pre> elements from the page
    const preElements = document.querySelectorAll('pre');
    const codeSnippets = [];

    preElements.forEach((pre) => {
      const title = pre.textContent.trim().split('\n')[0];
      const content = pre.innerHTML;
      codeSnippets.push({ title, content });
      pre.remove(); // Remove the original <pre> element
    });

    // Create clickable titles in the left panel
    codeSnippets.forEach((snippet) => {
      const titleButton = document.createElement('button');
      titleButton.textContent = snippet.title;
      titleButton.className = 'showcaser-title-button';
      titleButton.addEventListener('click', () => {
        rightPanel.innerHTML = snippet.content;
        // Update active state
        leftPanel.querySelectorAll('.showcaser-title-button').forEach(btn => btn.classList.remove('active'));
        titleButton.classList.add('active');
      });
      leftPanel.appendChild(titleButton);
    });

    // Display the first snippet by default
    if (codeSnippets.length > 0) {
      rightPanel.innerHTML = codeSnippets[0].content;
      leftPanel.querySelector('.showcaser-title-button').classList.add('active');
    }

    // Remove loading indicator and append the book
    loadingIndicator.remove();
    block.appendChild(book);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in showcaser block:', error);
    loadingIndicator.textContent = errorMessage;
    loadingIndicator.classList.add('error');
  }
}
