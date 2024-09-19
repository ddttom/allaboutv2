import { createOptimizedPicture } from '../../scripts/aem.js';

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

  // Randomize image order
  images.sort(() => Math.random() - 0.5);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageContainer.innerHTML = '';
    const img = createOptimizedPicture(images[index].src, images[index].alt, false, [{ width: 400 }]);
    imageContainer.appendChild(img);
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, index) => 
      `<span class="indicator${index === currentIndex ? ' active' : ''}"></span>`
    ).join('');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    intervalId = setInterval(nextImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    nextImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  showImage(currentIndex);
  startRotation();
}