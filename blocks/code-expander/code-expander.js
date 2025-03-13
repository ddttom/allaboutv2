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
        // Process Python code line by line to handle comments and docstrings properly
        const lines = decodedCode.split('\n');
        let inMultilineComment = false;
        let processedLines = lines.map(line => {
          // Handle single-line comments
          if (line.trim().startsWith('#')) {
            return `<span class="comment">${encodeHtmlEntities(line)}</span>`;
          }
          
          // Check for docstring start/end
          if (line.trim().startsWith('"""') || line.trim().startsWith("'''")) {
            inMultilineComment = !inMultilineComment || 
                                (line.trim().endsWith('"""') && line.trim().startsWith('"""')) || 
                                (line.trim().endsWith("'''") && line.trim().startsWith("'''"));
            return `<span class="comment">${encodeHtmlEntities(line)}</span>`;
          }
          
          // If we're inside a multiline comment
          if (inMultilineComment) {
            // Check if this line ends the multiline comment
            if (line.trim().endsWith('"""') || line.trim().endsWith("'''")) {
              inMultilineComment = false;
            }
            return `<span class="comment">${encodeHtmlEntities(line)}</span>`;
          }
          
          // Process normal code with syntax highlighting
          return line.replace(
            /(\b(?:def|class|import|from|as|if|elif|else|for|while|try|except|finally|with|return|yield|lambda|global|nonlocal|pass|break|continue|raise|assert|del|in|is|not|and|or|async|await|self)\b|@\w+(?:\.[\w.]+)*|\b(?:print|len|range|str|int|float|list|dict|set|tuple|sum|min|max|sorted|map|filter|zip|enumerate|open|type|isinstance|hasattr|getattr|setattr|delattr)\b|\b(?:True|False|None)\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|f(['"])(?:\\.|[^\\])*?\1)/g,
            (match, keyword, decorator, builtin, boolean, number, string, fString) => {
              if (match.startsWith('#')) return `<span class="comment">${encodeHtmlEntities(match)}</span>`;
              if (/^def|^class|^import|^from|^as|^if|^elif|^else|^for|^while|^try|^except|^finally|^with|^return|^yield|^lambda|^global|^nonlocal|^pass|^break|^continue|^raise|^assert|^del|^in|^is|^not|^and|^or|^async|^await|^self\b/.test(match)) 
                return `<span class="keyword">${encodeHtmlEntities(match)}</span>`;
              if (/^True|^False|^None\b/.test(match)) 
                return `<span class="boolean">${encodeHtmlEntities(match)}</span>`;
              if (/^print|^len|^range|^str|^int|^float|^list|^dict|^set|^tuple|^sum|^min|^max|^sorted|^map|^filter|^zip|^enumerate|^open|^type|^isinstance|^hasattr|^getattr|^setattr|^delattr\b/.test(match)) 
                return `<span class="builtin">${encodeHtmlEntities(match)}</span>`;
              if (/^@/.test(match)) 
                return `<span class="decorator">${encodeHtmlEntities(match)}</span>`;
              if (/^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(match)) 
                return `<span class="number">${encodeHtmlEntities(match)}</span>`;
              if (/^f['"]/.test(match)) 
                return `<span class="f-string">${encodeHtmlEntities(match)}</span>`;
              if (/^['"]/.test(match)) 
                return `<span class="string">${encodeHtmlEntities(match)}</span>`;
              return encodeHtmlEntities(match);
            }
          );
        });
        
        return processedLines.join('\n');
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
