export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  if (images.length === 0) return;

  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  block.appendChild(container);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-image-container';
  container.appendChild(imageContainer);

  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';
  container.appendChild(indicators);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageContainer.innerHTML = '';
    imageContainer.appendChild(images[index]);
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, i) => 
      `<span class="indicator${i === currentIndex ? ' active' : ''}"></span>`
    ).join('');
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    clearInterval(intervalId);
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  // Randomize images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  showImage(currentIndex);
  startRotation();

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
      stopRotation();
    }
  });
}