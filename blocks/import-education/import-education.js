export default async function decorate(block) {
  const educationSection = document.createElement('div');
  educationSection.className = 'section-card education-section';
  educationSection.innerHTML = `
    <h2>Education</h2>
    <ul class="education-list">
      ${Array.from(block.children).map(row => `
        <li>
          <img src="${row.children[0].textContent}" alt="School Logo">
          <div>
            <h3>${row.children[1].textContent}</h3>
            <p>${row.children[2].textContent}</p>
            <p>${row.children[3].textContent}</p>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
  block.textContent = '';
  block.appendChild(educationSection);
}