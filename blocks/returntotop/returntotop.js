// eslint-disable-next-line no-unused-vars

const RETURNTOTOP_CONFIG = {
  SCROLL_THRESHOLD: 100, // pixels
};

export default async function decorate(block) {
  // Use block parameter instead of global selector
  const returnToTopButton = block;

  window.addEventListener('scroll', () => {
    if (window.scrollY > RETURNTOTOP_CONFIG.SCROLL_THRESHOLD) {
      returnToTopButton.classList.add('visible');
    } else {
      returnToTopButton.classList.remove('visible');
    }
  });

  // Scroll to top when the button is clicked
  returnToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
