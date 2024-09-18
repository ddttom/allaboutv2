export default function decorate(block) {
  const aboutSection = document.createElement('div');
  aboutSection.className = 'section-card about-section';
  aboutSection.innerHTML = `
    <h2>About</h2>
    <p>${block.textContent.trim()}</p>
  `;
  block.textContent = '';
  block.appendChild(aboutSection);
}