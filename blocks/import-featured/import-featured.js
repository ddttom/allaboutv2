export default function decorate(block) {
  const featuredSection = document.createElement('div');
  featuredSection.className = 'section-card featured-section';
  featuredSection.innerHTML = `
    <h2>Featured</h2>
    <div class="featured-item">
      <h3>${block.children[0].children[0].textContent}</h3>
      <p>${block.children[0].children[1].textContent}</p>
      <p>${block.children[1].textContent}</p>
    </div>
  `;
  block.textContent = '';
  block.appendChild(featuredSection);
}