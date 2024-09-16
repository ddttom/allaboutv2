export default function decorate(block) {
  const educationSection = document.createElement('div');
  educationSection.classList.add('education-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Education';

  educationSection.appendChild(title);

  const educationList = document.createElement('ul');
  educationList.classList.add('education-list');

  [...block.children].forEach((row) => {
    const [school, degree, years] = [...row.children].map(cell => cell.textContent);

    const listItem = document.createElement('li');
    listItem.classList.add('education-item');

    const schoolElement = document.createElement('h3');
    schoolElement.textContent = school;

    const degreeElement = document.createElement('p');
    degreeElement.classList.add('degree');
    degreeElement.textContent = degree;

    const yearsElement = document.createElement('p');
    yearsElement.classList.add('years');
    yearsElement.textContent = years;

    listItem.appendChild(schoolElement);
    listItem.appendChild(degreeElement);
    listItem.appendChild(yearsElement);

    educationList.appendChild(listItem);
  });

  educationSection.appendChild(educationList);

  block.textContent = '';
  block.appendChild(educationSection);
}