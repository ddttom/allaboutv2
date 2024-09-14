import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.innerHTML = '&#128217;';
  teleprompterIcon.classList.add('teleprompter3-icon');
  document.body.appendChild(teleprompterIcon);

  const teleprompter = document.createElement('div');
  teleprompter.classList.add('teleprompter3');
  teleprompter.style.display = 'none';

  const title = document.createElement('h2');
  const content = document.createElement('div');
  const timer = document.createElement('div');

  teleprompter.appendChild(title);
  teleprompter.appendChild(content);
  teleprompter.appendChild(timer);

  block.appendChild(teleprompter);

  let allLines = [];
  let currentLineIndex = 0;
  let isPaused = false;
  let startTime;
  let timerInterval;

  function getAllTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    // eslint-disable-next-line no-cond-assign
    while (node = walker.nextNode()) {
      if (node.parentNode.closest('.teleprompter3') === null) {
        textNodes.push(node);
      }
    }

    return textNodes;
  }

  function processContent() {
    const textNodes = getAllTextNodes();
    allLines = textNodes.map(node => node.textContent.trim()).filter(text => text !== '');

    const h1 = document.querySelector('h1');
    if (h1) {
      title.textContent = h1.textContent;
    }
  }

  function updateDisplay() {
    if (allLines.length === 0) {
      content.textContent = 'No content available for teleprompter.';
      return;
    }

    const currentLine = allLines[currentLineIndex];
    const nextLines = allLines.slice(currentLineIndex + 1, currentLineIndex + 4);

    content.innerHTML = `
      <p class="current-line">${currentLine}</p>
      <div class="next-lines">
        ${nextLines.map(line => `<p>${line}</p>`).join('')}
      </div>
    `;
  }

  function scroll(direction) {
    if (isPaused) return;

    currentLineIndex += direction;
    if (currentLineIndex < 0) currentLineIndex = 0;
    if (currentLineIndex >= allLines.length) currentLineIndex = allLines.length - 1;

    updateDisplay();
  }

  function updateTimer() {
    if (isPaused) return;

    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
  }

  function startTeleprompter() {
    teleprompterIcon.style.display = 'none';
    teleprompter.style.display = 'block';
    processContent();
    updateDisplay();
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTeleprompter() {
    teleprompter.style.display = 'none';
    teleprompterIcon.style.display = 'block';
    clearInterval(timerInterval);
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      content.classList.add('paused');
    } else {
      content.classList.remove('paused');
    }
  }

  teleprompterIcon.addEventListener('click', startTeleprompter);

  teleprompter.addEventListener('wheel', (e) => {
    scroll(e.deltaY > 0 ? 1 : -1);
  });

  document.addEventListener('keydown', (e) => {
    if (teleprompter.style.display === 'none') return;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        scroll(-1);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        scroll(1);
        break;
      case ' ':
        togglePause();
        break;
      case 'Escape':
        stopTeleprompter();
        break;
      default:
        break;
    }
  });

  // Make teleprompter draggable
  let isDragging = false;
  let dragStartX, dragStartY;

  teleprompter.addEventListener('mousedown', (e) => {
    if (e.target === content) return;
    isDragging = true;
    dragStartX = e.clientX - teleprompter.offsetLeft;
    dragStartY = e.clientY - teleprompter.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartX;
    const newY = e.clientY - dragStartY;
    teleprompter.style.left = `${newX}px`;
    teleprompter.style.top = `${newY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Accessibility
  teleprompter.setAttribute('tabindex', '0');
  teleprompterIcon.setAttribute('aria-label', 'Open teleprompter');
}
