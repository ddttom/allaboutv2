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

  const escapeHTML = (html) => {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
    const firstLine = originalContent.split('\n')[0].trim();

    let displayCode = originalContent;
    let fileType = 'code';

    if (firstTwoChars === '# ') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-markdown');
      fileType = 'Markdown';
    } else if (originalContent[0] === '"') {
      displayCode = formatMarkdown(originalContent);
      codeWrapper.classList.add('language-text');
      fileType = 'text';
    } else if (firstLine === '//js') {
      const codeContent = originalContent.split('\n').slice(1).join('\n');
      displayCode = highlightJS(codeContent);
      codeWrapper.classList.add('language-js');
      fileType = 'JavaScript';
    } else if (firstLine === '/* css */') {
      displayCode = highlightCSS(originalContent.replace('/* css */\n', ''));
      codeWrapper.classList.add('language-css');
      fileType = 'CSS';
    } else if (originalContent.trim().startsWith('<!DOCTYPE html>')) {
      displayCode = escapeHTML(originalContent);
      codeWrapper.classList.add('language-html');
      fileType = 'HTML';
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