export default function decorate(block) {
  // First, try to find any icon spans
  const iconSpan = block.querySelector('span[class^="icon icon-"]');
  
  if (iconSpan) {
    // Get the icon name from the class
    const iconClasses = Array.from(iconSpan.classList);
    const iconClass = iconClasses.find(cls => cls.startsWith('icon-'));
    const iconName = iconClass ? iconClass.replace('icon-', '') : '';
    
    if (iconName) {
      // Clear the block content
      block.textContent = '';
      
      // Create the new standardized structure
      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      span.className = `icon icon-${iconName}`;
      const img = document.createElement('img');
      img.src = `/icons/${iconName}.svg`;
      img.alt = '';
      img.loading = 'eager';
      
      span.appendChild(img);
      paragraph.appendChild(span);
      block.appendChild(paragraph);
    }
  } else {
    // Check for SVG content as fallback
    const svgText = block.textContent.trim();
    if (svgText.startsWith('<svg')) {
      // Try to extract icon name from the block's context or path
      const blockClasses = Array.from(block.classList);
      const iconName = blockClasses.find(cls => cls !== 'inline-svg') || 'default-icon';
      
      // Clear the block content
      block.textContent = '';
      
      // Create the new standardized structure
      const paragraph = document.createElement('p');
      const img = document.createElement('img');
      img.src = `/icons/${iconName}.svg`;
      img.alt = `${iconName} illustration`;
      img.loading = 'eager';
      
      span.appendChild(img);
      paragraph.appendChild(span);
      block.appendChild(paragraph);
    } else {
      // eslint-disable-next-line no-console
      console.error('No valid icon or SVG content found in the block');
    }
  }
}