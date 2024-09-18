export default function decorate(block) {
  const featuredSection = document.createElement('div');
  featuredSection.className = 'section-card featured-section';
  
  const title = block.children[0]?.children[0]?.textContent || 'Featured Content';
  const description = block.children[1]?.children[0]?.textContent || 'No description available.';

  featuredSection.innerHTML = `
    <h2>Featured</h2>
    <div class="featured-item">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
  block.textContent = '';
  block.appendChild(featuredSection);
}