export default function decorate(block) {
  const activitySection = document.createElement('div');
  activitySection.className = 'section-card activity-section';
  activitySection.innerHTML = `
    <h2>Activity</h2>
    <p class="followers">${block.children[0].textContent}</p>
    <div class="activity-post">
      <p class="post-meta">${block.children[1].textContent}</p>
      <p class="post-content">${block.children[2].textContent}</p>
    </div>
  `;
  block.textContent = '';
  block.appendChild(activitySection);
}