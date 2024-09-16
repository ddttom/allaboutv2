export default async function decorate(block) {
  const newsData = '/news-articles.json';
  const container = document.createElement('div');
  block.appendChild(container);

  async function fetchAndRenderNews(category = 'all') {
    try {
      const response = await fetch(newsData);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const filteredArticles = category === 'all' 
        ? data.data 
        : data.data.filter(article => article.category === category);

      const articlesHtml = filteredArticles.map(article => `
        <div class="news-article">
          <img src="${article.image}" alt="${article.title}">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
        </div>
      `).join('');

      container.innerHTML = articlesHtml;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', error);
      container.innerHTML = '<p>Error loading news articles</p>';
    }
  }

  // Initial load
  await fetchAndRenderNews();

  // Listen for tab changes
  document.addEventListener('tabChanged', (event) => {
    fetchAndRenderNews(event.detail);
  });
}