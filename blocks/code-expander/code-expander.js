export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  const highlightJS = (code) => {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'async', 'await'];
    const specialChars = /[{}()[\]]/g;
    const strings = /(['"`])((?:\\\1|(?:(?!\1).))*)\1/g;

    return code
      .replace(strings, (match) => `<span style="color: #a31515;">${match}</span>`)
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), (match) => `<span style="color: #0000ff;">${match}</span>`)
      .replace(specialChars, (match) => `<span style="color: #0000ff;">${match}</span>`);
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
      codeWrapper.classList.add('language-js');
      fileType = 'JavaScript';
    } else if (firstChar === '{') {
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

    codeElement.parentNode.replaceChild(wrapper, codeElement);

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(originalContent);
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
}
