export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-image-container';
  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';

  // Randomize image order
  images.sort(() => Math.random() - 0.5);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageContainer.innerHTML = '';
    imageContainer.appendChild(images[index]);
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, i) => 
      `<span class="indicator ${i === currentIndex ? 'active' : ''}"></span>`
    ).join('');
  }

  function rotateImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function startRotation() {
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  imageContainer.addEventListener('mouseenter', stopRotation);
  imageContainer.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
      stopRotation();
      startRotation();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
      stopRotation();
      startRotation();
    }
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  showImage(currentIndex);
  startRotation();
}