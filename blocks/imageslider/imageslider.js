export default async function decorate(block) {
  const images = [...block.querySelectorAll('img, a')].map((el) => el.tagName === 'A' ? el.href : el.src);
  const container = document.createElement('div');
  container.className = 'imageslider-container';
  
  const imageElement = document.createElement('img');
  imageElement.className = 'imageslider-image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imageslider-indicators';
  container.appendChild(indicators);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageElement.src = images[index];
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
    stopRotation();
    intervalId = setInterval(nextImage, 5000);
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  // Shuffle images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  showImage(0);
  startRotation();

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    nextImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  block.textContent = '';
  block.appendChild(container);
}