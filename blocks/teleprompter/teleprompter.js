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

  const lines = Array.from(document.body.querySelectorAll('p'))
    .map((p) => p.textContent.trim())
    .filter((line) => line.length > 0);

  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.innerHTML = teleprompterSVG;
  teleprompterIcon.classList.add('teleprompter-icon');
  document.body.appendChild(teleprompterIcon);

  let isActive = false;
  let isPaused = false;
  let currentLineIndex = 0;
  let startTime;
  let timerInterval;

  const createTeleprompterView = () => {
    const view = document.createElement('div');
    view.classList.add('teleprompter-view');
    
    const stopIcon = document.createElement('div');
    stopIcon.innerHTML = stopSVG;
    stopIcon.classList.add('stop-icon');
    view.appendChild(stopIcon);

    const timer = document.createElement('div');
    timer.classList.add('timer');
    view.appendChild(timer);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    view.appendChild(textContainer);

    return view;
  };

  const updateTimer = () => {
    const timerElement = document.querySelector('.timer');
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTeleprompter = () => {
    isActive = true;
    document.body.classList.add('teleprompter-active');
    const view = createTeleprompterView();
    document.body.appendChild(view);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    scrollText();
  };

  const stopTeleprompter = () => {
    isActive = false;
    isPaused = false;
    document.body.classList.remove('teleprompter-active');
    const view = document.querySelector('.teleprompter-view');
    if (view) view.remove();
    clearInterval(timerInterval);
    currentLineIndex = 0;
  };

  const scrollText = () => {
    if (!isActive || isPaused) return;

    const textContainer = document.querySelector('.text-container');
    textContainer.innerHTML = '';

    for (let i = 0; i < 6; i += 1) {
      const lineIndex = currentLineIndex + i;
      if (lineIndex >= lines.length) break;

      const line = lines[lineIndex];
      const lineElement = document.createElement('div');
      lineElement.classList.add('teleprompter-line');

      if (line.startsWith('**note**')) {
        lineElement.classList.add('note');
        lineElement.textContent = line.replace('**note**', '').trim();
      } else if (line.startsWith('**action**')) {
        lineElement.classList.add('action');
        lineElement.textContent = line.replace('**action**', '').trim();
        if (i === 0) isPaused = true;
      } else {
        lineElement.textContent = line;
      }

      textContainer.appendChild(lineElement);
    }

    currentLineIndex += 1;

    if (currentLineIndex < lines.length && !isPaused) {
      setTimeout(scrollText, 2000); // Adjust scroll speed here
    } else if (currentLineIndex >= lines.length) {
      isPaused = true;
    }
  };

  teleprompterIcon.addEventListener('click', startTeleprompter);

  document.addEventListener('click', (e) => {
    if (e.target.closest('.stop-icon')) {
      stopTeleprompter();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      stopTeleprompter();
    } else if (e.key === ' ' && isActive) {
      e.preventDefault();
      isPaused = !isPaused;
      if (!isPaused) scrollText();
    }
  });
}