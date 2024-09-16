export default async function decorate(block) {
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('tabs-container');
  block.appendChild(tabsContainer);

  const tabsData = [
    { id: 'top', label: 'Top Stories' },
    { id: 'world', label: 'World' },
    { id: 'business', label: 'Business' },
    { id: 'technology', label: 'Technology' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  tabsData.forEach((tab, index) => {
    const tabButton = document.createElement('button');
    tabButton.textContent = tab.label;
    tabButton.classList.add('tab-button');
    if (index === 0) tabButton.classList.add('active');
    tabButton.setAttribute('data-tab', tab.id);
    tabsContainer.appendChild(tabButton);
  });

  tabsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-button')) {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      const event = new CustomEvent('tabchange', { detail: { tabId: e.target.getAttribute('data-tab') } });
      document.dispatchEvent(event);
    }
  });
}