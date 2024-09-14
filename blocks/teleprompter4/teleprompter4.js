import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Create teleprompter icon
  const createIcon = () => {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');
    icon.innerHTML = '<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" fill="currentColor"/>';
    icon.style.cssText = 'position: fixed; top: 10px; left: 10px; cursor: pointer; z-index: 1001; background: rgba(0,0,0,0.5); color: white; padding: 5px; border-radius: 5px;';
    icon.setAttribute('aria-label', 'Open Teleprompter');
    icon.setAttribute('tabindex', '0');
    return icon;
  };

  // Create teleprompter container
  const createTeleprompter = () => {
    const teleprompter = document.createElement('div');
    teleprompter.className = 'teleprompter4';
    teleprompter.innerHTML = `
      <div class="teleprompter4-content">
        <div class="teleprompter4-timer">00:00</div>
        <div class="teleprompter4-text"></div>
      </div>
    `;
    teleprompter.style.cssText = 'display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; max-width: 800px; height: 80vh; background: rgba(0,0,0,0.8); color: white; z-index: 1000; overflow-y: auto; padding: 20px; box-sizing: border-box;';
    teleprompter.setAttribute('tabindex', '0');
    return teleprompter;
  };

  // Initialize variables
  let allLines = [];
  let currentLineIndex = 0;
  let isActive = false;
  let isPaused = false;
  let startTime = 0;
  let pausedTime = 0;
  let timerInterval;

  // Create and append icon and teleprompter
  const icon = createIcon();
  const teleprompter = createTeleprompter();
  document.body.appendChild(icon);
  document.body.appendChild(teleprompter);

  // Function to process content
  const processContent = () => {
    const textNodes = document.evaluate(
      '//body//text()[not(ancestor::script) and not(ancestor::style)]',
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    allLines = [];
    for (let i = 0; i < textNodes.snapshotLength; i++) {
      const node = textNodes.snapshotItem(i);
      const text = node.textContent.trim();
      if (text) allLines.push(text);
    }
  };

  // Function to update teleprompter content
  const updateContent = () => {
    const textContainer = teleprompter.querySelector('.teleprompter4-text');
    textContainer.innerHTML = '';
    for (let i = currentLineIndex; i < currentLineIndex + 11 && i < allLines.length; i++) {
      const line = document.createElement('p');
      line.textContent = allLines[i];
      line.style.opacity = i === currentLineIndex ? '1' : '0.7';
      line.style.fontSize = i === currentLineIndex ? '28px' : '24px';
      line.style.fontWeight = i === currentLineIndex ? 'bold' : 'normal';
      textContainer.appendChild(line);
    }
  };

  // Function to update timer
  const updateTimer = () => {
    if (!isActive || isPaused) return;
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime - pausedTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const timerElement = teleprompter.querySelector('.teleprompter4-timer');
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to start teleprompter
  const startTeleprompter = () => {
    isActive = true;
    isPaused = false;
    icon.style.display = 'none';
    teleprompter.style.display = 'block';
    document.body.style.overflow = 'hidden';
    processContent();
    updateContent();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    teleprompter.focus();
  };

  // Function to stop teleprompter
  const stopTeleprompter = () => {
    isActive = false;
    isPaused = false;
    icon.style.display = 'block';
    teleprompter.style.display = 'none';
    document.body.style.overflow = '';
    clearInterval(timerInterval);
    currentLineIndex = 0;
    startTime = 0;
    pausedTime = 0;
  };

  // Function to toggle pause
  const togglePause = () => {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(timerInterval);
      const pauseMessage = document.createElement('div');
      pauseMessage.textContent = 'PAUSED';
      pauseMessage.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px; font-weight: bold;';
      teleprompter.appendChild(pauseMessage);
    } else {
      pausedTime += Date.now() - (startTime + pausedTime);
      timerInterval = setInterval(updateTimer, 1000);
      teleprompter.removeChild(teleprompter.lastChild);
    }
  };

  // Event listeners
  icon.addEventListener('click', startTeleprompter);
  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startTeleprompter();
    }
  });

  teleprompter.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!isPaused) {
      currentLineIndex += e.deltaY > 0 ? 1 : -1;
      currentLineIndex = Math.max(0, Math.min(currentLineIndex, allLines.length - 1));
      updateContent();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!isActive) return;
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        if (!isPaused) {
          currentLineIndex = Math.max(0, currentLineIndex - 1);
          updateContent();
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        if (!isPaused) {
          currentLineIndex = Math.min(allLines.length - 1, currentLineIndex + 1);
          updateContent();
        }
        break;
      case ' ':
        togglePause();
        break;
      case 'Escape':
        stopTeleprompter();
        break;
    }
  });

  // Make teleprompter draggable
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
      teleprompter.style.transform = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Error handling
  if (allLines.length === 0) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'No content available for teleprompter.';
    errorMessage.style.color = 'red';
    teleprompter.querySelector('.teleprompter4-text').appendChild(errorMessage);
  }

  // Process content when the page loads
  window.addEventListener('load', processContent);
}
