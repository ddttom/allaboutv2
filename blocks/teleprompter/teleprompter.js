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

  const lines = Array.from(document.body.querySelectorAll('p')).map((p) => p.textContent);
  let currentLineIndex = 0;
  let isPlaying = false;
  let isPaused = false;
  let startTime;
  let timerInterval;

  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.innerHTML = teleprompterSVG;
  teleprompterIcon.classList.add('teleprompter-icon');
  document.body.appendChild(teleprompterIcon);

  const overlay = document.createElement('div');
  overlay.classList.add('teleprompter-overlay');
  document.body.appendChild(overlay);

  const stopIcon = document.createElement('div');
  stopIcon.innerHTML = stopSVG;
  stopIcon.classList.add('stop-icon');

  const timer = document.createElement('div');
  timer.classList.add('timer');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container');

  function updateTimer() {
    const now = new Date().getTime();
    const elapsed = now - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function startTeleprompter() {
    overlay.style.display = 'block';
    overlay.innerHTML = '';
    overlay.appendChild(stopIcon);
    overlay.appendChild(timer);
    overlay.appendChild(textContainer);
    isPlaying = true;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    showNextLines();
  }

  function stopTeleprompter() {
    overlay.style.display = 'none';
    isPlaying = false;
    isPaused = false;
    currentLineIndex = 0;
    clearInterval(timerInterval);
  }

  function showNextLines() {
    if (!isPlaying || isPaused) return;

    textContainer.innerHTML = '';
    for (let i = 0; i < 6; i += 1) {
      if (currentLineIndex + i < lines.length) {
        const lineElement = document.createElement('div');
        const line = lines[currentLineIndex + i];
        if (line.startsWith('**note**')) {
          lineElement.classList.add('note');
          lineElement.textContent = line.replace('**note**', '').trim();
        } else if (line.startsWith('**action**')) {
          lineElement.classList.add('action');
          lineElement.textContent = line.replace('**action**', '').trim();
          if (i === 0) {
            isPaused = true;
          }
        } else {
          lineElement.textContent = line;
        }
        textContainer.appendChild(lineElement);
      }
    }

    if (currentLineIndex < lines.length) {
      currentLineIndex += 1;
      if (!isPaused) {
        setTimeout(showNextLines, 3000);
      }
    } else {
      isPaused = true;
    }
  }

  teleprompterIcon.addEventListener('click', startTeleprompter);

  stopIcon.addEventListener('click', stopTeleprompter);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      stopTeleprompter();
    } else if (event.key === ' ') {
      if (isPlaying) {
        if (isPaused) {
          isPaused = false;
          showNextLines();
        } else {
          isPaused = true;
        }
      }
    }
  });
}