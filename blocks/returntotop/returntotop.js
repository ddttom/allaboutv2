/**
 * @file returntotop.js
 * @description returntotop
 * @version 1.0
 * @author Tom Cranstoun
 *
 * @mx:category mx-tools
 * @mx:status active
 * @mx:contentType script
 * @mx:tags tool
 * @mx:partOf mx-os
 */
// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  const returnToTopButton = document.querySelector('.returntotop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      returnToTopButton.style.display = 'block';
    } else {
      returnToTopButton.style.display = 'none';
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
