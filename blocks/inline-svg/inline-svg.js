export default function decorate(block) {
  const svgText = block.textContent.trim();
  if (svgText.startsWith('<svg')) {
    // Extract filename from the block's context or default to 'icon'
    const iconName = block.closest('[class*="icon-"]')?.className.match(/icon-([^\s]+)/)?.[1] || 'icon';
    
    // Clear the block content
    block.textContent = '';
    
    // Create the standardized structure
    const paragraph = document.createElement('p');
    const img = document.createElement('img');
    
    img.src = `/icons/${iconName}.svg`;
    img.alt = '';
    img.loading = 'eager';
    
    paragraph.appendChild(img);
    block.appendChild(paragraph);
  }
}