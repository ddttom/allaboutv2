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

  codeElements.forEach((codeElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.innerHTML = '📋 <span class="code-expander-copy-text">Copy code to clipboard</span>';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy to clipboard';

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-expander-code';

    const codeContent = codeElement.textContent.trim();
    const firstLine = codeContent.split('\n')[0].trim();

    let highlightedCode = codeContent;
    if (firstLine === '//js') {
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