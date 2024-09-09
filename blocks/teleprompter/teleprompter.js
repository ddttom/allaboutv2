import { createOptimizedPicture } from '../../scripts/aem.js';

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

  const viewport = document.createElement('div');
  viewport.classList.add('teleprompter-viewport');
  block.appendChild(viewport);

  const teleprompterIcon = document.createElement('div');
  teleprompterIcon.classList.add('teleprompter-icon');
  teleprompterIcon.innerHTML = teleprompterSVG;
  viewport.appendChild(teleprompterIcon);

  const timer = document.createElement('div');
  timer.classList.add('teleprompter-timer');
  viewport.appendChild(timer);

  const textContainer = document.createElement('div');
  textContainer.classList.add('teleprompter-text-container');
  viewport.appendChild(textContainer);

  let processedText = [];
  let isActive = false;
  let isPaused = false;
  let startTime;
  let timerInterval;

  function processText() {
    const allTextElements = document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    allTextElements.forEach((element) => {
      if (element.closest('.teleprompter') === null) {
        const text = element.textContent.replace(/Edge Delivery Services/g, 'EdgeDeliveryServices');
        const words = text.split(/\s+/);
        for (let i = 0; i < words.length; i += 8) {
          const line = words.slice(i, i + 8).join(' ');
          processedText.push(line);
        }
      }
    });
    // eslint-disable-next-line no-console
    console.log('Processed Text:', processedText);
  }

  function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getUTCSeconds().toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
  }

  function startTeleprompter() {
    isActive = true;
    isPaused = false;
    viewport.classList.add('active');
    teleprompterIcon.innerHTML = stopSVG;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    displayText();
  }

  function stopTeleprompter() {
    isActive = false;
    isPaused = false;
    viewport.classList.remove('active');
    teleprompterIcon.innerHTML = teleprompterSVG;
    clearInterval(timerInterval);
    timer.textContent = '';
    textContainer.innerHTML = '';
  }

  function togglePause() {
    if (isActive) {
      isPaused = !isPaused;
      if (isPaused) {
        clearInterval(timerInterval);
      } else {
        startTime = new Date().getTime() - (new Date(timer.textContent).getTime() - new Date(0).getTime());
        timerInterval = setInterval(updateTimer, 1000);
      }
    }
  }

  function displayText() {
    textContainer.innerHTML = '';
    processedText.forEach((line, index) => {
      const lineElement = document.createElement('div');
      lineElement.classList.add('teleprompter-line');
      if (line.startsWith('**note**')) {
        lineElement.classList.add('note');
        line = line.replace('**note**', '').trim();
      }
      lineElement.textContent = line;
      textContainer.appendChild(lineElement);
    });
  }

  function scrollText(delta) {
    if (isActive && !isPaused) {
      const lines = textContainer.querySelectorAll('.teleprompter-line');
      const lineHeight = lines[0].offsetHeight;
      textContainer.scrollTop += delta > 0 ? lineHeight : -lineHeight;
    }
  }

  teleprompterIcon.addEventListener('click', () => {
    if (isActive) {
      stopTeleprompter();
    } else {
      startTeleprompter();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      stopTeleprompter();
    } else if (event.key === ' ') {
      togglePause();
    }
  });

  viewport.addEventListener('wheel', (event) => {
    scrollText(event.deltaY);
  });

  processText();
}