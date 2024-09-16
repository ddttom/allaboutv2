import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const newsContainer = document.createElement('div');
  newsContainer.classList.add('news-container');
  block.appendChild(newsContainer);

  const newsData = '/news-feed.json';

  try {
    const response = await fetch(newsData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    function renderArticles(articles) {
      newsContainer.innerHTML = '';
      articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');
        
        const picture = createOptimizedPicture(article.image, article.title, false, [{ width: '750' }]);
        
        articleElement.innerHTML = `
          ${picture.outerHTML}
          <h3>${article.title}</h3>
          <p>${article.description}</p>
        `;
        newsContainer.appendChild(articleElement);
      });
    }

    renderArticles(data.data.filter(article => article.category === 'top'));

    document.addEventListener('tabchange', (e) => {
      const filteredArticles = data.data.filter(article => article.category === e.detail.tabId);
      renderArticles(filteredArticles);
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Unable to fetch news articles</p>';
  }
}