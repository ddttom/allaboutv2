export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map(a => a.href);
  const container = document.createElement('div');
  container.className = 'imageslider-container';
  
  const imageElement = document.createElement('img');
  imageElement.className = 'imageslider-image';
  imageElement.alt = 'Slider image';
  container.appendChild(imageElement);

  const indicators = document.createElement('div');
  indicators.className = 'imageslider-indicators';
  container.appendChild(indicators);

  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;
  let isHovering = false;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(images);

  function updateImage() {
    imageElement.src = images[currentIndex];
    updateIndicators();
  }

  function updateIndicators() {
    indicators.innerHTML = images.map((_, index) => 
      `<span class="indicator ${index === currentIndex ? 'active' : ''}"></span>`
    ).join('');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  }

  function startRotation() {
    if (!isHovering) {
      intervalId = setInterval(() => {
        if (!isHovering) nextImage();
      }, 5000);
    }
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopRotation();
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    nextImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  updateImage();
  startRotation();
}