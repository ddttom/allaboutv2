const INLINE_SVG_CONFIG = {
  ICONS_PATH: '/icons/',
  ICON_FILE_EXTENSION: '.svg',
  ICON_CLASS_PREFIX: 'icon-',
  SVG_WIDTH: '100%',
  SVG_HEIGHT: '100%',
  ALT_TEXT_SUFFIX: ' illustration',
  ERROR_MESSAGE: 'No valid icon or SVG content found in the block',
};

export default function decorate(block) {
  // First, try to find any icon spans
  const iconSpan = block.querySelector('span[class^="icon icon-"]');
  
  if (iconSpan) {
    // Get the icon name from the class
    const iconClasses = Array.from(iconSpan.classList);
    const iconClass = iconClasses.find(cls => cls.startsWith(INLINE_SVG_CONFIG.ICON_CLASS_PREFIX));
    const iconName = iconClass ? iconClass.replace(INLINE_SVG_CONFIG.ICON_CLASS_PREFIX, '') : '';

    if (iconName) {
      // Clear the block content
      block.textContent = '';

      // Create the new standardized structure
      const paragraph = document.createElement('p');

      const img = document.createElement('img');
      img.src = `${INLINE_SVG_CONFIG.ICONS_PATH}${iconName}${INLINE_SVG_CONFIG.ICON_FILE_EXTENSION}`;
      img.alt = `${iconName}${INLINE_SVG_CONFIG.ALT_TEXT_SUFFIX}`;

      block.appendChild(img);
      block.appendChild(paragraph);
    }
  } else {
    // Check for SVG content as fallback
    const svgText = block.textContent.trim();
    if (svgText.startsWith('<svg')) {
      // Clear the block content
      block.textContent = '';

      // create a container for the svg
      const svgContainer = document.createElement('div');
      svgContainer.innerHTML = svgText;

      // extract the svg element
      const svgElement = svgContainer.querySelector('svg');

      if (svgElement) {
        // ensure the svg takes full width and height
        svgElement.setAttribute('width', INLINE_SVG_CONFIG.SVG_WIDTH);
        svgElement.setAttribute('height', INLINE_SVG_CONFIG.SVG_HEIGHT);

        block.appendChild(svgElement);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(INLINE_SVG_CONFIG.ERROR_MESSAGE);
    }
  }
}