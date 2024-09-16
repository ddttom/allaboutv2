export default async function decorate(block) {
  const svgContainer = block.querySelector(':scope > div:first-child > div');
  if (svgContainer && svgContainer.textContent.trim().toLowerCase().startsWith('<svg')) {
    const svgContent = svgContainer.textContent.trim();
    block.innerHTML = svgContent;
    block.classList.add('inline-svg');
  } else {
    // eslint-disable-next-line no-console
    console.warn('No valid SVG found in the first row of the inline-svg block.');
  }
}