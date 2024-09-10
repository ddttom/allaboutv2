export default function decorate(block) {
  // Clear any existing content in the block
  block.innerHTML = '';

  // Create a wrapper for the teleprompter
  const wrapper = document.createElement('div');
  wrapper.classList.add('teleprompter2-wrapper');
  block.appendChild(wrapper);

  // Create the icon
  const icon = document.createElement('div');
  icon.classList.add('teleprompter2-icon');
  icon.textContent = '🎥';
  wrapper.appendChild(icon);

  // Create the teleprompter panel
  const teleprompter = document.createElement('div');
  teleprompter.classList.add('teleprompter2-panel');
  teleprompter.style.display = 'none'; // Hide it by default
  wrapper.appendChild(teleprompter);

  // Extract content from the main content area of the page
  const mainContent = document.querySelector('main');
  const content = extractContent(mainContent);

  let currentIndex = 0;
  let autoScrollInterval;

  function updateTeleprompterContent() {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('teleprompter2-content');
    
    const totalLines = 9;
    const middleLineIndex = Math.floor(totalLines / 2);
    
    for (let i = 0; i < totalLines; i++) {
      const contentIndex = currentIndex - middleLineIndex + i;
      if (contentIndex >= 0 && contentIndex < content.length) {
        const text = content[contentIndex];
        if (text) {
          const p = document.createElement('p');
          p.textContent = text; // Remove extra spaces here
          if (i === middleLineIndex) p.classList.add('current-line');
          if (text === "***END***") {
            p.classList.add('end-phrase');
          }
          contentDiv.appendChild(p);
        }
      } else {
        // Add empty paragraph for spacing if no content
        const p = document.createElement('p');
        p.innerHTML = '&nbsp;';
        contentDiv.appendChild(p);
      }
    }
    
    teleprompter.innerHTML = '';
    teleprompter.appendChild(contentDiv);
    
    // Position the content
    const lineHeight = 28; // Approximate line height
    contentDiv.style.transform = `translateY(${-middleLineIndex * lineHeight}px)`;
  }

  function scroll(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < content.length) {
      currentIndex = newIndex;
      updateTeleprompterContent();
    }
    // Stop auto-scroll if we've reached the end
    if (newIndex === content.length - 1 && autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  function toggleAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    } else {
      autoScrollInterval = setInterval(() => {
        if (currentIndex < content.length - 1) {
          scroll(1);
        } else {
          clearInterval(autoScrollInterval);
          autoScrollInterval = null;
        }
      }, 3000); // Scroll every 3 seconds
    }
  }

  function showTeleprompter() {
    teleprompter.style.display = 'block';
    icon.style.display = 'none';
    updateTeleprompterContent();
  }

  function hideTeleprompter() {
    teleprompter.style.display = 'none';
    icon.style.display = 'block';
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Event listeners
  document.addEventListener('keydown', (event) => {
    if (teleprompter.style.display === 'block') {
      event.preventDefault(); // Prevent default scrolling behavior
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          scroll(1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          scroll(-1);
          break;
        case ' ':
          toggleAutoScroll();
          break;
        case 'Escape':
          hideTeleprompter();
          break;
      }
    }
  });

  teleprompter.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scrolling behavior
    scroll(event.deltaY > 0 ? 1 : -1);
  });

  icon.addEventListener('click', () => {
    if (teleprompter.style.display === 'none') {
      showTeleprompter();
    } else {
      hideTeleprompter();
    }
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target) && teleprompter.style.display === 'block') {
      hideTeleprompter();
    }
  });

  // Initialize the teleprompter
  updateTeleprompterContent();
  hideTeleprompter(); // Start with the teleprompter hidden
}

function extractContent(startNode) {
  const content = [];
  let node = startNode;
  while (node) {
    if (node.tagName === 'H1' || node.tagName === 'H2' || node.tagName === 'P') {
      const text = node.textContent.trim();
      if (text) {
        // Split the text into words, ensuring spaces between them
        const words = text.split(/\s+/);
        let sentence = '';
        words.forEach((word, index) => {
          // Split words that are incorrectly joined
          const splitWords = word.replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/);
          splitWords.forEach((splitWord, splitIndex) => {
            // Add space before the word if it's not the first word
            if (index > 0 || splitIndex > 0) {
              sentence += ' ';
            }
            sentence += splitWord;
          });
          // Add space after punctuation
          if (/[.!?,;:]$/.test(word)) {
            sentence += ' ';
          }
          if (/[.!?]$/.test(word)) {
            content.push(sentence.trim().replace(/\s+/g, ' ')); // Remove multiple spaces
            sentence = '';
          }
        });
        if (sentence.trim()) {
          content.push(sentence.trim().replace(/\s+/g, ' ')); // Remove multiple spaces
        }
      }
    } else if (node.childNodes && node.childNodes.length > 0) {
      // Recursively extract content from child nodes
      content.push(...extractContent(node.firstElementChild));
    }
    node = node.nextElementSibling;
  }
  
  return content;
}