import { createOptimizedPicture } from '../../scripts/aem.js';

const teleprompterSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Camera body -->
  <rect x="60" y="70" width="80" height="60" fill="#333333" />
  
  <!-- Lens -->
  <circle cx="100" cy="100" r="20" fill="#4a4a4a" />
  <circle cx="100" cy="100" r="15" fill="#333333" />
  
  <!-- Teleprompter screen -->
  <rect x="40" y="40" width="120" height="90" fill="#87CEEB" stroke="#000000" stroke-width="2" />
  
  <!-- Text lines on screen -->
  <line x1="50" y1="60" x2="150" y2="60" stroke="#000000" stroke-width="2" />
  <line x1="50" y1="80" x2="150" y2="80" stroke="#000000" stroke-width="2" />
  <line x1="50" y1="100" x2="150" y2="100" stroke="#000000" stroke-width="2" />
  
  <!-- Stand -->
  <rect x="90" y="130" width="20" height="40" fill="#555555" />
  <rect x="70" y="170" width="60" height="10" fill="#555555" />
</svg>`;

const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <!-- White background circle -->
    <circle cx="300" cy="300" r="290" fill="white" />
    
    <!-- Red border -->
    <circle cx="300" cy="300" r="290" fill="none" stroke="#c1121f" stroke-width="20" />
    
    <!-- STOP text -->
    <text x="300" y="330" font-family="Arial, sans-serif" font-size="140" font-weight="bold" text-anchor="middle" fill="black">STOP</text>
  </svg>`;

export default async function decorate(block) {
  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.classList.add('teleprompter-icon');
  teleprompterIcon.innerHTML = teleprompterSVG;
  document.body.appendChild(teleprompterIcon);

  const stopIcon = document.createElement('div');
  stopIcon.classList.add('stop-icon');
  stopIcon.innerHTML = stopSVG;

  const timerDisplay = document.createElement('div');
  timerDisplay.classList.add('timer-display');

  const teleprompterView = document.createElement('div');
  teleprompterView.classList.add('teleprompter-view');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container');

  let lines = [];
  let currentLine = 0;
  let isActive = false;
  let isPaused = false;
  let startTime;
  let timerInterval;

  function getAllText() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );
    let node;
    const textNodes = [];

    while ((node = walker.nextNode())) {
      if (node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
        textNodes.push(node.textContent.trim());
      }
    }

    return textNodes.filter((text) => text.length > 0);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = formatTime(currentTime);
  }

  function startTeleprompter() {
    isActive = true;
    document.body.classList.add('teleprompter-active');
    document.body.appendChild(stopIcon);
    document.body.appendChild(timerDisplay);
    document.body.appendChild(teleprompterView);
    teleprompterView.appendChild(textContainer);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateTeleprompterText();
  }

  function stopTeleprompter() {
    isActive = false;
    isPaused = false;
    document.body.classList.remove('teleprompter-active');
    stopIcon.remove();
    timerDisplay.remove();
    teleprompterView.remove();
    clearInterval(timerInterval);
    currentLine = 0;
  }

  function updateTeleprompterText() {
    textContainer.innerHTML = '';
    for (let i = 0; i < 4; i += 1) {
      if (currentLine + i < lines.length) {
        const lineElement = document.createElement('p');
        const lineText = lines[currentLine + i];
        if (lineText.startsWith('**note**')) {
          lineElement.classList.add('note');
          lineElement.textContent = lineText.replace('**note**', '').trim();
        } else {
          lineElement.textContent = lineText;
        }
        textContainer.appendChild(lineElement);
      }
    }
  }

  function scrollText() {
    if (!isActive || isPaused) return;
    currentLine += 1;
    if (currentLine >= lines.length) {
      stopTeleprompter();
      return;
    }
    updateTeleprompterText();
    setTimeout(scrollText, 3000); // Adjust scroll speed here
  }

  teleprompterIcon.addEventListener('click', () => {
    if (!isActive) {
      lines = getAllText();
      startTeleprompter();
      scrollText();
    }
  });

  stopIcon.addEventListener('click', stopTeleprompter);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isActive) {
      stopTeleprompter();
    } else if (event.key === ' ' && isActive) {
      event.preventDefault();
      isPaused = !isPaused;
      if (!isPaused) {
        scrollText();
      }
    }
  });
}