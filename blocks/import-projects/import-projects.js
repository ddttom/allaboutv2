export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-projects';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Projects';
  container.appendChild(title);

  const projectsList = document.createElement('ul');
  projectsList.className = 'projects-list';

  [...block.children].forEach((row) => {
    const [projectName, description, url] = [...row.children].map(cell => cell.textContent.trim());
    
    const listItem = document.createElement('li');
    listItem.className = 'project-item';
    
    const nameElement = document.createElement('h3');
    nameElement.className = 'project-name';
    nameElement.textContent = projectName;
    
    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'project-description';
    descriptionElement.textContent = description;
    
    const linkElement = document.createElement('a');
    linkElement.className = 'project-link';
    linkElement.href = url;
    linkElement.textContent = 'View Project';
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    
    listItem.appendChild(nameElement);
    listItem.appendChild(descriptionElement);
    listItem.appendChild(linkElement);
    
    projectsList.appendChild(listItem);
  });

  container.appendChild(projectsList);
  block.textContent = '';
  block.appendChild(container);
}