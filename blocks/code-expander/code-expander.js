const LONG_DOCUMENT_THRESHOLD = 40;
const COPY_BUTTON_RESET_DELAY = 2000;

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
      
      if (/^(ls|cd|python|pip|pwd|mkdir|rm|cp|mv|cat|echo|grep|sed|awk|curl|wget|ssh|git|npm|yarn|docker|kubectl)\s/.test(code)) {
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
      case 'python':
        // First encode HTML entities
        let encodedCode = encodeHtmlEntities(decodedCode);
        
        // Create a map to track which parts of the code have been processed
        const processedRanges = [];
        
        // Helper function to check if a position is within any processed range
        const isProcessed = (pos) => {
          return processedRanges.some(range => pos >= range.start && pos < range.end);
        };
        
        // Helper function to mark a range as processed
        const markProcessed = (start, end) => {
          processedRanges.push({ start, end });
        };
        
        // Helper function to wrap a substring with a span
        const wrapWithSpan = (str, start, end, className) => {
          const before = str.substring(0, start);
          const content = str.substring(start, end);
          const after = str.substring(end);
          markProcessed(start, end);
          return before + `<span class="${className}">` + content + '</span>' + after;
        };
        
        // First, process comments (both single-line and docstrings)
        // Process single-line comments
        let commentMatch;
        const commentRegex = /(^|\n)(\s*)(#.*)($|\n)/g;
        while ((commentMatch = commentRegex.exec(encodedCode)) !== null) {
          const start = commentMatch.index + commentMatch[1].length + commentMatch[2].length;
          const end = start + commentMatch[3].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "comment");
            // Reset regex to continue from the new position
            commentRegex.lastIndex = end;
          }
        }
        
        // Process triple-quoted docstrings
        let docstringMatch;
        const docstringRegex = /"""[\s\S]*?"""|'''[\s\S]*?'''/g;
        while ((docstringMatch = docstringRegex.exec(encodedCode)) !== null) {
          const start = docstringMatch.index;
          const end = start + docstringMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "comment");
            // Reset regex to continue from the new position
            docstringRegex.lastIndex = end;
          }
        }
        
        // Process string literals
        let stringMatch;
        const stringRegex = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/g;
        while ((stringMatch = stringRegex.exec(encodedCode)) !== null) {
          const start = stringMatch.index;
          const end = start + stringMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "string");
            // Reset regex to continue from the new position
            stringRegex.lastIndex = end;
          }
        }
        
        // Process keywords
        let keywordMatch;
        const keywordRegex = /\b(def|class|import|from|as|if|elif|else|for|while|try|except|finally|with|return|yield|lambda|global|nonlocal|pass|break|continue|raise|assert|del|in|is|not|and|or|async|await|self)\b/g;
        while ((keywordMatch = keywordRegex.exec(encodedCode)) !== null) {
          const start = keywordMatch.index;
          const end = start + keywordMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "keyword");
            // Reset regex to continue from the new position
            keywordRegex.lastIndex = end;
          }
        }
        
        // Process built-ins
        let builtinMatch;
        const builtinRegex = /\b(print|len|range|str|int|float|list|dict|set|tuple|sum|min|max|sorted|map|filter|zip|enumerate|open|type|isinstance|hasattr|getattr|setattr|delattr)\b/g;
        while ((builtinMatch = builtinRegex.exec(encodedCode)) !== null) {
          const start = builtinMatch.index;
          const end = start + builtinMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "builtin");
            // Reset regex to continue from the new position
            builtinRegex.lastIndex = end;
          }
        }
        
        // Process boolean constants
        let booleanMatch;
        const booleanRegex = /\b(True|False|None)\b/g;
        while ((booleanMatch = booleanRegex.exec(encodedCode)) !== null) {
          const start = booleanMatch.index;
          const end = start + booleanMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "boolean");
            // Reset regex to continue from the new position
            booleanRegex.lastIndex = end;
          }
        }
        
        // Process decorators
        let decoratorMatch;
        const decoratorRegex = /@\w+(?:\.[\w.]+)*/g;
        while ((decoratorMatch = decoratorRegex.exec(encodedCode)) !== null) {
          const start = decoratorMatch.index;
          const end = start + decoratorMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "decorator");
            // Reset regex to continue from the new position
            decoratorRegex.lastIndex = end;
          }
        }
        
        // Process numbers
        let numberMatch;
        const numberRegex = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;
        while ((numberMatch = numberRegex.exec(encodedCode)) !== null) {
          const start = numberMatch.index;
          const end = start + numberMatch[0].length;
          if (!isProcessed(start)) {
            encodedCode = wrapWithSpan(encodedCode, start, end, "number");
            // Reset regex to continue from the new position
            numberRegex.lastIndex = end;
          }
        }
        
        return encodedCode;
        
      case 'text':
        return encodeHtmlEntities(decodedCode);
      default:
        return encodeHtmlEntities(decodedCode);
    }
  }

  await Promise.all(Array.from(codeElements).map(async (codeElement, index) => {
    const code = codeElement.textContent;
    const language = detectLanguage(code);  
    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-expander-wrapper';
    
    // Move the pre element into the wrapper
    const preElement = codeElement.parentNode;
    preElement.parentNode.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);
    
    // Add scroll hint
    const scrollHint = document.createElement('div');
    scrollHint.className = 'code-expander-scroll-hint';
    scrollHint.textContent = '<-scroll with arrows->';
    scrollHint.style.position = 'absolute';
    scrollHint.style.bottom = '5px';
    scrollHint.style.right = '10px';
    scrollHint.style.fontSize = '12px';
    scrollHint.style.color = '#888';
    scrollHint.style.pointerEvents = 'none';
    scrollHint.style.userSelect = 'none';
    scrollHint.style.zIndex = '1';
    wrapper.style.position = 'relative';
    wrapper.appendChild(scrollHint);
    
    preElement.className = `language-${language}`;
    codeElement.innerHTML = highlightSyntax(code, language);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'code-expander-copy';
    copyButton.textContent = `Copy ${language === 'shell' ? 'terminal' : language === 'text' ? 'text' : language} to clipboard`;
    wrapper.insertBefore(copyButton, preElement);
    
    const lines = code.split('\n');
    if (lines.length > LONG_DOCUMENT_THRESHOLD) {
      preElement.classList.add('collapsible');
      
      // Create top expand/collapse button
      const topExpandButton = document.createElement('button');
      topExpandButton.className = 'code-expander-expand-collapse top';
      topExpandButton.textContent = 'Expand';
      
      // Create bottom expand/collapse button
      const bottomExpandButton = document.createElement('button');
      bottomExpandButton.className = 'code-expander-expand-collapse bottom';
      bottomExpandButton.textContent = '....';
      
      // Function to toggle expansion
      const toggleExpansion = () => {
        preElement.classList.toggle('expanded');
        const isExpanded = preElement.classList.contains('expanded');
        topExpandButton.textContent = isExpanded ? 'Collapse' : 'Expand';
        bottomExpandButton.textContent = isExpanded ? 'Close' : '....';
      };
      
      // Add click event listeners to both buttons
      topExpandButton.onclick = toggleExpansion;
      bottomExpandButton.onclick = toggleExpansion;
      
      // Add buttons to the wrapper
      wrapper.insertBefore(topExpandButton, preElement);
      wrapper.appendChild(bottomExpandButton);
    }

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = `Copy ${language === 'shell' ? 'terminal' : language === 'text' ? 'text' : language} to clipboard`;
        }, COPY_BUTTON_RESET_DELAY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error copying content:', err);
      }
    });
  }));
}
