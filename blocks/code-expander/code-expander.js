const LONG_DOCUMENT_THRESHOLD = 40;
const COPY_BUTTON_RESET_DELAY = 2000;

export default async function decorate(block) {
  const codeElements = document.querySelectorAll('pre code');
  
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
    switch (language) {
      case 'javascript':
        return code.replace(
          /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\['\\]|[^'])*'|"(?:\\["\\]|[^"])*"|`(?:\\[`\\]|[^`])*`|\b(?:function|var|const|let|if|else|for|while|return|class|import|export)\b|\b(?:true|false|null|undefined)\b|\b\d+\b)/g,
          (match) => {
            if (/^\/\//.test(match) || /^\/\*/.test(match)) {
              return `<span class="comment">${match}</span>`;
            }
            if (/^['"`]/.test(match)) {
              return `<span class="string">${match}</span>`;
            }
            if (/\b(?:function|var|const|let|if|else|for|while|return|class|import|export)\b/.test(match)) {
              return `<span class="keyword">${match}</span>`;
            }
            if (/\b(?:true|false|null|undefined)\b/.test(match)) {
              return `<span class="boolean">${match}</span>`;
            }
            if (/^\d+$/.test(match)) {
              return `<span class="number">${match}</span>`;
            }
            return match;
          }
        );
      case 'json':
        // Highlight and indent JSON syntax
        try {
          const parsedJson = JSON.parse(code);
          const indentedJson = JSON.stringify(parsedJson, null, 2);
          return indentedJson.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            match => {
              let cls = 'number';
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'key';
                } else {
                  cls = 'string';
                }
              } else if (/true|false/.test(match)) {
                cls = 'boolean';
              } else if (/null/.test(match)) {
                cls = 'null';
              }
              return `<span class="${cls}">${match}</span>`;
            }
          ).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error parsing JSON:', error);
          // If parsing fails, apply basic highlighting without parsing
          return code.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            match => {
              let cls = 'number';
              if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                  cls = 'key';
                } else {
                  cls = 'string';
                }
              } else if (/true|false/.test(match)) {
                cls = 'boolean';
              } else if (/null/.test(match)) {
                cls = 'null';
              }
              return `<span class="${cls}">${match}</span>`;
            }
          );
        }
      case 'html':
        // Highlight HTML syntax
        return code.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   // Highlight strings
                   .replace(/(".*?")/g, '<span class="string">$1</span>')
                   // Highlight opening tags
                   .replace(/(&lt;[^\s!?/]+)/g, '<span class="tag">$1</span>')
                   // Highlight closing tags
                   .replace(/(&lt;\/[^\s!?/]+)/g, '<span class="tag">$1</span>')
                   // Highlight comments
                   .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
      case 'css':
        // Highlight CSS syntax
        return code.replace(
          /([\w-]+\s*:)|(#[\da-f]{3,6})/gi,
          match => {
            // Highlight property names
            if (/:$/.test(match)) return `<span class="property">${match}</span>`;
            // Highlight color values
            return `<span class="value">${match}</span>`;
          }
        );
      case 'markdown':
        // Highlight Markdown syntax
        return code.replace(
          /(^#{1,6}\s.*$)|(^[*-]\s.*$)|(^>\s.*$)|(`{1,3}[^`\n]+`{1,3})|(\[.*?\]\(.*?\))/gm,
          match => {
            // Highlight headings
            if (/^#{1,6}/.test(match)) return `<span class="heading">${match}</span>`;
            // Highlight list items
            if (/^[*-]\s+/.test(match)) return `<span class="list-item">${match}</span>`;
            // Highlight blockquotes
            if (/^>\s+/.test(match)) return `<span class="blockquote">${match}</span>`;
            // Highlight inline code
            if (/`{1,3}[^`\n]+`{1,3}/.test(match)) return `<span class="code">${match}</span>`;
            // Highlight links
            if (/\[.*?\]\(.*?\)/.test(match)) return `<span class="link">${match}</span>`;
            return match;
          }
        );
      case 'text':
        // For text, we'll just escape HTML entities to prevent XSS
        return code.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');
      default:
        // If language is not recognized, return the code without highlighting
        return code;
    }
  }

  await Promise.all(Array.from(codeElements).map(async (codeElement, index) => {
    const code = codeElement.textContent;
    const language = detectLanguage(code);  
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';
    
    // Move the pre element into the wrapper
    const preElement = codeElement.parentNode;
    preElement.parentNode.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);
    
    preElement.className = `language-${language}`;
    codeElement.innerHTML = highlightSyntax(code, language);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.textContent = `Copy ${language === 'shell' ? 'terminal' : language === 'text' ? 'text' : language} to clipboard`;
    wrapper.insertBefore(copyButton, preElement);
    
    const lines = code.split('\n');
    if (lines.length > LONG_DOCUMENT_THRESHOLD) {
      preElement.classList.add('collapsible');
      
      // Create top expand/collapse button
      const topExpandButton = document.createElement('button');
      topExpandButton.className = 'code-expander-expand-collapse top';
      topExpandButton.textContent = 'Expand';
      
      // Create bottom expand/collapse button
      const bottomExpandButton = document.createElement('button');
      bottomExpandButton.className = 'code-expander-expand-collapse bottom';
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
      wrapper.insertBefore(topExpandButton, preElement);
      wrapper.appendChild(bottomExpandButton);
    }

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = `Copy ${language === 'shell' ? 'terminal' : language === 'text' ? 'text' : language} to clipboard`;
        }, COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error copying content:', err);
      }
    });
  }));
}