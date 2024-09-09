export default async function decorate(block) {
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

  const text = Array.from(document.body.querySelectorAll('p'))
    .map(p => p.textContent)
    .join('\n');

  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.innerHTML = teleprompterSVG;
  teleprompterIcon.classList.add('teleprompter-icon');
  document.body.appendChild(teleprompterIcon);

  let isRunning = false;
  let startTime;
  let timerInterval;
  let scrollInterval;
  let currentLineIndex = 0;

  const teleprompterScreen = document.createElement('div');
  teleprompterScreen.classList.add('teleprompter-screen');
  document.body.appendChild(teleprompterScreen);

  const timerDisplay = document.createElement('div');
  timerDisplay.classList.add('timer-display');
  document.body.appendChild(timerDisplay);

  const lines = text.split('\n');

  function updateTeleprompter() {
    const visibleLines = lines.slice(currentLineIndex, currentLineIndex + 7);
    teleprompterScreen.innerHTML = visibleLines.map((line, index) => {
      let className = '';
      if (index === 0) className = 'current-line';
      if (line.startsWith('**note**')) {
        line = line.replace('**note**', '');
        className += ' note-line';
      }
      if (line.startsWith('**action**')) {
        line = line.replace('**action**', '');
        className += ' action-line';
      }
      return `<div class="${className}">${line}</div>`;
    }).join('');
  }

  function startTeleprompter() {
    isRunning = true;
    document.body.style.backgroundColor = 'black';
    teleprompterIcon.innerHTML = stopSVG;
    teleprompterScreen.style.display = 'block';
    timerDisplay.style.display = 'block';
    startTime = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    scrollInterval = setInterval(() => {
      if (isRunning) {
        currentLineIndex += 1;
        updateTeleprompter();
        if (currentLineIndex >= lines.length) {
          stopTeleprompter();
        } else if (lines[currentLineIndex].startsWith('**action**')) {
          isRunning = false;
        }
      }
    }, 10000);
  }

  function stopTeleprompter() {
    isRunning = false;
    document.body.style.backgroundColor = '';
    teleprompterIcon.innerHTML = teleprompterSVG;
    teleprompterScreen.style.display = 'none';
    timerDisplay.style.display = 'none';
    clearInterval(timerInterval);
    clearInterval(scrollInterval);
    currentLineIndex = 0;
  }

  function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  teleprompterIcon.addEventListener('click', () => {
    if (!isRunning) {
      startTeleprompter();
    } else {
      stopTeleprompter();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      stopTeleprompter();
    } else if (event.key === ' ') {
      isRunning = !isRunning;
      event.preventDefault();
    }
  });

  updateTeleprompter();
}