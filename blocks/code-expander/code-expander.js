export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  const highlightJS = (code) => {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'async', 'await'];
    const specialChars = /[{}()[\]]/g;
    const strings = /(['"`])((?:\\\1|(?:(?!\1).))*)\1/g;

    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    highlighted = highlighted
      .replace(strings, (match) => `<span style="color: #a31515;">${match}</span>`)
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), (match) => `<span style="color: #0000ff;">${match}</span>`)
      .replace(specialChars, (match) => `<span style="color: #0000ff;">${match}</span>`);

    return highlighted;
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
    // HTML encode backticks only if they're not already encoded
    content = content.replace(/`/g, (match) => {
      return match === '&#96;' ? match : '&#96;';
    });
    
    // Convert HTML elements to entities only if they're not already encoded
    return content.replace(/[<>&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return /^&(?:[a-zA-Z]+|#[0-9]+);/.test(content.slice(content.indexOf(char))) ? char : '&amp;';
        default: return char;
      }
    });
  };

  const escapeHTML = (html) => {
    return html
      .replace(/&(?!(?:amp|lt|gt|quot|#39|#96);)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, (match) => {
        return match === '&#96;' ? match : '&#96;';
      });
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

    let displayCode = originalContent;
    let fileType = 'code';

    if (firstChar === '#') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-markdown');
      fileType = 'Markdown';
    } else if (firstChar === '"') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    } else if (firstTwoChars === ',/') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    } else if (firstLine === '//js') {
      const codeContent = originalContent.split('\n').slice(1).join('\n');
      displayCode = highlightJS(codeContent);
      codeWrapper.classList.add('language-js');
      fileType = 'JavaScript';
    } else if (firstChar === '.' || firstLine === '/* css */') {
      displayCode = highlightCSS(originalContent);
      codeWrapper.classList.add('language-css');
      fileType = 'CSS';
    } else if (firstChar === '<') {
      displayCode = escapeHTML(originalContent);
      codeWrapper.classList.add('language-html');
      fileType = 'HTML';
    } else {
      // For any other type of content, use formatMarkdown
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    }

    copyButton.innerHTML = `📋 <span class="code-expander-copy-text">Copy ${fileType} to clipboard</span>`;
    copyButton.setAttribute('aria-label', `Copy ${fileType} to clipboard`);
    copyButton.title = `Copy ${fileType} to clipboard`;

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