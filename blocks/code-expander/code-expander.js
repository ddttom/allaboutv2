// Configuration constants
const CODE_EXPANDER_CONFIG = {
  LONG_DOCUMENT_THRESHOLD: 40,
  COPY_BUTTON_RESET_DELAY: 2000,
  SCROLL_HINT_TEXT: '<-scroll with arrows->',
  COPY_TEXT: 'Copy',
  COPIED_TEXT: 'Copied!',
  VIEW_RAW_TEXT: 'View Raw',
  VIEW_FORMATTED_TEXT: 'View Formatted',
  DOWNLOAD_TEXT: 'Download',
  EXPAND_TEXT: 'Expand',
  COLLAPSE_TEXT: 'Collapse',
  CLOSE_TEXT: 'Close',
  FILENAME_PROMPT_TEXT: 'Enter filename (without extension):',
  DOWNLOAD_BUTTON_TEXT: 'Download',
  CANCEL_BUTTON_TEXT: 'Cancel',
  DEFAULT_FILENAME: 'code-snippet',
  INFO_TOOLTIP: {
    TITLE: 'Code Expander Controls',
    EXPAND: 'Expand/Collapse: Toggle between collapsed and expanded view for long code blocks',
    COPY: 'Copy: Copy the code to clipboard',
    VIEW_RAW: 'View Raw/Formatted: Toggle between raw text and formatted code view',
    DOWNLOAD: 'Download: Save the code as a file with appropriate extension'
  }
};

