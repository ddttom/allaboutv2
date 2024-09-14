import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.classList.add('teleprompter3-icon');
  teleprompterIcon.innerHTML = '&#128217;';
  document.body.appendChild(teleprompterIcon);

  const teleprompter = document.createElement('div');
  teleprompter.classList.add('teleprompter3');
  teleprompter.style.display = 'none';

  const title = document.createElement('h2');
  const content = document.createElement('div');
  const timer = document.createElement('div');
  timer.classList.add('teleprompter3-timer');

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
    const textNodes = document.evaluate(
      '//text()[normalize-space()]',
      document.body,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null,
    );

    for (let i = 0; i < textNodes.snapshotLength; i += 1) {
      const node = textNodes.snapshotItem(i);
      if (node.parentElement.closest('.teleprompter3') === null) {
        allLines.push(node.textContent.trim());
      }
    }

    const h1 = document.querySelector('h1');
    if (h1) {
      title.textContent = h1.textContent;
    }
  }

  function updateContent() {
    content.innerHTML = '';
    for (let i = 0; i < 4 && currentLineIndex + i < allLines.length; i += 1) {
      const line = document.createElement('p');
      line.textContent = allLines[currentLineIndex + i];
      if (i === 0) {
        line.classList.add('current-line');
      }
      content.appendChild(line);
    }
  }

  function updateTimer() {
    if (!isPaused && startTime) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
      const seconds = (elapsedTime % 60).toString().padStart(2, '0');
      timer.textContent = `${minutes}:${seconds}`;
    }
  }

  function startTeleprompter() {
    teleprompterIcon.style.display = 'none';
    teleprompter.style.display = 'block';
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTeleprompter() {
    teleprompter.style.display = 'none';
    teleprompterIcon.style.display = 'block';
    clearInterval(timerInterval);
    currentLineIndex = 0;
    isPaused = false;
    updateContent();
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      content.classList.add('paused');
    } else {
      content.classList.remove('paused');
    }
  }

  function scroll(direction) {
    if (!isPaused) {
      currentLineIndex += direction;
      if (currentLineIndex < 0) currentLineIndex = 0;
      if (currentLineIndex >= allLines.length - 3) currentLineIndex = allLines.length - 4;
      updateContent();
    }
  }

  teleprompterIcon.addEventListener('click', () => {
    extractContent();
    if (allLines.length > 0) {
      startTeleprompter();
      updateContent();
    } else {
      // eslint-disable-next-line no-alert
      alert('No content available for teleprompter.');
    }
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
        default:
          break;
      }
    }
  });

  let isDragging = false;
  let dragStartX;
  let dragStartY;

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

  teleprompter.addEventListener('wheel', (e) => {
    e.preventDefault();
    scroll(e.deltaY > 0 ? 1 : -1);
  });
}
