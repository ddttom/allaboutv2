export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map((a) => a.href);
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
  const totalImages = images.length;

  function updateImage(index) {
    imageElement.src = images[index];
    updateIndicators(index);
  }

  function updateIndicators(activeIndex) {
    indicators.innerHTML = images.map((_, index) => 
      `<span class="indicator${index === activeIndex ? ' active' : ''}"></span>`
    ).join('');
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateImage(currentIndex);
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

  // Shuffle images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  updateImage(currentIndex);
  startRotation();

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    nextImage();
    startRotation();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopRotation();
      prevImage();
    } else if (e.key === 'ArrowRight') {
      stopRotation();
      nextImage();
    }
  });
}