// Constants for configuration
const BOOK_TITLE = 'Code Showcase';
const ERROR_MESSAGE = 'Error loading content. Please try again.';
const COPY_BUTTON_RESET_DELAY = 2000;
const SCROLL_THRESHOLD = 100;

// Add this helper function at the top of your file
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

function detectLanguage(code) {
  // Decode HTML entities before checking
  const decodedCode = decodeHtmlEntities(code);

  if (decodedCode.trim().startsWith('"') || decodedCode.trim().startsWith("'")) {
    return 'text';
  }
  
  if (/^(ls|cd|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(decodedCode)) {
    return 'shell';
  }
  
  if (decodedCode.includes('function') || decodedCode.includes('var') || decodedCode.includes('const') || decodedCode.includes('let')) return 'javascript';
  if (decodedCode.includes('{') && decodedCode.includes('}')) {
    if (decodedCode.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
    if (decodedCode.includes(':')) return 'json';
  }
  if (decodedCode.includes('<') && decodedCode.includes('>') && (decodedCode.includes('</') || decodedCode.includes('/>'))) return 'html';
  
  if (decodedCode.match(/^(#{1,6}\s|\*\s|-\s|\d+\.\s|\[.*\]\(.*\))/m)) return 'markdown';
  
  if (decodedCode.startsWith('$') || decodedCode.startsWith('#')) return 'shell';
  
  return 'text';
}

function highlightSyntax(code, language) {
  const decodeHtmlEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Decode HTML entities before processing
  const decodedCode = decodeHtmlEntities(code);
  const highlighted = escapeHtml(decodedCode);

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

  // Add Return to Top button
  const returnToTopButton = document.createElement('button');
  returnToTopButton.className = 'showcaser-returntotop';
  returnToTopButton.textContent = 'Return to Top';
  returnToTopButton.style.display = 'none';
  container.appendChild(returnToTopButton);

  // Add scroll event listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      returnToTopButton.style.display = 'block';
    } else {
      returnToTopButton.style.display = 'none';
    }
  });

  // Add click event listener to Return to Top button
  returnToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  try {
    const codeSnippets = [];

    // Find all pre>code elements in the document
    const codeElements = document.querySelectorAll('pre > code');
    console.log('Showcaser: Found', codeElements.length, 'code elements');

    codeElements.forEach((element, index) => {
      const code = element.textContent;
      console.log(`Showcaser: Processing code snippet ${index + 1}:`, code.substring(0, 50) + '...');
      
      const lines = code.split('\n');
      let title = '';
      
      // Check if the first non-empty line is a comment
      for (let line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('//')) {
          // Single-line comment
          title = trimmedLine.substring(2).trim();
          break;
        } else if (trimmedLine.startsWith('/*')) {
          // Multi-line comment
          const endIndex = trimmedLine.indexOf('*/');
          if (endIndex !== -1) {
            // Single-line multi-line comment
            title = trimmedLine.substring(2, endIndex).trim();
          } else {
            // Multi-line comment spanning multiple lines
            const commentLines = [];
            for (let i = lines.indexOf(line); i < lines.length; i++) {
              const commentLine = lines[i].trim();
              if (commentLine.endsWith('*/')) {
                commentLines.push(commentLine.substring(0, commentLine.length - 2).trim());
                break;
              } else {
                commentLines.push(i === lines.indexOf(line) ? commentLine.substring(2) : commentLine);
              }
            }
            title = commentLines.join(' ').trim();
          }
          break;
        } else if (trimmedLine) {
          // First non-empty line that's not a comment
          title = trimmedLine;
          break;
        }
      }
      
      title = title || `Code Snippet ${index + 1}`;
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
          <div class="showcaser-code-wrapper">
            <button class="showcaser-copy">Copy ${snippet.language} to clipboard</button>
            <pre class="language-${snippet.language}"><code>${snippet.content}</code></pre>
          </div>
        `;
        document.querySelectorAll('.showcaser-title').forEach((el) => el.classList.remove('active'));
        titleElement.classList.add('active');
        document.getElementById(`snippet-${index}`).focus();

        // Add copy to clipboard functionality
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
