export default async function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  if (images.length === 0) return;

  // Randomize images
  const shuffledImages = images.sort(() => 0.5 - Math.random());

  const container = document.createElement('div');
  container.className = 'slider-container';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'slider-image-container';

  const indicators = document.createElement('div');
  indicators.className = 'slider-indicators';

  shuffledImages.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'slider-slide';
    slide.appendChild(img);
    imageContainer.appendChild(slide);

    const indicator = document.createElement('button');
    indicator.className = 'slider-indicator';
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.addEventListener('click', () => goToSlide(index));
    indicators.appendChild(indicator);
  });

  container.appendChild(imageContainer);
  container.appendChild(indicators);
  block.textContent = '';
  block.appendChild(container);

  let currentSlide = 0;
  let intervalId;

  function goToSlide(index) {
    currentSlide = index;
    imageContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
  }

  function updateIndicators() {
    indicators.querySelectorAll('.slider-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % shuffledImages.length;
    goToSlide(currentSlide);
  }

  function startRotation() {
    intervalId = setInterval(nextSlide, 15000);
  }

  function stopRotation() {
    clearInterval(intervalId);
  }

  container.addEventListener('mouseenter', stopRotation);
  container.addEventListener('mouseleave', startRotation);

  goToSlide(0);
  startRotation();
}