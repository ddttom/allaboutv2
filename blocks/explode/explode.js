// Configuration object for the explode block
const EXPLODE_CONFIG = {
  ANIMATION_DURATION: 13.5, // Total duration of the animation in seconds
  SVG_ID: 'explode-svg',
};

/**
 * Resets all animations in the SVG
 * @param {SVGElement} svg - The SVG element containing animations
 */
function resetAnimations(svg) {
  // Get all animate and animateTransform elements
  const animations = svg.querySelectorAll('animate, animateTransform');
  
  // Reset each animation
  animations.forEach((animation) => {
    // Reset the animation by setting begin to 'indefinite'
    animation.setAttribute('begin', 'indefinite');
    
    // Force a reflow
    animation.parentNode.offsetHeight;
    
    // Reset the begin attribute to '0s'
    animation.setAttribute('begin', '0s');
  });
}

/**
 * Decorates the explode block with click functionality
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Get the SVG element
  const svg = block.querySelector('svg');
  if (!svg) return;

  // Add ID to SVG for easier reference
  svg.id = EXPLODE_CONFIG.SVG_ID;

  // Add click event listener to the SVG
  svg.addEventListener('click', () => {
    resetAnimations(svg);
  });

  // Add cursor pointer to indicate clickability
  svg.style.cursor = 'pointer';
} 