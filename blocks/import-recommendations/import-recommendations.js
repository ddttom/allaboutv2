export default function decorate(block) {
  const recommendationsSection = document.createElement('div');
  recommendationsSection.className = 'section-card recommendations-section';
  recommendationsSection.innerHTML = `
    <h2 class="section-title">Recommendations</h2>
    <ul class="recommendations-list">
      ${Array.from(block.children).map(item => `
        <li class="recommendation-item">
          <img src="${item.querySelector('.recommender-photo').textContent}" alt="Recommender" class="recommender-photo">
          <div class="recommendation-details">
            <h3 class="recommender-name">${item.querySelector('.recommender-name').textContent}</h3>
            <p class="recommender-title">${item.querySelector('.recommender-title').textContent}</p>
            <p class="recommendation-text">${item.querySelector('.recommendation-text').textContent}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(recommendationsSection);
}