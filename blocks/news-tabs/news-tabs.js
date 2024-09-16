export default async function decorate(block) {
  const tabsData = '/news-tabs.json';
  const container = document.createElement('div');
  block.appendChild(container);

  try {
    const response = await fetch(tabsData);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const tabsHtml = data.data.map((tab, index) => `
      <button class="tab ${index === 0 ? 'active' : ''}" data-category="${tab.category}">
        ${tab.category}
      </button>
    `).join('');

    container.innerHTML = `<div class="tabs-container">${tabsHtml}</div>`;

    container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Trigger event for news articles block to update
        const event = new CustomEvent('tabChanged', { detail: tab.dataset.category });
        document.dispatchEvent(event);
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    container.innerHTML = '<p>Error loading news categories</p>';
  }
}