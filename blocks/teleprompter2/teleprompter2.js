import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const icon = document.createElement('div');
  icon.classList.add('teleprompter2-icon');
  icon.innerHTML = '&#128217;';
  document.body.appendChild(icon);

  const teleprompter = document.createElement('div');
  teleprompter.classList.add('teleprompter2');
  teleprompter.style.display = 'none';

  const title = document.createElement('h2');
  const content = document.createElement('div');
  const timer = document.createElement('div');
  timer.classList.add('teleprompter2-timer');

  teleprompter.appendChild(title);
  teleprompter.appendChild(content);
  teleprompter.appendChild(timer);
  document.body.appendChild(teleprompter);

  let allLines = [];
  let currentLineIndex = 0;
  let isPaused = false;
  let startTime;
  let timerInterval;

  function extractContent() {
    const nodes = document.body.childNodes;
    let foundBlock = false;
    for (const node of nodes) {
      if (node === block) {
        foundBlock = true;
      } else if (foundBlock && node.nodeType === Node.TEXT_NODE) {
        allLines.push(node.textContent.trim());
      } else if (foundBlock && node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'H1' && !title.textContent) {
          title.textContent = node.textContent;
        } else {
          allLines.push(...node.textContent.split('\n').map(line => line.trim()).filter(line => line));
        }
      }
    }
  }

  function updateContent() {
    content.innerHTML = '';
    for (let i = 0; i < 4 && currentLineIndex + i < allLines.length; i++) {
      const line = document.createElement('p');
      line.textContent = allLines[currentLineIndex + i];
      if (i === 0) {
        line.classList.add('current-line');
      }
      content.appendChild(line);
    }
  }

  function updateTimer() {
    if (!isPaused) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      timer.textContent = `${minutes}:${seconds}`;
    }
  }

  function startTeleprompter() {
    teleprompter.style.display = 'block';
    icon.style.display = 'none';
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateContent();
  }

  function stopTeleprompter() {
    teleprompter.style.display = 'none';
    icon.style.display = 'block';
    clearInterval(timerInterval);
    currentLineIndex = 0;
    isPaused = false;
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(timerInterval);
      content.classList.add('paused');
    } else {
      timerInterval = setInterval(updateTimer, 1000);
      content.classList.remove('paused');
    }
  }

  function scroll(direction) {
    if (!isPaused) {
      currentLineIndex = Math.max(0, Math.min(currentLineIndex + direction, allLines.length - 4));
      updateContent();
    }
  }

  icon.addEventListener('click', startTeleprompter);

  teleprompter.addEventListener('wheel', (e) => {
    e.preventDefault();
    scroll(e.deltaY > 0 ? 1 : -1);
  });

  document.addEventListener('keydown', (e) => {
    if (teleprompter.style.display === 'block') {
      switch (e.key) {
        case 'Escape':
          stopTeleprompter();
          break;
        case ' ':
          togglePause();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          scroll(-1);
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          scroll(1);
          break;
      }
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
      teleprompter.style.left = `${e.clientX - dragStartX}px`;
      teleprompter.style.top = `${e.clientY - dragStartY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  extractContent();
  if (allLines.length === 0) {
    // eslint-disable-next-line no-console
    console.error('No content available for teleprompter');
  }
}