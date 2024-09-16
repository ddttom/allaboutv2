export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'import-recommendations';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Recommendations';
  container.appendChild(title);

  const recommendationsList = document.createElement('ul');
  recommendationsList.className = 'recommendations-list';

  [...block.children].forEach((row) => {
    const [name, title, content] = [...row.children].map(cell => cell.textContent.trim());
    
    const listItem = document.createElement('li');
    listItem.className = 'recommendation-item';
    
    const nameElement = document.createElement('h3');
    nameElement.className = 'recommender-name';
    nameElement.textContent = name;
    
    const titleElement = document.createElement('p');
    titleElement.className = 'recommender-title';
    titleElement.textContent = title;
    
    const contentElement = document.createElement('blockquote');
    contentElement.className = 'recommendation-content';
    contentElement.textContent = content;
    
    listItem.appendChild(nameElement);
    listItem.appendChild(titleElement);
    listItem.appendChild(contentElement);
    
    recommendationsList.appendChild(listItem);
  });

  container.appendChild(recommendationsList);
  block.textContent = '';
  block.appendChild(container);
}