// Constants for configuration
const BOOK_TITLE = 'Code Showcase';
const ERROR_MESSAGE = 'Error loading content. Please try again.';

export default async function decorate(block) {
  // Create main container
  const container = document.createElement('div');
  container.className = 'showcaser-container';
  block.appendChild(container);

  // Create book structure
  const book = document.createElement('div');
  book.className = 'showcaser-book';
  container.appendChild(book);

  const leftPage = document.createElement('div');
  leftPage.className = 'showcaser-left-page';
  book.appendChild(leftPage);

  const rightPage = document.createElement('div');
  rightPage.className = 'showcaser-right-page';
  book.appendChild(rightPage);

  // Add book title
  const bookTitle = document.createElement('h2');
  bookTitle.textContent = BOOK_TITLE;
  leftPage.appendChild(bookTitle);

  try {
    // Find all <pre> elements in the current page
    const preElements = document.querySelectorAll('pre');
    const codeSnippets = [];

    // Collect rendered HTML and remove existing <pre> elements
    preElements.forEach((pre) => {
      const title = pre.textContent.split('\n')[0].trim();
      const content = pre.innerHTML;
      codeSnippets.push({ title, content });
      pre.remove();
    });

    // Create clickable titles in the left page
    codeSnippets.forEach((snippet, index) => {
      const titleElement = document.createElement('button'); // Changed to button for better accessibility
      titleElement.className = 'showcaser-title';
      titleElement.textContent = snippet.title;
      titleElement.setAttribute('aria-controls', `snippet-${index}`);
      titleElement.addEventListener('click', () => {
        // Display the selected content in the right page
        rightPage.innerHTML = `<h3 id="snippet-${index}">${snippet.title}</h3>${snippet.content}`;
        // Highlight the active title
        document.querySelectorAll('.showcaser-title').forEach((el) => el.classList.remove('active'));
        titleElement.classList.add('active');
        // Set focus to the displayed content for better screen reader navigation
        document.getElementById(`snippet-${index}`).focus();
      });
      leftPage.appendChild(titleElement);

      // Display the first snippet by default
      if (index === 0) {
        titleElement.click();
      }
    });

  } catch (error) {
    // Display error message
    const errorElement = document.createElement('div');
    errorElement.className = 'showcaser-error';
    errorElement.textContent = ERROR_MESSAGE;
    container.appendChild(errorElement);
    // eslint-disable-next-line no-console
    console.error('Showcaser Error:', error);
  }

  // Add initialized class to enable CSS transitions
  block.classList.add('showcaser--initialized');
}
