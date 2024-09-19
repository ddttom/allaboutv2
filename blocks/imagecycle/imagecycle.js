export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  const container = document.createElement('div');
  container.className = 'imagecycle-container';
  const imageContainer = document.createElement('div');
  imageContainer.className = 'imagecycle-image-container';
  const indicators = document.createElement('div');
  indicators.className = 'imagecycle-indicators';

  let currentIndex = 0;
  let intervalId;

  // Randomize image order
  images.sort(() => Math.random() - 0.5);

  images.forEach((img, index) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'imagecycle-image';
    imgWrapper.appendChild(img);
    imageContainer.appendChild(imgWrapper);

    const indicator = document.createElement('span');
    indicator.className = 'imagecycle-indicator';
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  function showImage(index) {
    imageContainer.style.transform = `translateX(-${index * 100}%)`;
    [...indicators.children].forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
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
    if (e.key === 'ArrowLeft') {
      prevImage();
      stopRotation();
    } else if (e.key === 'ArrowRight') {
      nextImage();
      stopRotation();
    }
  });

  showImage(currentIndex);
  startRotation();
}