export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  const highlightJS = (code) => {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'async', 'await'];
    const specialChars = /[{}()[\]]/g;
    const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;

    return code
      .replace(comments, '<span class="comment">$1</span>')
      .replace(strings, '<span class="string">$&</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="keyword">$1</span>')
      .replace(specialChars, '<span class="special-char">$&</span>');
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

  const formatMarkdown = (content) => {
    // Remove all backticks
    content = content.replace(/`/g, '');
    
    // Convert HTML elements to entities
    return content.replace(/[<>&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        default: return char;
      }
    });
  };

  codeElements.forEach((codeElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    
    const originalContent = codeElement.textContent.trim();
    const firstTwoChars = originalContent.substring(0, 2);
    const firstLine = originalContent.split('\n')[0].trim();

    let fileType = 'Text';
    let displayCode = originalContent;

    if (firstTwoChars === '# ') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-markdown');
      fileType = 'Markdown';
    } else if (originalContent[0] === '"') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-text');
    } else if (firstLine === '//js') {
      displayCode = highlightJS(originalContent.replace('//js\n', ''));
      codeWrapper.classList.add('language-js');
      fileType = 'JS';
    } else if (firstLine === '/* css */') {
      displayCode = highlightCSS(originalContent.replace('/* css */\n', ''));
      codeWrapper.classList.add('language-css');
      fileType = 'CSS';
    }

    copyButton.innerHTML = `📋 <span class="code-expander-copy-text">Copy ${fileType}</span>`;
    copyButton.setAttribute('aria-label', `Copy ${fileType} to clipboard`);
    copyButton.title = `Copy ${fileType} to clipboard`;

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-expander-code';

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
          copyButton.innerHTML = `📋 <span class="code-expander-copy-text">Copy ${fileType}</span>`;
          copyButton.setAttribute('aria-label', `Copy ${fileType} to clipboard`);
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy text: ', err);
      }
    });
  });
}