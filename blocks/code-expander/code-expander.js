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

    // Basic Markdown formatting
    return content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^\s*[-*+]\s(.*)$/gm, '<li>$1</li>')
      .replace(/<\/li>\s*<li>/g, '</li><li>');
  };

  codeElements.forEach((codeElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.innerHTML = '📋 <span class="code-expander-copy-text">Copy to clipboard</span>';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy to clipboard';

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-expander-code';

    const codeContent = codeElement.textContent.trim();
    const firstTwoChars = codeContent.substring(0, 2);
    const firstLine = codeContent.split('\n')[0].trim();

    let highlightedCode = codeContent;
    if (firstTwoChars === '# ') {
      // If the first characters are "# ", treat as Markdown
      highlightedCode = formatMarkdown(codeContent);
      codeWrapper.classList.add('language-markdown');
    } else if (codeContent[0] === '"') {
      // If the first character is a double quote, treat as plain text
      highlightedCode = codeContent;
      codeWrapper.classList.add('language-text');
    } else if (firstLine === '//js') {
      highlightedCode = highlightJS(codeContent.replace('//js\n', ''));
      codeWrapper.classList.add('language-js');
    } else if (firstLine === '/* css */') {
      highlightedCode = highlightCSS(codeContent.replace('/* css */\n', ''));
      codeWrapper.classList.add('language-css');
    }

    codeWrapper.innerHTML = `<pre>${highlightedCode}</pre>`;

    wrapper.appendChild(copyButton);
    wrapper.appendChild(codeWrapper);

    codeElement.parentNode.replaceChild(wrapper, codeElement);

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeContent);
        copyButton.innerHTML = '✅ <span class="code-expander-copy-text">Copied!</span>';
        copyButton.setAttribute('aria-label', 'Code copied to clipboard');
        setTimeout(() => {
          copyButton.innerHTML = '📋 <span class="code-expander-copy-text">Copy code</span>';
          copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy text: ', err);
      }
    });
  });
}