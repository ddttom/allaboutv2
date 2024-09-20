export default function decorate(block) {
  const educationSection = document.createElement('div');
  educationSection.className = 'section-card education-section';
  educationSection.innerHTML = `
    <h2 class="section-title">Education</h2>
    <ul class="education-list">
      ${Array.from(block.children).map(item => `
        <li class="education-item">
          <img src="${item.querySelector('.school-logo').textContent}" alt="School Logo" class="school-logo">
          <div class="education-details">
            <h3 class="school-name">${item.querySelector('.school-name').textContent}</h3>
            <p class="degree">${item.querySelector('.degree').textContent}</p>
            <p class="education-duration">${item.querySelector('.education-duration').textContent}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(educationSection);
}