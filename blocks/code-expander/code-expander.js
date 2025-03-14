// Configuration constants
const LONG_DOCUMENT_THRESHOLD = 40;
const COPY_BUTTON_RESET_DELAY = 2000;
const SCROLL_HINT_TEXT = '<-scroll with arrows->';
const COPY_TEXT = 'Copy';
const COPIED_TEXT = 'Copied!';
const VIEW_RAW_TEXT = 'View Raw';
const VIEW_FORMATTED_TEXT = 'View Formatted';
const DOWNLOAD_TEXT = 'Download';
const EXPAND_TEXT = 'Expand';
const COLLAPSE_TEXT = 'Collapse';
const ELLIPSIS_TEXT = '....';
const CLOSE_TEXT = 'Close';
const FILENAME_PROMPT_TEXT = 'Enter filename (without extension):';
const DOWNLOAD_BUTTON_TEXT = 'Download';
const CANCEL_BUTTON_TEXT = 'Cancel';
const DEFAULT_FILENAME = 'code-snippet';

export default async function decorate(block) {
  const codeElements = document.querySelectorAll('pre code');
  
  function detectLanguage(code) {
      // First priority: Check for shebang line (#!/bin/bash, #!/usr/bin/env bash, etc.)
      const firstLine = code.trim().split('\n')[0];
      if (firstLine.startsWith('#!')) {
        // Check for common shell interpreters
        if (firstLine.includes('/bin/bash') || 
            firstLine.includes('/bin/sh') || 
            firstLine.includes('/usr/bin/env bash') || 
            firstLine.includes('/usr/bin/env sh')) {
          return 'shell';
        }
        // Check for Python interpreters
        if (firstLine.includes('/python') || 
            firstLine.includes('/usr/bin/env python')) {
          return 'python';
        }
        return 'shell'; // Default to shell for any other shebang line
      }
      
      // Check for specific Python import pattern
      if (firstLine.includes('import mlx.core as mx')) {
        return 'python';
      }
      
      if (code.trim().startsWith('"') || code.trim().startsWith("'")) {
        return 'text';
      }
      
      if (/^(ls|cd|python|conda|pip|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(code)) {
        return 'shell';
      }
    
    // Check for Python-specific patterns
    // Look for distinctive Python patterns rather than just 'import'
    if (code.includes('def ') || 
        /\bimport\s+[\w\.]+\s+as\s+\w+/.test(code) || // import X as Y pattern
        /\bfrom\s+[\w\.]+\s+import\s+/.test(code) || // from X import Y pattern
        code.includes('class ') || 
        /\bif\s+__name__\s*==\s*['"]__main__['"]/.test(code)) {
      return 'python';
    }
    
    // Check for JavaScript-specific import patterns to avoid confusion
    if (/\bimport\s+{[^}]*}\s+from\s+['"]/.test(code) || // import { X } from 'Y'
        /\bimport\s+\w+\s+from\s+['"]/.test(code)) { // import X from 'Y'
      return 'javascript';
    }
    
    if (code.includes('function') || code.includes('var') || code.includes('const')) return 'javascript';
    if (code.includes('{') && code.includes('}')) {
      if (code.match(/[a-z-]+\s*:\s*[^;]+;/)) return 'css';
      if (code.includes(':')) return 'json';
    }
    if (code.includes('<') && code.includes('>') && (code.includes('</') || code.includes('/>'))) return 'html';
    
    if (code.match(/^(#{1,6}\s|\*\s|-\s|\d+\.\s|\[.*\]\(.*\))/m)) return 'markdown';
    
    if (code.startsWith('$') || code.startsWith('#')) return 'shell';
    
    return 'text';
  }

  function highlightSyntax(code, language) {
    const encodeHtmlEntities = (text) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const decodedCode = code;

    switch (language) {
      case 'javascript':
        return decodedCode.replace(
          /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"|`(?:\\.|[^\\`])*`|\b(?:function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this|null|undefined|true|false)\b|\b\d+\b|[{}[\],;.])/g,
          match => {
            if (/^\/\//.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
            if (/^\/\*/.test(match)) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
            if (/^['"`]/.test(match)) return `<span class="string">${encodeHtmlEntities(match)}</span>`;
            if (/^(function|var|let|const|if|else|for|while|do|switch|case|break|return|continue|class|new|typeof|instanceof|this)$/.test(match)) return `<span class="keyword">${encodeHtmlEntities(match)}</span>`;
            if (/^(null|undefined|true|false)$/.test(match)) return `<span class="boolean">${encodeHtmlEntities(match)}</span>`;
            if (/^\d+$/.test(match)) return `<span class="number">${encodeHtmlEntities(match)}</span>`;
            if (/^[{}[\],;.]$/.test(match)) return `<span class="punctuation">${encodeHtmlEntities(match)}</span>`;
            return encodeHtmlEntities(match);
          }
        );
      case 'json':
        return decodedCode.replace(
          /(\"(?:\\.|[^\\"])*\")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          (match, string, colon, boolean) => {
            if (string) {
              return colon 
                ? `<span class="json-key">${encodeHtmlEntities(string)}</span>${encodeHtmlEntities(colon)}`
                : `<span class="json-string">${encodeHtmlEntities(string)}</span>`;
            }
            if (boolean) {
              return `<span class="json-boolean">${encodeHtmlEntities(boolean)}</span>`;
            }
            if (/^-?\d/.test(match)) {
              return `<span class="json-number">${encodeHtmlEntities(match)}</span>`;
            }
            return encodeHtmlEntities(match);
          }
        );
      case 'html':
        return decodedCode.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/(".*?")/g, '<span class="string">$1</span>')
                     .replace(/(&lt;[^\s!?/]+)/g, '<span class="tag">$1</span>')
                     .replace(/(&lt;\/[^\s!?/]+)/g, '<span class="tag">$1</span>')
                     .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
      case 'css':
        return decodedCode.replace(
          /([\w-]+\s*:)|(#[\da-f]{3,6})/gi,
          match => {
            if (/:$/.test(match)) return `<span class="property">${encodeHtmlEntities(match)}</span>`;
            return `<span class="value">${encodeHtmlEntities(match)}</span>`;
          }
        );
      case 'markdown':
        return decodedCode.replace(
          /(^#{1,6}\s.*$)|(^[*-]\s.*$)|(^>\s.*$)|(`{1,3}[^`\n]+`{1,3})|(\[.*?\]\(.*?\))/gm,
          match => {
            if (/^#{1,6}/.test(match)) return `<span class="heading">${encodeHtmlEntities(match)}</span>`;
            if (/^[*-]\s+/.test(match)) return `<span class="list-item">${encodeHtmlEntities(match)}</span>`;
            if (/^>\s+/.test(match)) return `<span class="blockquote">${encodeHtmlEntities(match)}</span>`;
            if (/`{1,3}[^`\n]+`{1,3}/.test(match)) return `<span class="code">${encodeHtmlEntities(match)}</span>`;
            if (/\[.*?\]\(.*?\)/.test(match)) return `<span class="link">${encodeHtmlEntities(match)}</span>`;
            return encodeHtmlEntities(match);
          }
        );
        
      case 'text':
        return encodeHtmlEntities(decodedCode);
      default:
        return encodeHtmlEntities(decodedCode);
    }
  }

  // Create line numbers container
  function createLineNumbers(code) {
    const lines = code.split('\n');
    const lineNumbersContainer = document.createElement('div');
    lineNumbersContainer.className = 'code-expander-line-numbers';
    
    lines.forEach(() => {
      const lineNumber = document.createElement('span');
      lineNumber.className = 'code-expander-line-number';
      lineNumbersContainer.appendChild(lineNumber);
    });
    
    return lineNumbersContainer;
  }

  // Create filename prompt modal
  function createFilenamePrompt() {
    const modal = document.createElement('div');
    modal.className = 'code-expander-filename-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'code-expander-filename-modal-content';
    
    const promptText = document.createElement('p');
    promptText.textContent = FILENAME_PROMPT_TEXT;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'code-expander-filename-input';
    input.placeholder = DEFAULT_FILENAME;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'code-expander-filename-buttons';
    
    const modalDownloadButton = document.createElement('button');
    modalDownloadButton.className = 'code-expander-filename-download';
    modalDownloadButton.textContent = DOWNLOAD_BUTTON_TEXT;
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'code-expander-filename-cancel';
    cancelButton.textContent = CANCEL_BUTTON_TEXT;
    
    buttonContainer.appendChild(modalDownloadButton);
    buttonContainer.appendChild(cancelButton);
    
    modalContent.appendChild(promptText);
    modalContent.appendChild(input);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    
    return { modal, input, modalDownloadButton, cancelButton };
  }

  // Function to download code as a file
  function downloadCode(code, language, customFilename = null) {
    // Determine file extension based on language
    let extension = '.txt';
    switch (language) {
      case 'javascript':
        extension = '.js';
        break;
      case 'html':
        extension = '.html';
        break;
      case 'css':
        extension = '.css';
        break;
      case 'json':
        extension = '.json';
        break;
      case 'python':
        extension = '.py';
        break;
      case 'shell':
        extension = '.sh';
        break;
      case 'markdown':
        extension = '.md';
        break;
      default:
        extension = '.txt';
    }
    
    // Use custom filename if provided, otherwise use default
    const filename = customFilename ? `${customFilename}${extension}` : `${DEFAULT_FILENAME}${extension}`;
    
    // Create a blob with the code content
    const blob = new Blob([code], { type: 'text/plain' });
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    
    // Append to the body, click to trigger download, then remove
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 100);
  }

  await Promise.all(Array.from(codeElements).map(async (codeElement, index) => {
    const code = codeElement.textContent;
    const language = detectLanguage(code);  
    
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper line-numbers';
    
    // Move the pre element into the wrapper
    const preElement = codeElement.parentNode;
    preElement.parentNode.insertBefore(wrapper, preElement);
    
    // Create header with buttons
    const header = document.createElement('div');
    header.className = 'code-expander-header';
    
    // Add language indicator
    const languageIndicator = document.createElement('div');
    languageIndicator.className = 'code-expander-language';
    languageIndicator.textContent = language;
    header.appendChild(languageIndicator);
    
    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'code-expander-buttons';
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.textContent = `${COPY_TEXT}`;
    buttonGroup.appendChild(copyButton);
    
    // Add view raw button
    const viewRawButton = document.createElement('button');
    viewRawButton.className = 'code-expander-view-raw';
    viewRawButton.textContent = VIEW_RAW_TEXT;
    buttonGroup.appendChild(viewRawButton);
    
    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'code-expander-download';
    downloadButton.textContent = DOWNLOAD_TEXT;
    buttonGroup.appendChild(downloadButton);
    
    // Add button group to header
    header.appendChild(buttonGroup);
    
    // Add header to wrapper
    wrapper.appendChild(header);
    
    // Add pre element to wrapper
    wrapper.appendChild(preElement);
    
    // Add line numbers
    const lineNumbersContainer = createLineNumbers(code);
    wrapper.appendChild(lineNumbersContainer);
    
    // Add scroll hint
    const scrollHint = document.createElement('div');
    scrollHint.className = 'code-expander-scroll-hint';
    scrollHint.textContent = SCROLL_HINT_TEXT;
    wrapper.appendChild(scrollHint);
    
    // Add raw view container
    const rawViewContainer = document.createElement('div');
    rawViewContainer.className = 'code-expander-raw-view';
    rawViewContainer.textContent = code;
    wrapper.appendChild(rawViewContainer);
    
    // Create filename prompt modal (but don't add to DOM yet)
    const { modal, input, modalDownloadButton, cancelButton } = createFilenamePrompt();
    
    preElement.className = `language-${language}`;
    codeElement.innerHTML = highlightSyntax(code, language);
    
    const lines = code.split('\n');
    if (lines.length > LONG_DOCUMENT_THRESHOLD) {
      preElement.classList.add('collapsible');
      
      // Create top expand/collapse button
      const topExpandButton = document.createElement('button');
      topExpandButton.className = 'code-expander-expand-collapse top';
      topExpandButton.textContent = EXPAND_TEXT;
      
      // Create bottom expand/collapse button
      const bottomExpandButton = document.createElement('button');
      bottomExpandButton.className = 'code-expander-expand-collapse bottom';
      bottomExpandButton.textContent = ELLIPSIS_TEXT;
      
      // Function to toggle expansion
      const toggleExpansion = () => {
        preElement.classList.toggle('expanded');
        const isExpanded = preElement.classList.contains('expanded');
        topExpandButton.textContent = isExpanded ? COLLAPSE_TEXT : EXPAND_TEXT;
        bottomExpandButton.textContent = isExpanded ? CLOSE_TEXT : ELLIPSIS_TEXT;
      };
      
      // Add click event listeners to both buttons
      topExpandButton.onclick = toggleExpansion;
      bottomExpandButton.onclick = toggleExpansion;
      
      // Add buttons to the wrapper
      wrapper.appendChild(topExpandButton);
      wrapper.appendChild(bottomExpandButton);
    }

    // Add event listener for copy button
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = COPIED_TEXT;
        setTimeout(() => {
          copyButton.textContent = COPY_TEXT;
        }, COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error copying content:', err);
      }
    });
    
    // Add event listener for view raw button
    viewRawButton.addEventListener('click', () => {
      const rawView = wrapper.querySelector('.code-expander-raw-view');
      const isRawActive = rawView.classList.toggle('active');
      
      if (isRawActive) {
        viewRawButton.textContent = VIEW_FORMATTED_TEXT;
      } else {
        viewRawButton.textContent = VIEW_RAW_TEXT;
      }
    });
    
    // Add event listener for download button
    downloadButton.addEventListener('click', () => {
      // Add modal to the wrapper
      wrapper.appendChild(modal);
      
      // Show the modal
      modal.style.display = 'flex';
      
      // Focus the input
      input.focus();
      
      // Handle download button click
      modalDownloadButton.onclick = () => {
        const filename = input.value.trim() || DEFAULT_FILENAME;
        downloadCode(code, language, filename);
        modal.style.display = 'none';
        wrapper.removeChild(modal);
      };
      
      // Handle cancel button click
      cancelButton.onclick = () => {
        modal.style.display = 'none';
        wrapper.removeChild(modal);
      };
      
      // Handle Enter key press
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          modalDownloadButton.click();
        } else if (e.key === 'Escape') {
          cancelButton.click();
        }
      });
      
      // Handle click outside modal to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cancelButton.click();
        }
      });
    });
  }));
}
