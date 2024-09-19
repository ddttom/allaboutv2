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

  function showImage(index) {
    images.forEach((img, i) => {
      img.style.display = i === index ? 'block' : 'none';
      indicators.children[i].classList.toggle('active', i === index);
    });
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

  images.forEach((img, index) => {
    img.style.display = 'none';
    imageContainer.appendChild(img);
    const indicator = document.createElement('span');
    indicator.className = 'imagecycle-indicator';
    indicator.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      stopRotation();
      startRotation();
    });
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  // Randomize initial image
  currentIndex = Math.floor(Math.random() * images.length);
  showImage(currentIndex);

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
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

  startRotation();
}