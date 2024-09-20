export default function decorate(block) {
  const experienceSection = document.createElement('div');
  experienceSection.className = 'section-card experience-section';
  experienceSection.innerHTML = `
    <h2 class="section-title">Experience</h2>
    <ul class="experience-list">
      ${Array.from(block.children).map(item => `
        <li class="experience-item">
          <img src="${item.querySelector('.company-logo').textContent}" alt="Company Logo" class="company-logo">
          <div class="experience-details">
            <h3 class="job-title">${item.querySelector('.job-title').textContent}</h3>
            <p class="company-name">${item.querySelector('.company-name').textContent}</p>
            <p class="job-duration">${item.querySelector('.job-duration').textContent}</p>
            <p class="job-location">${item.querySelector('.job-location').textContent}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(experienceSection);
}