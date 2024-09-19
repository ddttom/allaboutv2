export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'imagecycle-wrapper';
  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';

  // Randomize image order
  images.sort(() => Math.random() - 0.5);

  images.forEach((img, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'imagecycle-image';
    imgContainer.appendChild(img);
    imageWrapper.appendChild(imgContainer);

    const indicator = document.createElement('span');
    indicator.className = 'imagecycle-indicator';
    indicator.setAttribute('data-index', index);
    indicators.appendChild(indicator);
  });

  container.appendChild(imageWrapper);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;

  function showImage(index) {
    imageWrapper.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.imagecycle-indicator').forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextImage() {
    showImage((currentIndex + 1) % images.length);
  }

  function prevImage() {
    showImage((currentIndex - 1 + images.length) % images.length);
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
    if (e.key === 'ArrowRight') {
      stopRotation();
      nextImage();
      startRotation();
    } else if (e.key === 'ArrowLeft') {
      stopRotation();
      prevImage();
      startRotation();
    }
  });

  showImage(0);
  startRotation();
}