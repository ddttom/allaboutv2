// Constants for configuration
const BOOK_TITLE = 'Code Showcase';
const ERROR_MESSAGE = 'Error loading content. Please try again.';
const COPY_BUTTON_RESET_DELAY = 2000;
const SCROLL_THRESHOLD = 100;

function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function detectLanguage(code) {
  const decodedCode = decodeHtmlEntities(code);


  // Simple check for Markdown
  if (decodedCode.trim().startsWith('# ')) {
    return 'markdown';
  }

  // Rest of the language detection logic
  if (decodedCode.trim().startsWith('"') || decodedCode.trim().startsWith("'")) {
    return 'text';
  }
  
  if (/^(ls|cd|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(decodedCode)) {
    return 'shell';
  }
  
  if (decodedCode.includes('function') || decodedCode.includes('var') || decodedCode.includes('const')) return 'javascript';
  if (decodedCode.includes('{') && decodedCode.includes('}')) {
    if (decodedCode.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
    if (decodedCode.includes(':')) return 'json';
  }
  if (decodedCode.includes('<') && decodedCode.includes('>') && (decodedCode.includes('</') || decodedCode.includes('/>'))) return 'html';
  
  if (decodedCode.startsWith('$') || decodedCode.startsWith('#')) return 'shell';
  
  return 'text';
}

function highlightSyntax(code, language) {
  const encodeHtmlEntities = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const decodedCode = decodeHtmlEntities(code);

  switch (language) {
    case 'markdown':
      const highlightedMd = decodedCode.replace(
        /(^#{1,6}\s.*$)|(^[*-]\s.*$)|(^>\s.*$)|(`{1,3}[^`\n]+`{1,3})|(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(_.*?_)|(^```[\s\S]*?^```)/gm,
        match => {
          if (/^#{1,6}/.test(match)) return `<span class="heading">${encodeHtmlEntities(match)}</span>`;
          if (/^[*-]\s+/.test(match)) return `<span class="list-item">${encodeHtmlEntities(match)}</span>`;
          if (/^>\s+/.test(match)) return `<span class="blockquote">${encodeHtmlEntities(match)}</span>`;
          if (/`{1,3}[^`\n]+`{1,3}/.test(match)) return `<span class="inline-code">${encodeHtmlEntities(match)}</span>`;
          if (/\[.*?\]\(.*?\)/.test(match)) return `<span class="link">${encodeHtmlEntities(match)}</span>`;
          if (/\*\*.*?\*\*/.test(match)) return `<span class="bold">${encodeHtmlEntities(match)}</span>`;
          if (/_.*?_/.test(match)) return `<span class="italic">${encodeHtmlEntities(match)}</span>`;
          if (/^```[\s\S]*?^```/.test(match)) return `<span class="code-block">${encodeHtmlEntities(match)}</span>`;
          return encodeHtmlEntities(match);
        }
      );
      return highlightedMd;
    case 'javascript':
      const highlightedJs = decodedCode.replace(
        /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`|\b(?:function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this|null|undefined|true|false)\b|\b\d+\b|[{}[\],;.])/g,
        match => {
          if (/^\/\//.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
          if (/^\/\*/.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
          if (/^['"`]/.test(match)) return `<span class="string">${encodeHtmlEntities(match)}</span>`;
          if (/^(function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this)$/.test(match)) return `<span class="keyword">${encodeHtmlEntities(match)}</span>`;
          if (/^(null|undefined|true|false)$/.test(match)) return `<span class="boolean">${encodeHtmlEntities(match)}</span>`;
          if (/^\d+$/.test(match)) return `<span class="number">${encodeHtmlEntities(match)}</span>`;
          if (/^[{}[\],;.]$/.test(match)) return `<span class="punctuation">${encodeHtmlEntities(match)}</span>`;
          return encodeHtmlEntities(match);
        }
      );
      return highlightedJs;
    case 'css':
      return decodedCode.replace(
        /(\/\*[\s\S]*?\*\/)|(\b[\w-]+\s*:)|(#[\da-f]{3,6})|(\b\d+(%|px|em|rem|vh|vw)?\b)|([@.]{1}[\w-]+)/gi,
        match => {
          if (/^\/\*/.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
          if (/:$/.test(match)) return `<span class="property">${encodeHtmlEntities(match)}</span>`;
          if (/^#/.test(match)) return `<span class="value">${encodeHtmlEntities(match)}</span>`;
          if (/^\d/.test(match)) return `<span class="number">${encodeHtmlEntities(match)}</span>`;
          if (/^[@.]/.test(match)) return `<span class="selector">${encodeHtmlEntities(match)}</span>`;
          return encodeHtmlEntities(match);
        }
      );
    default:
      return encodeHtmlEntities(decodedCode);
  }
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

  const returnToTopButton = document.createElement('button');
  returnToTopButton.className = 'showcaser-returntotop';
  returnToTopButton.textContent = 'Return to Top';
  returnToTopButton.style.display = 'none';
  container.appendChild(returnToTopButton);

  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      returnToTopButton.style.display = 'block';
    } else {
      returnToTopButton.style.display = 'none';
    }
  });

  returnToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  const returnToMenuButton = document.createElement('button');
  returnToMenuButton.className = 'showcaser-returntomenu';
  returnToMenuButton.textContent = 'Return to Menu';
  returnToMenuButton.style.display = 'none';
  container.appendChild(returnToMenuButton);

  window.addEventListener('scroll', () => {
    const blockTop = block.getBoundingClientRect().top;
    const blockBottom = block.getBoundingClientRect().bottom;
    if (blockTop < 0 && blockBottom > window.innerHeight) {
      returnToMenuButton.style.display = 'block';
    } else {
      returnToMenuButton.style.display = 'none';
    }
  });

  returnToMenuButton.addEventListener('click', () => {
    block.scrollIntoView({ behavior: 'smooth' });
  });

  try {
    const codeSnippets = [];
    const codeElements = document.querySelectorAll('pre > code');
    
    codeElements.forEach((element, index) => {
      const code = element.textContent;
      
      const lines = code.split('\n');
      const title = lines[0].replace(/\/\/|\/\*|\*\//g, '').trim() || `Code Snippet ${index + 1}`;
      const content = lines.slice(1).join('\n').trim();
      
      if (content) {
        const language = detectLanguage(content);
        const highlightedCode = highlightSyntax(content, language);
        codeSnippets.push({ title, content: highlightedCode, language });
      }
    });

    codeSnippets.forEach((snippet, index) => {
      const titleElement = document.createElement('a');
      titleElement.className = 'showcaser-title';
      titleElement.textContent = snippet.title;
      titleElement.href = '#';
      titleElement.setAttribute('aria-controls', `snippet-${index}`);
      titleElement.addEventListener('click', (e) => {
        e.preventDefault();
        rightPage.innerHTML = `
          <h3 id="snippet-${index}">${snippet.title}</h3>
          <div class="showcaser-code-wrapper">
            <button class="showcaser-copy">Copy ${snippet.language} to clipboard</button>
            <pre class="language-${snippet.language}"><code>${snippet.content}</code></pre>
          </div>
        `;
        document.querySelectorAll('.showcaser-title').forEach((el) => el.classList.remove('active'));
        titleElement.classList.add('active');
        document.getElementById(`snippet-${index}`).focus();

        const copyButton = rightPage.querySelector('.showcaser-copy');
        copyButton.addEventListener('click', () => {
          const codeElement = rightPage.querySelector('pre code');
          const code = codeElement.textContent;
          navigator.clipboard.writeText(code)
            .then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = `Copy ${snippet.language} to clipboard`;
              }, COPY_BUTTON_RESET_DELAY);
            })
            .catch(err => {
              console.error('Error copying content:', err);
            });
        });
      });
      leftPage.appendChild(titleElement);

      if (index === 0) {
        titleElement.click();
      }
    });

    codeElements.forEach((element) => {
      const preElement = element.parentElement;
      if (preElement && preElement.tagName.toLowerCase() === 'pre') {
        preElement.remove();
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

}
