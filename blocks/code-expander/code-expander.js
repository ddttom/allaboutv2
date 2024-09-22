const LONG_DOCUMENT_THRESHOLD = 80;
const COPY_BUTTON_RESET_DELAY = 2000; // 2 seconds
const KEYWORDS = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'async', 'await'];
const SPECIAL_CHARS_REGEX = /[{}()[\]]/g;
const STRINGS_REGEX = /(['"`])((?:\\\1|(?:(?!\1).))*)\1/g;
const TERMINAL_COMMANDS = /^(npm|node|cat|ls|cd|mkdir|rm|cp|mv|echo|grep|sed|awk|curl|wget|ssh|git|docker|kubectl)\s/;
const JS_KEYWORDS = ['export', 'import', 'async', 'const', 'let', 'function'];

export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  const highlightJS = (code) => {
    const lines = code.split('\n');
    const highlightedLines = lines.map((line, index) => {
      const lineNumber = index + 1;
      const highlightedLine = line
        .replace(STRINGS_REGEX, (match) => `<span class="string">${match}</span>`)
        .replace(new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g'), (match) => `<span class="keyword">${match}</span>`)
        .replace(SPECIAL_CHARS_REGEX, (match) => `<span class="special-char">${match}</span>`);
      
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

    highlighted = highlighted.replace(jsonSyntax.string, '<span class="json-string">$&</span>');
    highlighted = highlighted
      .replace(jsonSyntax.key, '<span class="json-key">$1</span>:')
      .replace(jsonSyntax.boolean, '<span class="json-boolean">$&</span>')
      .replace(jsonSyntax.punctuation, '<span class="json-punctuation">$&</span>');

    highlighted = highlighted.replace(/(<span[^>]*>.*?<\/span>)|(\b-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, (match, insideSpan, number) => {
      if (insideSpan) {
        return insideSpan;
      }
      return `<span class="json-number">${number}</span>`;
    });

    return highlighted;
  };

  const highlightTerminal = (code) => {
    const lines = code.split('\n');
    const highlightedLines = lines.map(line => {
      if (line.startsWith('$ ')) {
        return `<span class="terminal-command">${line}</span>`;
      } else if (line.trim().startsWith('#')) {
        return `<span class="terminal-comment">${line}</span>`;
      } else {
        return `<span class="terminal-output">${line}</span>`;
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

    if (TERMINAL_COMMANDS.test(originalContent) || originalContent.trim().startsWith('$ ')) {
      displayCode = highlightTerminal(displayCode);
      codeWrapper.classList.add('language-shell');
      fileType = 'Terminal';
    } else if (JS_KEYWORDS.includes(firstWord) || firstTwoChars === '//') {
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
    if (lines.length > LONG_DOCUMENT_THRESHOLD) {
      const expandCollapseButton = createExpandCollapseButton(codeWrapper, displayCode);
      wrapper.appendChild(expandCollapseButton);
    } else {
      codeWrapper.style.maxHeight = 'none'; // Ensure short documents are fully visible
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
        }, COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy text: ', err);
      }
    });
  });
}
