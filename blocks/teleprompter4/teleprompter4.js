import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create icon
  const icon = document.createElement('div');
  icon.className = 'teleprompter4-icon';
  icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
      <polyline points="17 2 12 7 7 2"></polyline>
    </svg>
  `;
  document.body.appendChild(icon);

  // Ensure icon is visible
  icon.style.display = 'block';
  icon.style.position = 'fixed';
  icon.style.top = '10px';
  icon.style.left = '10px';
  icon.style.fontSize = '24px';
  icon.style.cursor = 'pointer';
  icon.style.zIndex = '1001';

  // Create teleprompter container
  const teleprompter = document.createElement('div');
  teleprompter.className = 'teleprompter4';
  teleprompter.tabIndex = 0;
  teleprompter.setAttribute('aria-label', 'Teleprompter');

  // Create timer
  const timer = document.createElement('div');
  timer.className = 'teleprompter4-timer';
  teleprompter.appendChild(timer);

  // Create content container
  const content = document.createElement('div');
  content.className = 'teleprompter4-content';
  teleprompter.appendChild(content);

  // Get all text content
  const allLines = [];
  const textNodes = document.evaluate(
    '//text()',
    document.body,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null,
  );

  for (let i = 0; i < textNodes.snapshotLength; i += 1) {
    const node = textNodes.snapshotItem(i);
    if (node.parentNode.closest('.teleprompter4') === null) {
      const text = node.textContent.trim();
      if (text) allLines.push(text);
    }
  }

  let currentLine = 0;
  let startTime;
  let pausedTime = 0;
  let timerInterval;
  let isPaused = false;

  function updateContent() {
    content.innerHTML = '';
    const currentLineElement = document.createElement('div');
    currentLineElement.className = 'current-line';
    currentLineElement.textContent = allLines[currentLine];
    content.appendChild(currentLineElement);

    for (let i = 1; i <= 10; i += 1) {
      if (currentLine + i < allLines.length) {
        const nextLine = document.createElement('div');
        nextLine.textContent = allLines[currentLine + i];
        content.appendChild(nextLine);
      }
    }
  }

  function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime - pausedTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    timer.textContent = formattedTime;
  }

  function startTeleprompter() {
    document.body.removeChild(icon);
    document.body.appendChild(teleprompter);
    document.body.style.overflow = 'hidden';
    updateContent();
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTeleprompter() {
    document.body.removeChild(teleprompter);
    document.body.appendChild(icon);
    document.body.style.overflow = '';
    clearInterval(timerInterval);
    currentLine = 0;
    pausedTime = 0;
    isPaused = false;
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(timerInterval);
      const pausedMessage = document.createElement('div');
      pausedMessage.className = 'paused-message';
      pausedMessage.textContent = 'PAUSED';
      teleprompter.appendChild(pausedMessage);
    } else {
      pausedTime += new Date().getTime() - (startTime + pausedTime);
      timerInterval = setInterval(updateTimer, 1000);
      teleprompter.removeChild(teleprompter.querySelector('.paused-message'));
    }
  }

  function scroll(direction) {
    if (!isPaused) {
      currentLine += direction;
      if (currentLine < 0) currentLine = 0;
      if (currentLine >= allLines.length) currentLine = allLines.length - 1;
      updateContent();
    }
  }

  // Event listeners
  icon.addEventListener('click', startTeleprompter);

  teleprompter.addEventListener('wheel', (e) => {
    e.preventDefault();
    scroll(e.deltaY > 0 ? 1 : -1);
  });

  document.addEventListener('keydown', (e) => {
    if (teleprompter.parentNode) {
      if (e.key === 'Escape') {
        stopTeleprompter();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        scroll(-1);
      } else if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        scroll(1);
      }
    }
  });

  // Draggable functionality
  let isDragging = false;
  let dragStartX, dragStartY;

  teleprompter.addEventListener('mousedown', (e) => {
    if (e.target === teleprompter) {
      isDragging = true;
      dragStartX = e.clientX - teleprompter.offsetLeft;
      dragStartY = e.clientY - teleprompter.offsetTop;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const left = e.clientX - dragStartX;
      const top = e.clientY - dragStartY;
      teleprompter.style.left = `${left}px`;
      teleprompter.style.top = `${top}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Error handling
  if (allLines.length === 0) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'No content available for teleprompter';
    teleprompter.appendChild(errorMessage);
  }
}
