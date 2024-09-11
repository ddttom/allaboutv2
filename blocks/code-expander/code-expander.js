export default async function decorate(block) {
  const codeElements = document.querySelectorAll('code');

  codeElements.forEach((codeElement) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';

    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.innerHTML = '📋 <span class="code-expander-copy-text">Copy code</span>';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy to clipboard';

    wrapper.appendChild(copyButton);
    wrapper.appendChild(codeElement.cloneNode(true));

    codeElement.parentNode.replaceChild(wrapper, codeElement);

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeElement.textContent);
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