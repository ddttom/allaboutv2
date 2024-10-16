// Constants for configuration
const SHOWCASER_CONFIG = {
  BOOK_TITLE: 'Code',
  ERROR_MESSAGE: 'Error loading content. Please try again.',
  COPY_BUTTON_RESET_DELAY: 2000,
  LONG_DOCUMENT_THRESHOLD: 40,
};

// Helper function to decode HTML entities in text
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

/**
 * Detects the programming language of the given code snippet
 * @param {string} code - The code snippet to analyze
 * @returns {string} The detected language
 */
function detectLanguage(code) {
  const decodedCode = decodeHtmlEntities(code);

  // Check for HTML (including comments)
  if (decodedCode.trim().startsWith('<!DOCTYPE html>') || decodedCode.trim().startsWith('<!--')) {
    return 'html';
  }

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

/**
 * Applies syntax highlighting to the given code based on the detected language
 * @param {string} code - The code to highlight
 * @param {string} language - The detected language
 * @returns {string} HTML string with syntax highlighting
 */
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
     case "markdown":
       const highlightedMd = decodedCode.replace(
         /(^#{1,6}\s.*$)|(^[*-]\s.*$)|(^>\s.*$)|(`{1,3}[^`\n]+`{1,3})|(\[.*?\]\(.*?\))|(\*\*.*?\*\*)|(_.*?_)|(^```[\s\S]*?^```)/gm,
         (match) => {
           if (/^#{1,6}/.test(match))
             return `<span class="heading">${encodeHtmlEntities(match)}</span>`;
           if (/^[*-]\s+/.test(match))
             return `<span class="list-item">${encodeHtmlEntities(
               match
             )}</span>`;
           if (/^>\s+/.test(match))
             return `<span class="blockquote">${encodeHtmlEntities(
               match
             )}</span>`;
           if (/`{1,3}[^`\n]+`{1,3}/.test(match))
             return `<span class="inline-code">${encodeHtmlEntities(
               match
             )}</span>`;
           if (/\[.*?\]\(.*?\)/.test(match))
             return `<span class="link">${encodeHtmlEntities(match)}</span>`;
           if (/\*\*.*?\*\*/.test(match))
             return `<span class="bold">${encodeHtmlEntities(match)}</span>`;
           if (/_.*?_/.test(match))
             return `<span class="italic">${encodeHtmlEntities(match)}</span>`;
           if (/^```[\s\S]*?^```/.test(match))
             return `<span class="code-block">${encodeHtmlEntities(
               match
             )}</span>`;
           return encodeHtmlEntities(match);
         }
       );
       return highlightedMd;
     case "javascript":
       return decodedCode.replace(
         /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`|\b(?:function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this|null|undefined|true|false)\b|\b\d+\b|[{}[\],;.])/g,
         (match) => {
           if (/^\/\//.test(match))
             return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
           if (/^\/\*/.test(match))
             return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
           if (/^['"`]/.test(match))
             return `<span class="string">${encodeHtmlEntities(match)}</span>`;
           if (
             /^(function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this)$/.test(
               match
             )
           )
             return `<span class="keyword">${encodeHtmlEntities(match)}</span>`;
           if (/^(null|undefined|true|false)$/.test(match))
             return `<span class="boolean">${encodeHtmlEntities(match)}</span>`;
           if (/^\d+$/.test(match))
             return `<span class="number">${encodeHtmlEntities(match)}</span>`;
           if (/^[{}[\],;.]$/.test(match))
             return `<span class="punctuation">${encodeHtmlEntities(
               match
             )}</span>`;
           return encodeHtmlEntities(match);
         }
       );
     case "css":
       return decodedCode.replace(
         /(\/\*[\s\S]*?\*\/)|(\b[\w-]+\s*:)|(#[\da-f]{3,6})|(\b\d+(%|px|em|rem|vh|vw)?\b)|([@.]{1}[\w-]+)/gi,
         (match) => {
           if (/^\/\*/.test(match))
             return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
           if (/:$/.test(match))
             return `<span class="property">${encodeHtmlEntities(
               match
             )}</span>`;
           if (/^#/.test(match))
             return `<span class="value">${encodeHtmlEntities(match)}</span>`;
           if (/^\d/.test(match))
             return `<span class="number">${encodeHtmlEntities(match)}</span>`;
           if (/^[@.]/.test(match))
             return `<span class="selector">${encodeHtmlEntities(
               match
             )}</span>`;
           return encodeHtmlEntities(match);
         }
       );
     case "json":
       return decodedCode.replace(
         /(\"(?:\\.|[^\\"])*\")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
         (match, string, colon, boolean) => {
           if (string) {
             return colon
               ? `<span class="json-key">${encodeHtmlEntities(
                   string
                 )}</span>${encodeHtmlEntities(colon)}`
               : `<span class="json-string">${encodeHtmlEntities(
                   string
                 )}</span>`;
           }
           if (boolean) {
             return `<span class="json-boolean">${encodeHtmlEntities(
               boolean
             )}</span>`;
           }
           if (/^-?\d/.test(match)) {
             return `<span class="json-number">${encodeHtmlEntities(
               match
             )}</span>`;
           }
           return encodeHtmlEntities(match);
         }
       );
     case "html":
       return decodedCode.replace(/(&lt;[^&]*&gt;)|(&lt;!--[\s\S]*?--&gt;)/g, match => {
         if (match.startsWith('&lt;!--')) {
           return `<span class="comment">${match}</span>`;
         }
         return `<span class="tag">${match}</span>`;
       });
     default:
       return encodeHtmlEntities(decodedCode);
   }
}

/**
 * Main function to decorate the Showcaser block
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // Create container and book structure
  const container = document.createElement('div');
  container.className = 'showcaser-container';
  block.appendChild(container);

  const book = document.createElement('div');
  book.className = 'showcaser-book';
  container.appendChild(book);

  const leftPage = document.createElement('div');
  leftPage.className = 'showcaser-left-page';
  leftPage.setAttribute('role', 'navigation');
  leftPage.setAttribute('aria-label', 'Code snippets navigation');
  book.appendChild(leftPage);

  // Function to scroll back to the top of the block, accounting for header height
  const scrollToTop = () => {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const blockTop = block.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // 20px extra padding
    window.scrollTo({
      top: blockTop,
      behavior: 'smooth'
    });
  };

  // Function to handle return to menu action
  const returnToMenu = () => {
    scrollToTop();
  };

  // Create and set up toggle button for collapsing left page
  const toggleButton = document.createElement('button');
  toggleButton.className = 'showcaser-toggle';
  toggleButton.textContent = '<';
  toggleButton.setAttribute('aria-label', 'Toggle navigation panel');
  toggleButton.setAttribute('aria-expanded', 'true');
  book.appendChild(toggleButton);

  // Modify the toggle button click event
  toggleButton.addEventListener('click', () => {
    leftPage.classList.toggle('collapsed');
    toggleButton.classList.toggle('collapsed');
    toggleButton.textContent = leftPage.classList.contains('collapsed') ? '>' : '<';
    toggleButton.setAttribute('aria-expanded', !leftPage.classList.contains('collapsed'));
    
    if (leftPage.classList.contains('collapsed')) {
      returnToMenu();
    }
  });

  const rightPage = document.createElement('div');
  rightPage.className = 'showcaser-right-page';
  rightPage.setAttribute('role', 'region');
  rightPage.setAttribute('aria-live', 'polite');
  book.appendChild(rightPage);

  const bookTitle = document.createElement('h2');
  bookTitle.textContent = SHOWCASER_CONFIG.BOOK_TITLE;
  leftPage.appendChild(bookTitle);

  // Create "Return to Menu" button and set up scroll behavior
  const returnToMenuButton = document.createElement('button');
  returnToMenuButton.className = 'showcaser-returntomenu';
  returnToMenuButton.textContent = 'Return to Menu';
  returnToMenuButton.style.display = 'none';
  container.appendChild(returnToMenuButton);

  // Show/hide "Return to Menu" button based on scroll position
  window.addEventListener('scroll', () => {
    const blockTop = block.getBoundingClientRect().top;
    const blockBottom = block.getBoundingClientRect().bottom;
    if (blockTop < 0 && blockBottom > window.innerHeight) {
      returnToMenuButton.style.display = 'block';
    } else {
      returnToMenuButton.style.display = 'none';
    }
  });

  // Modify the "Return to Menu" button click event
  returnToMenuButton.addEventListener('click', returnToMenu);

  // Check for compact variation
  if (block.classList.contains('compact')) {
    container.classList.add('compact');
  }

  try {
    // Collect and process code snippets from the page
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

    // Create navigation and content for each code snippet
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

        // Render the selected code snippet
        const h3 = document.createElement('h3');
        h3.id = `snippet-${index}`;
        h3.textContent = snippet.title;

        const codeWrapper = document.createElement('div');
        codeWrapper.className = 'showcaser-code-wrapper';

        const copyButton = document.createElement('button');
        copyButton.className = 'showcaser-copy';
        copyButton.textContent = `Copy ${snippet.language} to clipboard`;

        const pre = document.createElement('pre');
        pre.className = `language-${snippet.language}`;

        const code = document.createElement('code');
        code.innerHTML = snippet.content;

        pre.appendChild(code);
        codeWrapper.appendChild(copyButton);
        codeWrapper.appendChild(pre);

        rightPage.innerHTML = '';
        rightPage.appendChild(h3);
        rightPage.appendChild(codeWrapper);

        // Set up copy to clipboard functionality
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(code.textContent)
            .then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = `Copy ${snippet.language} to clipboard`;
              }, SHOWCASER_CONFIG.COPY_BUTTON_RESET_DELAY);
            })
            .catch(err => {
              console.error('Error copying content:', err);
            });
        });

        // Add expand/collapse functionality for long code snippets
        if (snippet.content.split('\n').length > SHOWCASER_CONFIG.LONG_DOCUMENT_THRESHOLD) {
          pre.classList.add('collapsible');
          
          const topExpandButton = document.createElement('button');
          topExpandButton.className = 'showcaser-expand-collapse top';
          topExpandButton.textContent = 'Expand';
          
          const bottomExpandButton = document.createElement('button');
          bottomExpandButton.className = 'showcaser-expand-collapse bottom';
          bottomExpandButton.textContent = '....';
          
          const toggleExpansion = () => {
            pre.classList.toggle('expanded');
            const isExpanded = pre.classList.contains('expanded');
            topExpandButton.textContent = isExpanded ? 'Collapse' : 'Expand';
            bottomExpandButton.textContent = isExpanded ? 'Close' : '....';
          };
          
          topExpandButton.onclick = toggleExpansion;
          bottomExpandButton.onclick = toggleExpansion;
          
          codeWrapper.insertBefore(topExpandButton, pre);
          codeWrapper.appendChild(bottomExpandButton);
        }
      });
      leftPage.appendChild(titleElement);

      // Automatically display the first snippet
      if (index === 0) {
        titleElement.click();
      }
    });

    // Hide original code elements instead of removing them
    codeElements.forEach((element) => {
      const preElement = element.parentElement;
      if (preElement && preElement.tagName.toLowerCase() === 'pre') {
        preElement.style.display = 'none';
        preElement.classList.add('showcaser-original-code');
      }
    });

    // Render the code snippets in the showcaser
    codeSnippets.forEach((snippet, index) => {
      const snippetContainer = document.createElement('div');
      snippetContainer.className = 'showcaser-snippet';
      snippetContainer.innerHTML = `
        <h3>${snippet.title}</h3>
        <pre><code class="language-${snippet.language}">${snippet.content}</code></pre>
      `;
      rightPage.appendChild(snippetContainer);

      // Hide all snippets except the first one
      if (index !== 0) {
        snippetContainer.style.display = 'none';
      }
    });

    // Add click event to title elements to show corresponding snippet
    const titleElements = leftPage.querySelectorAll('.showcaser-title');
    titleElements.forEach((titleElement, index) => {
      titleElement.addEventListener('click', (e) => {
        e.preventDefault();
        const snippets = rightPage.querySelectorAll('.showcaser-snippet');
        snippets.forEach((snippet, i) => {
          snippet.style.display = i === index ? 'block' : 'none';
        });
      });
    });

  } catch (error) {
    // Handle errors and display error message
    console.error('Showcaser Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'showcaser-error';
    errorElement.textContent = SHOWCASER_CONFIG.ERROR_MESSAGE;
    container.appendChild(errorElement);
  }

  // Mark the block as initialized
  block.classList.add('showcaser--initialized');
}
