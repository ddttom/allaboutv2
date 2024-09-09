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
    .map((p) => p.textContent)
    .join('\n');

  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.innerHTML = teleprompterSVG;
  teleprompterIcon.classList.add('teleprompter-icon');
  document.body.appendChild(teleprompterIcon);

  let isRunning = false;
  let startTime;
  let timerInterval;
  let scrollInterval;

  function startTeleprompter() {
    isRunning = true;
    document.body.innerHTML = '';
    document.body.style.backgroundColor = 'black';

    const stopIcon = document.createElement('div');
    stopIcon.innerHTML = stopSVG;
    stopIcon.classList.add('stop-icon');
    document.body.appendChild(stopIcon);

    const timer = document.createElement('div');
    timer.classList.add('timer');
    document.body.appendChild(timer);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    document.body.appendChild(textContainer);

    startTime = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    const lines = text.split('\n');
    let currentLine = 0;

    function updateText() {
      textContainer.innerHTML = '';
      for (let i = 0; i < 6; i += 1) {
        if (currentLine + i < lines.length) {
          const line = lines[currentLine + i];
          const p = document.createElement('p');
          if (line.startsWith('**note**')) {
            p.style.color = 'lightgray';
            p.textContent = line.replace('**note**', '').trim();
          } else if (line.startsWith('**action**')) {
            p.style.color = 'yellow';
            p.textContent = line.replace('**action**', '').trim();
          } else {
            p.style.color = 'white';
            p.textContent = line;
          }
          textContainer.appendChild(p);
        }
      }
    }

    function scroll() {
      if (!isRunning) return;
      updateText();
      currentLine += 1;
      if (currentLine >= lines.length) {
        clearInterval(scrollInterval);
      } else if (lines[currentLine].startsWith('**action**')) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    }

    updateText();
    scrollInterval = setInterval(scroll, 3000);

    stopIcon.addEventListener('click', stopTeleprompter);
    document.addEventListener('keydown', handleKeyPress);
  }

  function stopTeleprompter() {
    isRunning = false;
    clearInterval(timerInterval);
    clearInterval(scrollInterval);
    document.body.innerHTML = '';
    document.body.style.backgroundColor = '';
    document.body.appendChild(teleprompterIcon);
    document.removeEventListener('keydown', handleKeyPress);
  }

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timerElement = document.querySelector('.timer');
    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Escape') {
      stopTeleprompter();
    } else if (event.key === ' ') {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      } else {
        scrollInterval = setInterval(scroll, 3000);
      }
    }
  }

  teleprompterIcon.addEventListener('click', startTeleprompter);
}