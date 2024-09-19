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

  // Randomize images
  images.sort(() => Math.random() - 0.5);

  images.forEach((img, index) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'imagecycle-image';
    imgWrapper.style.display = index === 0 ? 'block' : 'none';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    imgWrapper.appendChild(img);
    imageContainer.appendChild(imgWrapper);

    const indicator = document.createElement('span');
    indicator.className = 'imagecycle-indicator';
    indicator.setAttribute('data-index', index);
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  function showImage(index) {
    images.forEach((_, i) => {
      imageContainer.children[i].style.display = i === index ? 'block' : 'none';
      indicators.children[i].classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function rotateImage() {
    showImage((currentIndex + 1) % images.length);
  }

  function startRotation() {
    intervalId = setInterval(rotateImage, 5000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    rotateImage();
    startRotation();
  });

  indicators.addEventListener('click', (e) => {
    if (e.target.classList.contains('imagecycle-indicator')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      showImage(index);
      stopRotation();
      startRotation();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showImage((currentIndex - 1 + images.length) % images.length);
      stopRotation();
      startRotation();
    } else if (e.key === 'ArrowRight') {
      showImage((currentIndex + 1) % images.length);
      stopRotation();
      startRotation();
    }
  });

  showImage(0);
  startRotation();
}