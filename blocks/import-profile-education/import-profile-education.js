export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-education');

  const heading = document.createElement('h2');
  heading.textContent = 'Education';
  container.appendChild(heading);

  const educationList = document.createElement('ul');
  educationList.classList.add('education-list');

  Array.from(block.children).forEach((row) => {
    const listItem = document.createElement('li');
    const institution = document.createElement('h3');
    institution.textContent = row.children[0].textContent;
    const degree = document.createElement('p');
    degree.textContent = row.children[1].textContent;
    const duration = document.createElement('p');
    duration.textContent = row.children[2].textContent;

    listItem.appendChild(institution);
    listItem.appendChild(degree);
    listItem.appendChild(duration);
    educationList.appendChild(listItem);
  });

  container.appendChild(educationList);
  block.textContent = '';
  block.appendChild(container);
}