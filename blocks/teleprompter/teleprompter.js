export default async function decorate(block) {
  const content = document.createElement('div');
  content.classList.add('teleprompter-content');
  block.appendChild(content);

  const timer = document.createElement('div');
  timer.classList.add('teleprompter-timer');
  block.appendChild(timer);

  const title = document.createElement('div');
  title.classList.add('teleprompter-title');
  block.insertBefore(title, content);

  let allLines = [];
  let currentLine = 0;
  let isPaused = false;
  let startTime;
  let pausedTime = 0;

  function readContent() {
    allLines = [];
    let h1Found = false;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (block.contains(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H1' && !h1Found) {
            h1Found = true;
            title.textContent = node.textContent.trim();
            return NodeFilter.FILTER_REJECT;
          }
          return node.nodeType === Node.TEXT_NODE && node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim();
      if (text) {
        allLines.push(text);
      }
    }
  }

  function updateDisplay() {
    content.innerHTML = '';
    if (allLines.length === 0) {
      const line = document.createElement('div');
      line.textContent = "No content available.";
      content.appendChild(line);
      return;
    }

    if (isPaused) {
      const pausedMessage = document.createElement('div');
      pausedMessage.textContent = "PAUSED";
      pausedMessage.classList.add('paused-message');
      content.appendChild(pausedMessage);
    }

    // First line (bold)
    const firstLineElement = document.createElement('div');
    firstLineElement.textContent = allLines[currentLine] || '';
    firstLineElement.classList.add('teleprompter-first-line');
    content.appendChild(firstLineElement);

    // Gap
    const gap = document.createElement('div');
    gap.classList.add('teleprompter-gap');
    content.appendChild(gap);

    // Rest of the text (slightly dimmed)
    for (let i = 1; i < 4 && currentLine + i < allLines.length; i += 1) {
      const line = document.createElement('div');
      line.textContent = allLines[currentLine + i] || '';
      line.classList.add('teleprompter-dimmed-line');
      content.appendChild(line);
    }
  }

  function updateTimer() {
    const currentTime = new Date().getTime();
    let elapsedTime = isPaused ? pausedTime : (currentTime - startTime) + pausedTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    requestAnimationFrame(updateTimer);
  }

  function startTeleprompter() {
    readContent();
    block.style.display = 'block';
    block.style.position = 'fixed';
    block.style.top = '50%';
    block.style.left = '50%';
    block.style.transform = 'translate(-50%, -50%)';
    content.style.display = 'block';
    startTime = new Date().getTime();
    isPaused = false;
    pausedTime = 0;
    currentLine = 0;
    updateDisplay();
    updateTimer();
    makeDraggable(block);
    block.tabIndex = -1; // Make the block focusable
    block.focus(); // Set focus on the block
    block.classList.add('focused');
  }

  function stopTeleprompter() {
    block.style.display = 'none';
    isPaused = false;
    currentLine = 0;
    updateDisplay();
  }

  function togglePause() {
    isPaused = !isPaused;
    block.classList.toggle('paused', isPaused);
    if (isPaused) {
      pausedTime += new Date().getTime() - startTime;
    } else {
      startTime = new Date().getTime();
    }
    updateDisplay();
  }

  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
      if (e.target === content) return;
      isDragging = true;
      const rect = element.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      e.preventDefault();
    }

    function drag(e) {
      if (!isDragging) return;
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      element.style.transform = 'none';
    }

    function stopDragging() {
      isDragging = false;
    }
  }

  function handleFocus() {
    block.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      block.focus();
      block.classList.add('focused');
    });

    document.addEventListener('mousedown', (e) => {
      if (!block.contains(e.target)) {
        block.blur();
        block.classList.remove('focused');
      }
    });

    block.tabIndex = -1;
  }

  startTeleprompter();
  handleFocus();

  document.addEventListener('keydown', (e) => {
    if (block.style.display === 'none') return;

    if (e.key === 'Escape') {
      stopTeleprompter();
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePause();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (!isPaused && currentLine < allLines.length - 1) {
        currentLine += 1;
        updateDisplay();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (!isPaused && currentLine > 0) {
        currentLine -= 1;
        updateDisplay();
      }
    }
  });

  block.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      currentLine = Math.min(currentLine + 1, allLines.length - 1);
    } else if (e.deltaY < 0) {
      currentLine = Math.max(currentLine - 1, 0);
    }
    updateDisplay();
  });

  // Add this new function to periodically check and restore focus
  function ensureFocus() {
    if (block.style.display !== 'none' && !block.contains(document.activeElement)) {
      block.focus();
      block.classList.add('focused');
    }
  }

  // Call ensureFocus every second
  setInterval(ensureFocus, 1000);

  // Add event listeners for focus and blur
  block.addEventListener('focus', () => {
    block.classList.add('focused');
  });

  block.addEventListener('blur', () => {
    block.classList.remove('focused');
  });
}