export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  const highlightJS = (code) => {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'async', 'await'];
    const specialChars = /[{}()[\]]/g;
    const strings = /(['"`])((?:\\\1|(?:(?!\1).))*)\1/g;

    const lines = code.split('\n');
    const highlightedLines = lines.map((line, index) => {
      const lineNumber = index + 1;
      const highlightedLine = line
        .replace(strings, (match) => `<span style="color: #a31515;">${match}</span>`)
        .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), (match) => `<span style="color: #0000ff;">${match}</span>`)
        .replace(specialChars, (match) => `<span style="color: #0000ff;">${match}</span>`);
      
      return `<span class="line-number">${lineNumber}</span><span class="line-content">${highlightedLine}</span>`;
    });

    return highlightedLines.join('\n');
  };

  const highlightCSS = (code) => {
    const properties = /([\w-]+)(?=\s*:)/g;
    const values = /:\s*([^;]+)/g;
    const selectors = /([^\s{]+)\s*{/g;
    const comments = /(\/\*[\s\S]*?\*\/)/g;

    return code
      .replace(comments, '<span class="comment">$1</span>')
      .replace(properties, '<span class="property">$1</span>')
      .replace(values, ': <span class="value">$1</span>')
      .replace(selectors, '<span class="selector">$1</span> {');
  };

  const escapeHTML = (html) => {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const highlightJSON = (code) => {
    const jsonSyntax = {
      string: /"(?:\\.|[^"\\])*"/g,
      key: /("(?:\\.|[^"\\])*")\s*:/g,
      number: /\b-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi,
      boolean: /\b(?:true|false|null)\b/gi,
      punctuation: /[{}[\],]/g
    };

    let highlighted = code;

    // Highlight strings first
    highlighted = highlighted.replace(jsonSyntax.string, '<span style="color: #a31515;">$&</span>');

    // Then highlight the rest
    highlighted = highlighted
      .replace(jsonSyntax.key, '<span style="color: #0451a5;">$1</span>:')
      .replace(jsonSyntax.boolean, '<span style="color: #0000ff;">$&</span>')
      .replace(jsonSyntax.punctuation, '<span style="color: #000000;">$&</span>');

    // Highlight numbers only if they're not inside a string
    highlighted = highlighted.replace(/(<span[^>]*>.*?<\/span>)|(\b-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, (match, insideSpan, number) => {
      if (insideSpan) {
        return insideSpan;
      }
      return `<span style="color: #098658;">${number}</span>`;
    });

    return highlighted;
  };

  const highlightTerminal = (code) => {
    const lines = code.split('\n');
    const highlightedLines = lines.map(line => {
      if (line.startsWith('$ ')) {
        // Command line
        return `<span style="color: #4EC9B0;">${line}</span>`;
      } else if (line.trim().startsWith('#')) {
        // Comment
        return `<span style="color: #608B4E;">${line}</span>`;
      } else {
        // Output
        return `<span style="color: #D4D4D4;">${line}</span>`;
      }
    });
    return highlightedLines.join('\n');
  };

  const createExpandCollapseButton = (codeWrapper, displayCode) => {
    const expandCollapseButton = document.createElement('button');
    expandCollapseButton.className = 'code-expander-expand-collapse';
    expandCollapseButton.innerHTML = 'Long Document, click to expand';
    expandCollapseButton.setAttribute('aria-label', 'Expand long code snippet');
    
    let isExpanded = false;
    
    expandCollapseButton.addEventListener('click', () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        codeWrapper.style.maxHeight = 'none';
        expandCollapseButton.innerHTML = 'Collapse';
        expandCollapseButton.setAttribute('aria-label', 'Collapse code snippet');
      } else {
        codeWrapper.style.maxHeight = '300px';
        expandCollapseButton.innerHTML = 'Long Document, click to expand';
        expandCollapseButton.setAttribute('aria-label', 'Expand long code snippet');
      }
    });
    
    return expandCollapseButton;
  };

  codeElements.forEach((codeElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-expander-code';

    const originalContent = codeElement.textContent.trim();
    const firstTwoChars = originalContent.substring(0, 2);
    const firstChar = originalContent[0];
    const firstLine = originalContent.split('\n')[0].trim();
    const firstWord = originalContent.split(/\s+/)[0];

    let displayCode = originalContent;
    let fileType = 'code';

    if (/^(npm|node|cat|ls|cd|mkdir|rm|cp|mv|echo|grep|sed|awk|curl|wget|ssh|git|docker|kubectl)\s/.test(originalContent) || originalContent.trim().startsWith('$ ')) {
      displayCode = highlightTerminal(displayCode);
      codeWrapper.classList.add('language-shell');
      fileType = 'Terminal';
    } else if (['export', 'import', 'async', 'const', 'let', 'function'].includes(firstWord) || firstTwoChars === '//') {
      displayCode = highlightJS(displayCode);
      codeWrapper.classList.add('language-js', 'line-numbers');
      fileType = 'JavaScript';
    } else if (firstChar === '{' || firstChar === '[') {
      displayCode = highlightJSON(displayCode);
      codeWrapper.classList.add('language-json');
      fileType = 'JSON';
    } else if (firstChar === '#') {
      codeWrapper.classList.add('language-markdown');
      fileType = 'Markdown';
    } else if (firstChar === '"') {
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    } else if (firstTwoChars === ',/') {
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    } else if (firstLine === '//js') {
      const codeContent = displayCode.split('\n').slice(1).join('\n');
      displayCode = highlightJS(codeContent);
      codeWrapper.classList.add('language-js');
      fileType = 'JavaScript';
    } else if (firstChar === '.' || firstLine === '/* css */') {
      displayCode = highlightCSS(displayCode);
      codeWrapper.classList.add('language-css');
      fileType = 'CSS';
    } else if (firstChar === '<') {
      displayCode = escapeHTML(displayCode);
      codeWrapper.classList.add('language-html');
      fileType = 'HTML';
    } else {
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    }

    copyButton.innerHTML = `📋 <span class="code-expander-copy-text">Copy ${fileType} ${fileType === 'Terminal' ? 'code' : 'to clipboard'}</span>`;
    copyButton.setAttribute('aria-label', `Copy ${fileType} ${fileType === 'Terminal' ? 'code' : 'to clipboard'}`);
    copyButton.title = `Copy ${fileType} ${fileType === 'Terminal' ? 'code' : 'to clipboard'}`;

    codeWrapper.innerHTML = `<pre>${displayCode}</pre>`;

    wrapper.appendChild(copyButton);
    wrapper.appendChild(codeWrapper);

    const lines = displayCode.split('\n');
    if (lines.length > 80) {
      codeWrapper.style.maxHeight = '300px';
      codeWrapper.style.overflow = 'hidden';
      const expandCollapseButton = createExpandCollapseButton(codeWrapper, displayCode);
      wrapper.insertBefore(expandCollapseButton, codeWrapper);
    }

    codeElement.parentNode.replaceChild(wrapper, codeElement);

    copyButton.addEventListener('click', async () => {
      try {
        let contentToCopy = originalContent;
        
        if (fileType === 'JavaScript') {
          // Remove line numbers before copying
          contentToCopy = contentToCopy.split('\n').map(line => line.trim()).join('\n');
        }
        
        // Remove opening and closing quotes if the content is a string, then trim
        if (fileType === 'text' && contentToCopy.startsWith('"') && contentToCopy.endsWith('"')) {
          contentToCopy = contentToCopy.slice(1, -1).trim();
        } else {
          contentToCopy = contentToCopy.trim();
        }
        
        await navigator.clipboard.writeText(contentToCopy);
        copyButton.innerHTML = '✅ <span class="code-expander-copy-text">Copied!</span>';
        copyButton.setAttribute('aria-label', `${fileType} copied to clipboard`);
        setTimeout(() => {
          copyButton.innerHTML = `📋 <span class="code-expander-copy-text">Copy ${fileType} to clipboard</span>`;
          copyButton.setAttribute('aria-label', `Copy ${fileType} to clipboard`);
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // Add default CSS variables
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --code-expander-button-bg: #f0f0f0;
      --code-expander-button-text: #333;
      --code-expander-button-border: #ccc;
      --code-expander-code-bg: #f8f8f8;
      --code-expander-code-text: #333;
      --code-expander-button-hover-bg: #e0e0e0;
      --code-expander-button-focus-outline: #4d90fe;
    }
    .code-expander-wrapper {
      margin-bottom: 1rem;
    }
    .code-expander-copy,
    .code-expander-expand-collapse {
      background-color: var(--code-expander-button-bg);
      color: var(--code-expander-button-text);
      border: 1px solid var(--code-expander-button-border);
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 4px;
      transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .code-expander-copy:hover,
    .code-expander-expand-collapse:hover {
      background-color: var(--code-expander-button-hover-bg);
    }
    .code-expander-copy:focus,
    .code-expander-expand-collapse:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--code-expander-button-focus-outline);
    }
    .code-expander-expand-collapse {
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .code-expander-code {
      background-color: var(--code-expander-code-bg);
      color: var(--code-expander-code-text);
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      transition: max-height 0.3s ease-out;
    }
    .code-expander-code pre {
      margin: 0;
    }
    .code-expander-code.language-js.line-numbers {
      counter-reset: line;
    }
    .code-expander-code.language-js.line-numbers .line-number {
      counter-increment: line;
      width: 1.5em;
      display: inline-block;
      text-align: right;
      margin-right: 0.5em;
      color: #888;
    }
    .code-expander-code.language-js.line-numbers .line-content {
      display: inline-block;
    }
  `;
  document.head.appendChild(style);
}
