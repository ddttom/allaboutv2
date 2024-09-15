export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('profile-recommendations');

  const heading = document.createElement('h2');
  heading.textContent = 'Recommendations';
  container.appendChild(heading);

  const recommendationsList = document.createElement('ul');
  recommendationsList.classList.add('recommendations-list');

  Array.from(block.children).forEach((row) => {
    const listItem = document.createElement('li');
    const recommender = document.createElement('h3');
    recommender.textContent = row.children[0].textContent;
    const relationship = document.createElement('p');
    relationship.textContent = row.children[1].textContent;
    const recommendation = document.createElement('blockquote');
    recommendation.textContent = row.children[2].textContent;

    listItem.appendChild(recommender);
    listItem.appendChild(relationship);
    listItem.appendChild(recommendation);
    recommendationsList.appendChild(listItem);
  });

  container.appendChild(recommendationsList);
  block.textContent = '';
  block.appendChild(container);
}