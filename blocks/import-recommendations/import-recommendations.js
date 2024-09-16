export default function decorate(block) {
  const recommendationsSection = document.createElement('div');
  recommendationsSection.classList.add('recommendations-section', 'section-card');

  const title = document.createElement('h2');
  title.classList.add('section-title');
  title.textContent = 'Recommendations';

  recommendationsSection.appendChild(title);

  const recommendationsList = document.createElement('ul');
  recommendationsList.classList.add('recommendations-list');

  [...block.children].forEach((row) => {
    const [name, title, content] = [...row.children].map(cell => cell.textContent);

    const listItem = document.createElement('li');
    listItem.classList.add('recommendation-item');

    const nameElement = document.createElement('h3');
    nameElement.textContent = name;

    const titleElement = document.createElement('p');
    titleElement.classList.add('recommender-title');
    titleElement.textContent = title;

    const contentElement = document.createElement('p');
    contentElement.classList.add('recommendation-content');
    contentElement.textContent = content;

    listItem.appendChild(nameElement);
    listItem.appendChild(titleElement);
    listItem.appendChild(contentElement);

    recommendationsList.appendChild(listItem);
  });

  recommendationsSection.appendChild(recommendationsList);

  block.textContent = '';
  block.appendChild(recommendationsSection);
}