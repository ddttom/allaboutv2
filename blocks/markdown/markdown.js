// Configuration object for the Markdown block
const MARKDOWN_CONFIG = {
  ERROR_MESSAGE: 'Error rendering Markdown content. Please try again.',
  BOOK_TITLE: 'Markdown',
  COPY_BUTTON_RESET_DELAY: 2000, // Delay in milliseconds before resetting the copy button text
};

/**
 * Helper function to decode HTML entities in text
 * This is useful for processing code snippets that may contain encoded characters
 * @param {string} text - The text to decode
 * @returns {string} The decoded text
 */
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

/**
 * Detects the programming language of the given code snippet
 * This function uses a series of heuristics to guess the language
 * @param {string} code - The code snippet to analyze
 * @returns {string} The detected language
 */
function detectLanguage(code) {
  const decodedCode = decodeHtmlEntities(code);

  // Check for HTML
  if (decodedCode.trim().startsWith('<!DOCTYPE html>') || decodedCode.trim().startsWith('<!--')) {
    return 'html';
  }
  // Check for Markdown
  if (decodedCode.trim().startsWith('#')) {
    return 'markdown';
  }
  // Check for JSON
  const jsonTest = decodedCode.trim();
  if (jsonTest.startsWith('{') || jsonTest.includes('\n{')) {
    return 'json';
  }
  // Check for plain text
  if (decodedCode.trim().startsWith('"') || decodedCode.trim().startsWith("'")) {
    return 'text';
  }
  // Check for shell commands
  if (/^(ls|cd|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(decodedCode)) {
    return 'shell';
  }
  // Check for JavaScript
  if (decodedCode.includes('function') || decodedCode.includes('var') || decodedCode.includes('const')) return 'javascript';
  // Check for CSS
  if (decodedCode.includes('{') && decodedCode.includes('}')) {
    if (decodedCode.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
  }
  // Additional check for HTML
  if (decodedCode.includes('<') && decodedCode.includes('>') && (decodedCode.includes('</') || decodedCode.includes('/>'))) return 'html';
  // Additional check for shell
  if (decodedCode.startsWith('$') || decodedCode.startsWith('#')) return 'shell';
  
  // Default to plain text if no specific language is detected
  return 'text';
}

/**
 * Applies syntax highlighting to the given code based on the detected language
 * This function uses regex patterns to identify and wrap different code elements in span tags
 * @param {string} code - The code to highlight
 * @param {string} language - The detected language
 * @returns {string} HTML string with syntax highlighting
 */
function highlightSyntax(code, language) {
  // Helper function to encode HTML entities
  const encodeHtmlEntities = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const decodedCode = decodeHtmlEntities(code);
  const encodedCode = encodeHtmlEntities(decodedCode);

  switch (language) {
    case "html":
      // Highlight HTML tags and comments
      return encodedCode.replace(/(&lt;[^&]*&gt;)|(&lt;!--[\s\S]*?--&gt;)/g, match => {
        if (match.startsWith('&lt;!--')) {
          return `<span class="comment">${match}</span>`;
        }
        return `<span class="tag">${match}</span>`;
      });
    case "javascript":
      // Highlight JavaScript syntax elements
      return encodedCode
        .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
        .replace(/\b(const|let|var|function|if|else|for|while|return)\b/g, '<span class="keyword">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="boolean">$1</span>')
        .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>');
    case "css":
      // Highlight CSS properties, values, and comments
      return encodedCode
        .replace(/([\w-]+)(?=\s*:)/g, '<span class="property">$1</span>')
        .replace(/(:.*?;)/g, '<span class="value">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    case "markdown":
      // Highlight Markdown syntax
      return encodedCode
        .replace(/^(#{1,6})\s+(.*?)$/gm, '<span class="heading">$1</span> <span class="heading-text">$2</span>')
        .replace(/(\*\*|__)(.*?)\1/g, '<span class="bold">$2</span>')
        .replace(/(\*|_)(.*?)\1/g, '<span class="italic">$2</span>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="link">[<span class="link-text">$1</span>](<span class="link-url">$2</span>)</span>')
        .replace(/^(\s*[-+*])\s/gm, '<span class="list-item">$1</span> ')
        .replace(/^(\s*\d+\.)\s/gm, '<span class="list-item">$1</span> ')
        .replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
    default:
      // Return encoded code without highlighting for unsupported languages
      return encodedCode;
  }
}

/**
 * Converts Markdown to HTML
 * This function implements a basic Markdown parser using regex patterns
 * @param {string} markdown - The Markdown content to convert
 * @returns {string} The converted HTML
 */
function convertMarkdownToHtml(markdown) {
  // First, apply syntax highlighting to the entire markdown content
  const highlightedMarkdown = highlightSyntax(markdown, 'markdown');

  return highlightedMarkdown
    // Convert headers
    .replace(/<span class="heading">(#{1,6})<\/span> <span class="heading-text">(.*?)<\/span>/g, (match, hashes, text) => {
      const level = hashes.length;
      return `<h${level}>${text}</h${level}>`;
    })
    // Convert bold and italic text
    .replace(/<span class="bold">(.*?)<\/span>/g, '<strong>$1</strong>')
    .replace(/<span class="italic">(.*?)<\/span>/g, '<em>$1</em>')
    // Convert links
    .replace(/<span class="link">\[<span class="link-text">(.*?)<\/span>\]\(<span class="link-url">(.*?)<\/span>\)<\/span>/g, '<a href="$2">$1</a>')
    // Convert unordered list items
    .replace(/<span class="list-item">(\s*[-+*])<\/span> (.*?)(?=(\n|$))/g, '<ul><li>$2</li></ul>')
    // Convert ordered list items
    .replace(/<span class="list-item">(\s*\d+\.)<\/span> (.*?)(?=(\n|$))/g, '<ol><li>$2</li></ol>')
    // Convert inline code
    .replace(/<span class="inline-code">(.*?)<\/span>/g, '<code>$1</code>')
    // Convert paragraphs
    .replace(/^(?!<[uo]l>|<li>|<h\d>)(.*?)$/gm, '<p>$1</p>')
    // Convert code blocks with language detection and syntax highlighting
    .replace(/^\s*```([a-z]*)\n([\s\S]*?)\n```/gm, (match, lang, code) => {
      const language = lang || detectLanguage(code);
      const highlightedCode = highlightSyntax(code, language);
      return `<pre><code class="language-${language}">${highlightedCode}</code></pre>`;
    });
}

/**
 * Decorates the markdown block
 * This is the main function that processes the Markdown content and renders it as HTML
 * @param {HTMLElement} block - The markdown block element
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'markdown-container';

  try {
    // Convert Markdown content to HTML
    const markdownContent = block.textContent.trim();
    const htmlContent = convertMarkdownToHtml(markdownContent);
    container.innerHTML = htmlContent;

    // Apply syntax highlighting to code blocks and add copy buttons
    container.querySelectorAll('pre code').forEach((codeBlock) => {
      const language = codeBlock.className.replace('language-', '');
      codeBlock.innerHTML = highlightSyntax(codeBlock.textContent, language);

      // Create a wrapper for the code block and copy button
      const codeWrapper = document.createElement('div');
      codeWrapper.className = 'markdown-code-wrapper';
      codeBlock.parentNode.insertBefore(codeWrapper, codeBlock);
      codeWrapper.appendChild(codeBlock);

      // Create and add the copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'markdown-copy';
      copyButton.textContent = `Copy ${language} to clipboard`;
      copyButton.setAttribute('aria-label', `Copy ${language} code to clipboard`);
      codeWrapper.insertBefore(copyButton, codeBlock);

      // Add click event listener to the copy button
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.textContent)
          .then(() => {
            // Update button text and aria-label on successful copy
            copyButton.textContent = 'Copied!';
            copyButton.setAttribute('aria-label', 'Code copied to clipboard');
            // Reset button text and aria-label after a delay
            setTimeout(() => {
              copyButton.textContent = `Copy ${language} to clipboard`;
              copyButton.setAttribute('aria-label', `Copy ${language} code to clipboard`);
            }, MARKDOWN_CONFIG.COPY_BUTTON_RESET_DELAY);
          })
          .catch(err => {
            console.error('Error copying content:', err);
          });
      });
    });

    // Clear the original block content and append the new container
    block.textContent = '';
    block.appendChild(container);
  } catch (error) {
    // Handle errors and display an error message
    // eslint-disable-next-line no-console
    console.error('Markdown Error:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'markdown-error';
    errorElement.textContent = MARKDOWN_CONFIG.ERROR_MESSAGE;
    container.appendChild(errorElement);
  }

  // Mark the block as initialized
  block.classList.add('markdown--initialized');
}
