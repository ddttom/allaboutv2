export default async function decorate(block) {
  const images = Array.from(block.querySelectorAll('a')).map((a) => a.href);
  let currentIndex = 0;
  let intervalId;

  const container = document.createElement('div');
  container.classList.add('imagecycle-container');
  block.appendChild(container);

  const img = document.createElement('img');
  img.style.width = '400px';
  container.appendChild(img);

  const indicators = document.createElement('div');
  indicators.classList.add('imagecycle-indicators');
  block.appendChild(indicators);

  images.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.classList.add('imagecycle-indicator');
    if (index === 0) indicator.classList.add('active');
    indicators.appendChild(indicator);
  });

  const updateImage = () => {
    img.src = images[currentIndex];
    document.querySelectorAll('.imagecycle-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  };

  const startRotation = () => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    }, 5000);
  };

  const stopRotation = () => {
    clearInterval(intervalId);
  };

  container.addEventListener('mouseover', stopRotation);
  container.addEventListener('mouseout', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
    startRotation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    } else if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }
  });

  updateImage();
  startRotation();
}