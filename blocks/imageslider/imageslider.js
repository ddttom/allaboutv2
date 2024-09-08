export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map(a => a.href);
  const container = document.createElement('div');
  container.className = 'imageslider-container';

  const imageElement = document.createElement('img');
  imageElement.className = 'imageslider-image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imageslider-indicators';
  container.appendChild(indicators);

  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId = null;

  function showImage(index) {
    imageElement.src = images[index];
    imageElement.alt = `Slide ${index + 1}`;
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, i) => 
      `<span class="indicator${i === currentIndex ? ' active' : ''}"></span>`
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
    if (!intervalId) {
      intervalId = setInterval(nextImage, 5000);
    }
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
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

  // Randomize initial image order
  images.sort(() => Math.random() - 0.5);
  showImage(0);
  startRotation();
}