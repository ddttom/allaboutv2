import { createOptimizedPicture } from '../../scripts/aem.js';

const teleprompterSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- SVG content as provided -->
</svg>`;

const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <!-- SVG content as provided -->
</svg>`;

function createSVGElement(svgString) {
  const div = document.createElement('div');
  div.innerHTML = svgString.trim();
  return div.firstChild;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('teleprompter-container');

  const teleprompterIcon = createSVGElement(teleprompterSVG);
  teleprompterIcon.classList.add('teleprompter-icon');
  container.appendChild(teleprompterIcon);

  const stopIcon = createSVGElement(stopSVG);
  stopIcon.classList.add('stop-icon', 'hidden');
  container.appendChild(stopIcon);

  const timerDisplay = document.createElement('div');
  timerDisplay.classList.add('timer-display', 'hidden');
  container.appendChild(timerDisplay);

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'hidden');
  container.appendChild(textContainer);

  block.appendChild(container);

  const lines = Array.from(document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
    .map((el) => el.textContent.trim())
    .filter((line) => line.length > 0);

  let isActive = false;
  let isPaused = false;
  let currentLineIndex = 0;
  let timerInterval;
  let seconds = 0;

  function updateTimer() {
    timerDisplay.textContent = formatTime(seconds);
    seconds += 1;
  }

  function startTeleprompter() {
    isActive = true;
    isPaused = false;
    teleprompterIcon.classList.add('hidden');
    stopIcon.classList.remove('hidden');
    timerDisplay.classList.remove('hidden');
    textContainer.classList.remove('hidden');
    document.body.style.backgroundColor = 'black';
    timerInterval = setInterval(updateTimer, 1000);
    showLines();
  }

  function stopTeleprompter() {
    isActive = false;
    isPaused = false;
    teleprompterIcon.classList.remove('hidden');
    stopIcon.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    textContainer.classList.add('hidden');
    document.body.style.backgroundColor = '';
    clearInterval(timerInterval);
    seconds = 0;
    currentLineIndex = 0;
  }

  function showLines() {
    textContainer.innerHTML = '';
    for (let i = 0; i < 4; i += 1) {
      if (currentLineIndex + i < lines.length) {
        const line = lines[currentLineIndex + i];
        const p = document.createElement('p');
        if (line.startsWith('**note**')) {
          p.classList.add('note');
          p.textContent = line.replace('**note**', '').trim();
        } else {
          p.textContent = line;
        }
        textContainer.appendChild(p);
      }
    }
    if (!isPaused) {
      currentLineIndex += 1;
      if (currentLineIndex < lines.length) {
        setTimeout(showLines, 2000); // Adjust scroll speed here
      }
    }
  }

  teleprompterIcon.addEventListener('click', startTeleprompter);

  stopIcon.addEventListener('click', stopTeleprompter);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isActive) {
      stopTeleprompter();
    } else if (event.key === ' ' && isActive) {
      event.preventDefault();
      isPaused = !isPaused;
      if (!isPaused) {
        showLines();
      }
    }
  });
}