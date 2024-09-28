// Constants for configuration
const BOOK_TITLE = 'Code Showcase';
const ERROR_MESSAGE = 'Error loading content. Please try again.';

function detectLanguage(code) {
  if (code.trim().startsWith('"') || code.trim().startsWith("'")) {
    return 'text';
  }
  
  if (/^(ls|cd|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(code)) {
    return 'shell';
  }
  
  if (code.includes('function') || code.includes('var') || code.includes('const')) return 'javascript';
  if (code.includes('{') && code.includes('}')) {
    if (code.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
    if (code.includes(':')) return 'json';
  }
  if (code.includes('<') && code.includes('>') && (code.includes('</') || code.includes('/>'))) return 'html';
  
  if (code.match(/^(#{1,6}\s|\*\s|-\s|\d+\.\s|\[.*\]\(.*\))/m)) return 'markdown';
  
  if (code.startsWith('$') || code.startsWith('#')) return 'shell';
  
  return 'text';
}

function highlightSyntax(code, language) {
  // ... (copy the entire highlightSyntax function from code-expander.js)
  // This function is quite long, so I'm not repeating it here for brevity
}

export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'showcaser-container';
  block.appendChild(container);

  const book = document.createElement('div');
  book.className = 'showcaser-book';
  container.appendChild(book);

  const leftPage = document.createElement('div');
  leftPage.className = 'showcaser-left-page';
  book.appendChild(leftPage);

  const rightPage = document.createElement('div');
  rightPage.className = 'showcaser-right-page';
  book.appendChild(rightPage);

  const bookTitle = document.createElement('h2');
  bookTitle.textContent = BOOK_TITLE;
  leftPage.appendChild(bookTitle);

  try {
    const codeElements = document.querySelectorAll('pre');
    const codeSnippets = [];

    codeElements.forEach((pre) => {
      const code = pre.textContent;
      const title = code.split('\n')[0].trim();
      const language = detectLanguage(code);
      const highlightedCode = highlightSyntax(code, language);
      codeSnippets.push({ title, content: highlightedCode, language });
      pre.remove();
    });

    codeSnippets.forEach((snippet, index) => {
      const titleElement = document.createElement('button');
      titleElement.className = 'showcaser-title';
      titleElement.textContent = snippet.title;
      titleElement.setAttribute('aria-controls', `snippet-${index}`);
      titleElement.addEventListener('click', () => {
        rightPage.innerHTML = `
          <h3 id="snippet-${index}">${snippet.title}</h3>
          <pre class="language-${snippet.language}">${snippet.content}</pre>
        `;
        document.querySelectorAll('.showcaser-title').forEach((el) => el.classList.remove('active'));
        titleElement.classList.add('active');
        document.getElementById(`snippet-${index}`).focus();
      });
      leftPage.appendChild(titleElement);

      if (index === 0) {
        titleElement.click();
      }
    });

  } catch (error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'showcaser-error';
    errorElement.textContent = ERROR_MESSAGE;
    container.appendChild(errorElement);
    // eslint-disable-next-line no-console
    console.error('Showcaser Error:', error);
  }

  block.classList.add('showcaser--initialized');
}
