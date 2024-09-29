// Constants for configuration
const BOOK_TITLE = 'Code Showcase';
const ERROR_MESSAGE = 'Error loading content. Please try again.';
const COPY_BUTTON_RESET_DELAY = 2000;
const LONG_DOCUMENT_THRESHOLD = 40;

function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function detectLanguage(code) {
  const decodedCode = decodeHtmlEntities(code);

  // Simple check for Markdown (including title)
  if (decodedCode.trim().startsWith('#')) {
    return 'markdown';
  }

  // Check for JSON (including title)
  const jsonTest = decodedCode.trim();
  if (jsonTest.startsWith('{') || jsonTest.includes('\n{')) {
    return 'json';
  }

  // Rest of the language detection logic (including title)
  if (decodedCode.trim().startsWith('"') || decodedCode.trim().startsWith("'")) {
    return 'text';
  }
  
  if (/^(ls|cd|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(decodedCode)) {
    return 'shell';
  }
  
  if (decodedCode.includes('function') || decodedCode.includes('var') || decodedCode.includes('const')) return 'javascript';
  if (decodedCode.includes('{') && decodedCode.includes('}')) {
    if (decodedCode.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
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
      return decodedCode.replace(
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
    case 'json':
      return decodedCode.replace(
        /(\"(?:\\.|[^\\"])*\")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        (match, string, colon, boolean) => {
          if (string) {
            return colon 
              ? `<span class="json-key">${encodeHtmlEntities(string)}</span>${encodeHtmlEntities(colon)}`
              : `<span class="json-string">${encodeHtmlEntities(string)}</span>`;
          }
          if (boolean) {
            return `<span class="json-boolean">${encodeHtmlEntities(boolean)}</span>`;
          }
          if (/^-?\d/.test(match)) {
            return `<span class="json-number">${encodeHtmlEntities(match)}</span>`;
          }
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

  const toggleButton = document.createElement('button');
  toggleButton.className = 'showcaser-toggle';
  toggleButton.textContent = '<';
  book.appendChild(toggleButton);

  toggleButton.addEventListener('click', () => {
    leftPage.classList.toggle('collapsed');
    toggleButton.classList.toggle('collapsed');
    rightPage.style.width = leftPage.classList.contains('collapsed') ? '100%' : '80%';
    toggleButton.textContent = leftPage.classList.contains('collapsed') ? '>' : '<';
  });

  const rightPage = document.createElement('div');
  rightPage.className = 'showcaser-right-page';
  book.appendChild(rightPage);

  const bookTitle = document.createElement('h2');
  bookTitle.textContent = BOOK_TITLE;
  leftPage.appendChild(bookTitle);

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
      
      if (code.trim()) {
        const language = detectLanguage(code);
        const highlightedCode = highlightSyntax(code, language);
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
        
        // Ensure left page is visible when a snippet is selected
        if (leftPage.classList.contains('collapsed')) {
          leftPage.classList.remove('collapsed');
          toggleButton.classList.remove('collapsed');
          rightPage.style.width = '80%';
          toggleButton.textContent = '<';
        }

        rightPage.innerHTML = `
          <h3 id="snippet-${index}">${snippet.title}</h3>
          <div class="showcaser-code-wrapper">
            <button class="showcaser-copy">Copy ${snippet.language} to clipboard</button>
            <pre class="language-${snippet.language}"><code>${snippet.content}</code></pre>
          </div>
        `;

        const preElement = rightPage.querySelector('pre');
        const lines = snippet.content.split('\n');

        if (lines.length > LONG_DOCUMENT_THRESHOLD) {
          preElement.classList.add('collapsible');
          
          // Create top expand/collapse button
          const topExpandButton = document.createElement('button');
          topExpandButton.className = 'showcaser-expand-collapse top';
          topExpandButton.textContent = 'Expand';
          
          // Create bottom expand/collapse button
          const bottomExpandButton = document.createElement('button');
          bottomExpandButton.className = 'showcaser-expand-collapse bottom';
          bottomExpandButton.textContent = '....';
          
          // Function to toggle expansion
          const toggleExpansion = () => {
            preElement.classList.toggle('expanded');
            const isExpanded = preElement.classList.contains('expanded');
            topExpandButton.textContent = isExpanded ? 'Collapse' : 'Expand';
            bottomExpandButton.textContent = isExpanded ? 'Close' : '....';
          };
          
          // Add click event listeners to both buttons
          topExpandButton.onclick = toggleExpansion;
          bottomExpandButton.onclick = toggleExpansion;
          
          // Add buttons to the wrapper
          const codeWrapper = rightPage.querySelector('.showcaser-code-wrapper');
          codeWrapper.insertBefore(topExpandButton, preElement);
          codeWrapper.appendChild(bottomExpandButton);
        }

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
