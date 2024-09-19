export default async function decorate(block) {
  const images = [];
  block.querySelectorAll('tr').forEach((row, index) => {
    if (index > 0) {
      const imgSrc = row.querySelector('td').textContent.trim();
      images.push(imgSrc);
    }
  });

  const container = document.createElement('div');
  container.classList.add('imagecycle-container');
  block.innerHTML = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;

  const showImage = (index) => {
    container.style.backgroundImage = `url(${images[index]})`;
  };

  const startRotation = () => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 5000);
  };

  const stopRotation = () => {
    clearInterval(intervalId);
  };

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
    startRotation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    } else if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }
  });

  images.sort(() => Math.random() - 0.5);
  showImage(currentIndex);
  startRotation();
}