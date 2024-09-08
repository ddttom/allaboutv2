export default async function decorate(block) {
  const images = [...block.querySelectorAll('a')].map((a) => a.href);
  const shuffledImages = images.sort(() => Math.random() - 0.5);

  const container = document.createElement('div');
  container.className = 'slider-container';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'slider-image-container';

  const indicators = document.createElement('div');
  indicators.className = 'slider-indicators';

  shuffledImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Slide ${index + 1}`;
    img.className = index === 0 ? 'active' : '';
    imageContainer.appendChild(img);

    const indicator = document.createElement('span');
    indicator.className = index === 0 ? 'active' : '';
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  let currentIndex = 0;
  let intervalId;

  function showNextImage() {
    const images = imageContainer.querySelectorAll('img');
    const indicators = container.querySelectorAll('.slider-indicators span');
    
    images[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('active');
    
    currentIndex = (currentIndex + 1) % images.length;
    
    images[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
  }

  function startRotation() {
    intervalId = setInterval(showNextImage, 15000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', startRotation);

  startRotation();
}