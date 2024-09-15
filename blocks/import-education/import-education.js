export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('education-container');

  const title = document.createElement('h2');
  title.textContent = 'Education';
  container.appendChild(title);

  const educations = Array.from(block.children);
  educations.forEach((edu) => {
    const eduDiv = document.createElement('div');
    eduDiv.classList.add('education-item');

    const [school, degree, duration] = edu.children;

    const schoolEl = document.createElement('h3');
    schoolEl.textContent = school.textContent;
    eduDiv.appendChild(schoolEl);

    const degreeEl = document.createElement('p');
    degreeEl.classList.add('degree');
    degreeEl.textContent = degree.textContent;
    eduDiv.appendChild(degreeEl);

    const durationEl = document.createElement('p');
    durationEl.classList.add('duration');
    durationEl.textContent = duration.textContent;
    eduDiv.appendChild(durationEl);

    container.appendChild(eduDiv);
  });

  block.textContent = '';
  block.appendChild(container);
}