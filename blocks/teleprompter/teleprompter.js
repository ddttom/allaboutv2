export default async function decorate(block) {
  const teleprompterContent = block.querySelector('div');
  const container = document.createElement('div');
  container.className = 'teleprompter-container';
  const textContainer = document.createElement('div');
  textContainer.className = 'teleprompter-text';
  textContainer.innerHTML = teleprompterContent.innerHTML;
  container.appendChild(textContainer);

  const controls = document.createElement('div');
  controls.className = 'teleprompter-controls';
  const startButton = document.createElement('button');
  startButton.textContent = 'Start';
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Stop';
  const speedInput = document.createElement('input');
  speedInput.type = 'range';
  speedInput.min = '1';
  speedInput.max = '10';
  speedInput.value = '5';

  controls.appendChild(startButton);
  controls.appendChild(stopButton);
  controls.appendChild(speedInput);
  container.appendChild(controls);

  block.innerHTML = '';
  block.appendChild(container);

  let scrollInterval;
  const scrollSpeed = () => (11 - parseInt(speedInput.value, 10)) * 20;

  startButton.addEventListener('click', () => {
    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
      container.scrollTop += 1;
    }, scrollSpeed());
  });

  stopButton.addEventListener('click', () => {
    clearInterval(scrollInterval);
  });

  speedInput.addEventListener('input', () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        container.scrollTop += 1;
      }, scrollSpeed());
    }
  });

  // Accessibility enhancements
  startButton.setAttribute('aria-label', 'Start teleprompter');
  stopButton.setAttribute('aria-label', 'Stop teleprompter');
  speedInput.setAttribute('aria-label', 'Adjust scrolling speed');

  // eslint-disable-next-line no-console
  console.log('Teleprompter block initialized');
}