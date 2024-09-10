export default async function decorate(block) {
  const images = [...block.querySelectorAll('img, a')].map(el => el.tagName === 'A' ? el.href : el.src);
  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  
  const imageElement = document.createElement('img');
  imageElement.className = 'imagecycle-image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';
  container.appendChild(indicators);

  let currentIndex = Math.floor(Math.random() * images.length);
  let intervalId;

  function updateImage() {
    imageElement.src = images[currentIndex];
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = '';
    images.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = `imagecycle-dot ${index === currentIndex ? 'active' : ''}`;
      indicators.appendChild(dot);
    });
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }

  function startRotation() {
    clearInterval(intervalId);
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
      stopRotation();
      startRotation();
    } else if (e.key === 'ArrowRight') {
      rotateImage();
      stopRotation();
      startRotation();
    }
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });
  document.addEventListener('keydown', handleKeyNavigation);

  block.textContent = '';
  block.appendChild(container);

  updateImage();
  startRotation();
}