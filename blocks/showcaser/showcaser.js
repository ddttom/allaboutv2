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
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const highlighted = escapeHtml(code);

  switch (language) {
    case 'css':
      return highlighted.replace(
        /([\w-]+\s*:)|(#[\da-f]{3,6})/gi,
        match => {
          if (/:$/.test(match)) return `<span class="property">${match}</span>`;
          return `<span class="value">${match}</span>`;
        }
      );
    case 'javascript':
      return highlighted.replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`|\b(?:function|var|const|let|if|else|for|while|return|class|import|export)\b|\b(?:true|false|null|undefined)\b|\b\d+\b)/g,
        match => {
          if (/^\/\//.test(match)) return `<span class="comment">${match}</span>`;
          if (/^\/\*/.test(match)) return `<span class="comment">${match}</span>`;
          if (/^['"`]/.test(match)) return `<span class="string">${match}</span>`;
          if (/^(function|var|const|let|if|else|for|while|return|class|import|export)$/.test(match)) return `<span class="keyword">${match}</span>`;
          if (/^(true|false|null|undefined)$/.test(match)) return `<span class="boolean">${match}</span>`;
          if (/^\d+$/.test(match)) return `<span class="number">${match}</span>`;
          return match;
        }
      );
    default:
      return highlighted;
  }
}

export default async function decorate(block) {
  console.log('Showcaser: Starting decoration');
  
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
    const codeSnippets = [];

    // Find all pre>code elements in the document
    const codeElements = document.querySelectorAll('pre > code');
    console.log('Showcaser: Found', codeElements.length, 'code elements');

    codeElements.forEach((element, index) => {
      const code = element.textContent;
      console.log(`Showcaser: Processing code snippet ${index + 1}:`, code.substring(0, 50) + '...');
      
      const lines = code.split('\n');
      const title = lines[0].trim() || `Code Snippet ${index + 1}`;
      const content = lines.join('\n').trim();
      
      if (content) {
        const language = detectLanguage(content);
        console.log(`Showcaser: Detected language for snippet ${index + 1}:`, language);
        
        const highlightedCode = highlightSyntax(content, language);
        codeSnippets.push({ title, content: highlightedCode, language });
      }
    });

    console.log('Showcaser: Processed', codeSnippets.length, 'code snippets');

    codeSnippets.forEach((snippet, index) => {
      const titleElement = document.createElement('a');
      titleElement.className = 'showcaser-title';
      titleElement.textContent = snippet.title;
      titleElement.href = '#';
      titleElement.setAttribute('aria-controls', `snippet-${index}`);
      titleElement.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Showcaser: Clicked on snippet ${index + 1}:`, snippet.title);
        rightPage.innerHTML = `
          <h3 id="snippet-${index}">${snippet.title}</h3>
          <pre class="language-${snippet.language}"><code>${snippet.content}</code></pre>
        `;
        document.querySelectorAll('.showcaser-title').forEach((el) => el.classList.remove('active'));
        titleElement.classList.add('active');
        document.getElementById(`snippet-${index}`).focus();
      });
      leftPage.appendChild(titleElement);

      if (index === 0) {
        console.log('Showcaser: Activating first snippet');
        titleElement.click();
      }
    });

    // Remove the original code elements
    codeElements.forEach((element) => {
      const preElement = element.parentElement;
      if (preElement && preElement.tagName.toLowerCase() === 'pre') {
        preElement.remove();
        console.log('Showcaser: Removed original code element');
      }
    });

  } catch (error) {
    console.error('Showcaser Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'showcaser-error';
    errorElement.textContent = ERROR_MESSAGE;
    container.appendChild(errorElement);
  }

  block.classList.add('showcaser--initialized');
  console.log('Showcaser: Finished decoration');
}
