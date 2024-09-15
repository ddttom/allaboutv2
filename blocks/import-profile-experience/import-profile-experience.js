export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-experience');

  const heading = document.createElement('h2');
  heading.textContent = 'Experience';
  container.appendChild(heading);

  const experienceList = document.createElement('ul');
  experienceList.classList.add('experience-list');

  Array.from(block.children).forEach((row) => {
    const listItem = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = row.children[0].textContent;
    const company = document.createElement('p');
    company.textContent = row.children[1].textContent;
    const duration = document.createElement('p');
    duration.textContent = row.children[2].textContent;
    const description = document.createElement('p');
    description.textContent = row.children[3].textContent;

    listItem.appendChild(title);
    listItem.appendChild(company);
    listItem.appendChild(duration);
    listItem.appendChild(description);
    experienceList.appendChild(listItem);
  });

  container.appendChild(experienceList);
  block.textContent = '';
  block.appendChild(container);
}