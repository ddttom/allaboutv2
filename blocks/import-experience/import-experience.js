export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('experience-container');

  const title = document.createElement('h2');
  title.textContent = 'Experience';
  container.appendChild(title);

  const experiences = Array.from(block.children);
  experiences.forEach((exp) => {
    const expDiv = document.createElement('div');
    expDiv.classList.add('experience-item');

    const [company, role, duration, description] = exp.children;

    const companyEl = document.createElement('h3');
    companyEl.textContent = company.textContent;
    expDiv.appendChild(companyEl);

    const roleEl = document.createElement('p');
    roleEl.classList.add('role');
    roleEl.textContent = role.textContent;
    expDiv.appendChild(roleEl);

    const durationEl = document.createElement('p');
    durationEl.classList.add('duration');
    durationEl.textContent = duration.textContent;
    expDiv.appendChild(durationEl);

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('description');
    descriptionEl.textContent = description.textContent;
    expDiv.appendChild(descriptionEl);

    container.appendChild(expDiv);
  });

  block.textContent = '';
  block.appendChild(container);
}