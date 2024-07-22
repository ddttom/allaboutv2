export default function decorate(block) {
  const dashboardContainer = block.querySelector('.dashboard-container') || block;
  const jsonUrl = '/query-index.json';

  // Fetch JSON data and create dashboard
  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      const dashboardElement = createDashboard(data);
      dashboardContainer.appendChild(dashboardElement);
      addEventListeners();
      handleResponsiveLayout();
    })
    .catch(error => console.error('Error fetching data:', error));

  function createDashboard(data) {
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    const title = document.createElement('h1');
    title.textContent = 'Edge Delivery Services Content Dashboard';
    dashboard.appendChild(title);

    const filter = createFilter();
    dashboard.appendChild(filter);

    const table = createTable(data);
    dashboard.appendChild(table);

    return dashboard;
  }

  function createFilter() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';

    const label = document.createElement('label');
    label.textContent = 'Filter by status: ';
    filterContainer.appendChild(label);

    const select = document.createElement('select');
    select.id = 'status-filter';
    
    ['All', 'Green', 'Amber', 'Red'].forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    filterContainer.appendChild(select);
    return filterContainer;
  }

  function createTable(data) {
    const table = document.createElement('table');
    table.className = 'content-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Title', 'Path', 'Description', 'Last Modified', 'Review Date', 'Expiry Date'].forEach((text, index) => {
      const th = document.createElement('th');
      th.textContent = text;
      th.dataset.column = index;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.data.forEach(item => {
      const row = createTableRow(item);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
  }

  function createTableRow(item) {
    const row = document.createElement('tr');

    const cells = [
      { text: item.title, class: 'title-cell' },
      { text: item.path, class: 'path-cell' },
      { text: item.description, class: 'description-cell' },
      { text: formatDate(item.lastModified), class: 'date-cell last-modified-cell' },
      { text: calculateReviewDate(item.lastModified), class: 'date-cell review-date-cell' },
      { text: calculateExpiryDate(item.lastModified), class: 'date-cell expiry-date-cell' }
    ];

    cells.forEach(cellData => {
      const td = document.createElement('td');
      td.textContent = cellData.text;
      td.className = cellData.class;
      if (cellData.text === 'Invalid Date') {
        td.classList.add('red');
      }
      row.appendChild(td);
    });

    return row;
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'Invalid Date';
    const date = new Date(timestamp * 1000);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function calculateReviewDate(lastModified) {
    if (!lastModified) return 'Invalid Date';
    const reviewPeriod = parseInt(window.siteConfig?.['$co:defaultreviewperiod']) || 180; // Default to 180 days if not set
    const reviewDate = new Date((lastModified + reviewPeriod * 24 * 60 * 60) * 1000);
    return isNaN(reviewDate.getTime()) ? 'Invalid Date' : formatDate(reviewDate.getTime() / 1000);
  }

  function calculateExpiryDate(lastModified) {
    if (!lastModified) return 'Invalid Date';
    const expiryPeriod = parseInt(window.siteConfig?.['$co:defaultexpiryperiod']) || 365; // Default to 365 days if not set
    const expiryDate = new Date((lastModified + expiryPeriod * 24 * 60 * 60) * 1000);
    return isNaN(expiryDate.getTime()) ? 'Invalid Date' : formatDate(expiryDate.getTime() / 1000);
  }

  function addEventListeners() {
    window.addEventListener('resize', handleResponsiveLayout);
    document.getElementById('status-filter').addEventListener('change', filterTable);
  }

  function handleResponsiveLayout() {
    const dashboard = document.querySelector('.dashboard');
    const table = document.querySelector('.content-table');
    if (window.innerWidth < 1024) {
      dashboard.classList.add('card-view');
      table.classList.add('card-layout');
    } else {
      dashboard.classList.remove('card-view');
      table.classList.remove('card-layout');
    }
  }

  function filterTable() {
    const filterValue = document.getElementById('status-filter').value;
    const rows = document.querySelectorAll('.content-table tbody tr');
    rows.forEach(row => {
      const reviewDateCell = row.querySelector('.review-date-cell');
      const expiryDateCell = row.querySelector('.expiry-date-cell');
      const showRow = filterValue === 'all' || 
                      (filterValue === 'green' && !reviewDateCell.classList.contains('red') && !expiryDateCell.classList.contains('red')) ||
                      (filterValue === 'amber' && (reviewDateCell.classList.contains('amber') || expiryDateCell.classList.contains('amber'))) ||
                      (filterValue === 'red' && (reviewDateCell.classList.contains('red') || expiryDateCell.classList.contains('red')));
      row.style.display = showRow ? '' : 'none';
    });
  }
}