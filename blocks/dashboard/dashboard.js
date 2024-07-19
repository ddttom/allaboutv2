/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
export default function decorate(block) {
    const dashboardContainer = document.querySelector('.dashboard-container');
    const jsonUrl = '/query-index.json';
  
    // Fetch JSON data and create dashboard
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        const dashboardElement = createDashboard(data);
        dashboardContainer.appendChild(dashboardElement);
      })
      .catch(error => console.error('Error fetching data:', error));
  
    function createDashboard(jsonData) {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  
      // Create the main container
      const dashboard = document.createElement('div');
      dashboard.className = 'dashboard';
  
      // Create and append the title
      const title = document.createElement('h1');
      title.textContent = 'Edge Delivery Services Content Dashboard';
      dashboard.appendChild(title);
  
      // Create the table
      const table = document.createElement('table');
      table.className = 'content-table';
  
      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Title', 'Path', 'Last Modified', 'Description'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
  
      // Create table body
      const tbody = document.createElement('tbody');
      data.data.forEach(item => {
        const row = createTableRow(item);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
  
      dashboard.appendChild(table);

      return dashboard;
    }
  
    function createTableRow(item) {
      const row = document.createElement('tr');
  
      const titleCell = document.createElement('td');
      titleCell.textContent = item.title;
  
      const pathCell = document.createElement('td');
      pathCell.textContent = item.path;
  
      const dateCell = document.createElement('td');
      dateCell.textContent = formatDate(item.lastModified);
  
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = item.description;
  
      row.appendChild(titleCell);
      row.appendChild(pathCell);
      row.appendChild(dateCell);
      row.appendChild(descriptionCell);
  
      return row;
    }
  
    function formatDate(timestamp) {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  

  }