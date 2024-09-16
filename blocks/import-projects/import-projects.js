export default function decorate(block) {
  const projectsSection = document.createElement('div');
  projectsSection.classList.add('projects-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Projects';

  projectsSection.appendChild(title);

  const projectsList = document.createElement('ul');
  projectsList.classList.add('projects-list');

  [...block.children].forEach((row) => {
    const [projectName, description, url] = [...row.children].map(cell => cell.textContent);

    const listItem = document.createElement('li');
    listItem.classList.add('project-item');

    const nameElement = document.createElement('h3');
    nameElement.textContent = projectName;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('project-description');
    descriptionElement.textContent = description;

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.textContent = 'View Project';
    linkElement.classList.add('project-link');

    listItem.appendChild(nameElement);
    listItem.appendChild(descriptionElement);
    listItem.appendChild(linkElement);

    projectsList.appendChild(listItem);
  });

  projectsSection.appendChild(projectsList);

  block.textContent = '';
  block.appendChild(projectsSection);
}