export default async function decorate(block) {
  const codeElements = document.querySelectorAll('pre code');
  
  /**
   * Detects the programming language of the provided code
   * Uses a series of heuristics to determine the most likely language
   * @param {string} code - The code to analyze
   * @returns {string} - The detected language
   */
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
      
      // Check for common Python import patterns
      if (firstLine.startsWith('import ')) {
        return 'python';
      }
      
      // Check for specific Python import patterns
      if (firstLine.includes('import os') || 
          firstLine.includes('import sys') || 
          firstLine.includes('import numpy') || 
          firstLine.includes('import pandas') || 
          firstLine.includes('import matplotlib') || 
          firstLine.includes('import tensorflow') || 
          firstLine.includes('import torch') || 
          firstLine.includes('import mlx.core as mx')) {
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

  /**
   * Applies syntax highlighting to code based on the detected language
   * @param {string} code - The code to highlight
   * @param {string} language - The detected programming language
   * @returns {string} - HTML with syntax highlighting applied
   */
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

  /**
   * Creates a modal dialog for entering a custom filename
   * @returns {Object} - The modal elements
   */
  function createFilenamePrompt() {
    const modal = document.createElement('div');
    modal.className = 'code-expander-filename-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'code-expander-filename-modal-content';
    
    const promptText = document.createElement('p');
    promptText.textContent = CODE_EXPANDER_CONFIG.FILENAME_PROMPT_TEXT;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'code-expander-filename-input';
    input.placeholder = CODE_EXPANDER_CONFIG.DEFAULT_FILENAME;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'code-expander-filename-buttons';
    
    const modalDownloadButton = document.createElement('button');
    modalDownloadButton.className = 'code-expander-filename-download';
    modalDownloadButton.textContent = CODE_EXPANDER_CONFIG.DOWNLOAD_BUTTON_TEXT;
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'code-expander-filename-cancel';
    cancelButton.textContent = CODE_EXPANDER_CONFIG.CANCEL_BUTTON_TEXT;
    
    buttonContainer.appendChild(modalDownloadButton);
    buttonContainer.appendChild(cancelButton);
    
    modalContent.appendChild(promptText);
    modalContent.appendChild(input);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    
    return { modal, input, modalDownloadButton, cancelButton };
  }

  /**
   * Creates an info tooltip with descriptions of each button
   * @returns {Object} - The tooltip elements
   */
  function createInfoTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'code-expander-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    
    const title = document.createElement('h3');
    title.textContent = CODE_EXPANDER_CONFIG.INFO_TOOLTIP.TITLE;
    tooltip.appendChild(title);
    
    const list = document.createElement('ul');
    
    // Add descriptions for each button - always include all functions
    const descriptions = [
      { key: 'COPY', condition: true },
      { key: 'VIEW_RAW', condition: true },
      { key: 'DOWNLOAD', condition: true },
      { key: 'EXPAND', condition: true }
    ];
    
    descriptions.forEach(({ key, condition }) => {
      if (condition) {
        const item = document.createElement('li');
        item.innerHTML = CODE_EXPANDER_CONFIG.INFO_TOOLTIP[key];
        list.appendChild(item);
      }
    });
    
    tooltip.appendChild(list);
    
    return tooltip;
  }

  /**
   * Downloads code as a file with the specified filename
   * @param {string} code - The code to download
   * @param {string} language - The language of the code
   * @param {string} customFilename - Optional custom filename
   */
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
    const filename = customFilename ? `${customFilename}${extension}` : `${CODE_EXPANDER_CONFIG.DEFAULT_FILENAME}${extension}`;
    
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

  // Process each code element
  await Promise.all(Array.from(codeElements).map(async (codeElement, index) => {
    const code = codeElement.textContent;
    const language = detectLanguage(code);  
    const lines = code.split('\n');
    const isLongDocument = lines.length > CODE_EXPANDER_CONFIG.LONG_DOCUMENT_THRESHOLD;
    
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';
    
    // Move the pre element into the wrapper
    const preElement = codeElement.parentNode;
    preElement.parentNode.insertBefore(wrapper, preElement);
    
    // Create header with buttons
    const header = document.createElement('div');
    header.className = 'code-expander-header';
    
    // Add language indicator
    const languageIndicator = document.createElement('div');
    languageIndicator.className = 'code-expander-language';
    languageIndicator.textContent = language.toUpperCase();
    header.appendChild(languageIndicator);
    
    // Add scroll hint to header
    const scrollHint = document.createElement('div');
    scrollHint.className = 'code-expander-scroll-hint';
    scrollHint.textContent = CODE_EXPANDER_CONFIG.SCROLL_HINT_TEXT;
    header.appendChild(scrollHint);
    
    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'code-expander-buttons';
    
    // Add info button
    const infoButton = document.createElement('button');
    infoButton.className = 'code-expander-info';
    infoButton.innerHTML = '<span aria-hidden="true">i</span>';
    infoButton.setAttribute('aria-label', 'Information about code expander controls');
    buttonGroup.appendChild(infoButton);
    
    // Create tooltip but don't add it to DOM yet
    const tooltip = createInfoTooltip();
    
    // Add expand button to toolbar if it's a long document
    let expandButton = null;
    if (isLongDocument) {
      expandButton = document.createElement('button');
      expandButton.className = 'code-expander-expand-collapse';
      expandButton.textContent = CODE_EXPANDER_CONFIG.EXPAND_TEXT;
      buttonGroup.appendChild(expandButton);
    }
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.textContent = CODE_EXPANDER_CONFIG.COPY_TEXT;
    buttonGroup.appendChild(copyButton);
    
    // Add view raw button
    const viewRawButton = document.createElement('button');
    viewRawButton.className = 'code-expander-view-raw';
    viewRawButton.textContent = CODE_EXPANDER_CONFIG.VIEW_RAW_TEXT;
    buttonGroup.appendChild(viewRawButton);
    
    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'code-expander-download';
    downloadButton.textContent = CODE_EXPANDER_CONFIG.DOWNLOAD_TEXT;
    buttonGroup.appendChild(downloadButton);
    
    // Add button group to header
    header.appendChild(buttonGroup);
    
    // Add header to wrapper
    wrapper.appendChild(header);
    
    // Add pre element to wrapper
    wrapper.appendChild(preElement);
    
    // Add raw view container
    const rawViewContainer = document.createElement('div');
    rawViewContainer.className = 'code-expander-raw-view';
    rawViewContainer.textContent = code;
    wrapper.appendChild(rawViewContainer);
    
    // Create filename prompt modal (but don't add to DOM yet)
    const { modal, input, modalDownloadButton, cancelButton } = createFilenamePrompt();
    
    preElement.className = `language-${language}`;
    codeElement.innerHTML = highlightSyntax(code, language);
    
    if (isLongDocument) {
      preElement.classList.add('collapsible');
      
      // Function to toggle expansion
      const toggleExpansion = () => {
        preElement.classList.toggle('expanded');
        const isExpanded = preElement.classList.contains('expanded');
        expandButton.textContent = isExpanded ? CODE_EXPANDER_CONFIG.COLLAPSE_TEXT : CODE_EXPANDER_CONFIG.EXPAND_TEXT;
      };
      
      // Add click event listener to expand button
      expandButton.onclick = toggleExpansion;
    }

    // Add event listener for info button
    infoButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Add tooltip to wrapper if not already added
      if (!wrapper.contains(tooltip)) {
        wrapper.appendChild(tooltip);
      }
      
      // Toggle tooltip visibility
      const isVisible = tooltip.getAttribute('aria-hidden') === 'false';
      tooltip.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
      tooltip.classList.toggle('active', !isVisible);
      
      // Position the tooltip
      if (!isVisible) {
        const buttonRect = infoButton.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        
        tooltip.style.top = `${buttonRect.bottom - wrapperRect.top + 5}px`;
        tooltip.style.right = `${wrapperRect.right - buttonRect.right}px`;
      }
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
      if (tooltip.classList.contains('active') && !tooltip.contains(e.target) && e.target !== infoButton) {
        tooltip.setAttribute('aria-hidden', 'true');
        tooltip.classList.remove('active');
      }
    });

    // Add event listener for copy button
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = CODE_EXPANDER_CONFIG.COPIED_TEXT;
        setTimeout(() => {
          copyButton.textContent = CODE_EXPANDER_CONFIG.COPY_TEXT;
        }, CODE_EXPANDER_CONFIG.COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error copying content:', err);
      }
    });
    
    // Add event listener for view raw button
    viewRawButton.addEventListener('click', () => {
      const rawView = wrapper.querySelector('.code-expander-raw-view');
      const isRawActive = rawView.classList.toggle('active');
      
      // Always set the button text based on the current state
      viewRawButton.textContent = isRawActive 
        ? CODE_EXPANDER_CONFIG.VIEW_FORMATTED_TEXT 
        : CODE_EXPANDER_CONFIG.VIEW_RAW_TEXT;
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
        const filename = input.value.trim() || CODE_EXPANDER_CONFIG.DEFAULT_FILENAME;
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
