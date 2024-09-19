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

  const showImage = (index) => {
    imageContainer.innerHTML = '';
    const img = images[index].cloneNode(true);
    imageContainer.appendChild(img);

    indicators.innerHTML = '';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `imagecycle-indicator ${i === index ? 'active' : ''}`;
      indicators.appendChild(dot);
    });
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  const startRotation = () => {
    intervalId = setInterval(nextImage, 5000);
  };

  const stopRotation = () => {
    clearInterval(intervalId);
  };

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    stopRotation();
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

export default async function decorate(block) {
  await createImageCycle(block);
}