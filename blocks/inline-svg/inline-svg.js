export default function decorate(block) {
  // Look for either a span with icon classes or SVG content
  const iconSpan = block.querySelector('span[class*="icon-"]');
  
  if (iconSpan) {
    // Get the icon name from the class
    const iconClass = Array.from(iconSpan.classList)
      .find(cls => cls.startsWith('icon-'));
    const iconName = iconClass ? iconClass.replace('icon-', '') : '';
    
    if (iconName) {
      // Clear the block content
      block.textContent = '';
      
      // Create the standardized structure
      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      const img = document.createElement('img');
      
      span.className = `icon icon-${iconName}`;
      img.src = `/icons/${iconName}.svg`;
      img.alt = '';
      img.loading = 'eager';
      
      span.appendChild(img);
      paragraph.appendChild(span);
      block.appendChild(paragraph);
    }
  } else {
    // Handle direct SVG content case
    const svgText = block.textContent.trim();
    if (svgText.startsWith('<svg')) {
      // Extract filename from the block's context or default to 'icon'
      const iconName = block.closest('[class*="icon-"]')?.className.match(/icon-([^\s]+)/)?.[1] || 'icon';
      
      // Clear the block content
      block.textContent = '';
      
      // Create the standardized structure
      const paragraph = document.createElement('p');
      const span = document.createElement('span');
      const img = document.createElement('img');
      
      span.className = `icon icon-${iconName}`;
      img.src = `/icons/${iconName}.svg`;
      img.alt = '';
      img.loading = 'eager';
      
      span.appendChild(img);
      paragraph.appendChild(span);
      block.appendChild(paragraph);
    }
  }
}