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
      addPopupListeners();
    })
    .catch(error => console.error('Error fetching data:', error));

  function createDashboard(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Sort data by title
    data.data.sort((a, b) => a.title.localeCompare(b.title));

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
    ['Title', 'Path', 'Description', 'Last Modified', 'Review Date', 'Expiry Date'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      if (headerText === 'Last Modified' || headerText === 'Review Date' || headerText === 'Expiry Date') {
        th.className = 'date-column';
      }
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
    const pathLink = document.createElement('a');
    pathLink.href = item.path;
    pathLink.textContent = item.path.substring(0, 20) + (item.path.length > 20 ? '...' : '');
    pathLink.title = item.path;  // Full path as tooltip
    pathLink.className = 'path-link';
    
    if (item.image) {
      const imagePopup = document.createElement('div');
      imagePopup.className = 'image-popup';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      imagePopup.appendChild(image);
      pathLink.appendChild(imagePopup);
    }
    
    pathCell.appendChild(pathLink);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = item.description;

    const lastModifiedCell = document.createElement('td');
    lastModifiedCell.className = 'date-column';
    lastModifiedCell.textContent = formatDate(item.lastModified);

    const reviewDateCell = createReviewDateCell(item.lastModified);
    const expiryDateCell = createExpiryDateCell(item.lastModified);

    row.appendChild(titleCell);
    row.appendChild(pathCell);
    row.appendChild(descriptionCell);
    row.appendChild(lastModifiedCell);
    row.appendChild(reviewDateCell);
    row.appendChild(expiryDateCell);

    return row;
  }

  function formatDate(timestamp) {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function createReviewDateCell(lastModified) {
    const cell = document.createElement('td');
    cell.className = 'date-column';
    
    const lastModifiedDate = new Date(parseInt(lastModified) * 1000);
    const reviewDate = new Date(lastModifiedDate.getTime() + window.siteConfig['$co:defaultreviewperiod'] * 24 * 60 * 60 * 1000);
    
    cell.textContent = formatDate(reviewDate.getTime() / 1000);
    
    const today = new Date();
    const daysUntilReview = Math.ceil((reviewDate - today) / (24 * 60 * 60 * 1000));
    
    cell.style.backgroundColor = getColorForDays(daysUntilReview);
    
    return cell;
  }

  function createExpiryDateCell(lastModified) {
    const cell = document.createElement('td');
    cell.className = 'date-column';
    
    const lastModifiedDate = new Date(parseInt(lastModified) * 1000);
    const expiryDate = new Date(lastModifiedDate.getTime() + window.siteConfig['$co:defaultexpiryperiod'] * 24 * 60 * 60 * 1000);
    
    cell.textContent = formatDate(expiryDate.getTime() / 1000);
    
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (24 * 60 * 60 * 1000));
    
    cell.style.backgroundColor = getColorForDays(daysUntilExpiry);
    
    return cell;
  }

  function getColorForDays(days) {
    if (days < 0) {
      return 'red';
    } else if (days <= 30) {
      return 'amber';
    } else {
      return 'green';
    }
  }

  function addPopupListeners() {
    const pathLinks = document.querySelectorAll('.path-link');
    pathLinks.forEach(link => {
      link.addEventListener('mousemove', positionPopup);
      link.addEventListener('mouseleave', hidePopup);
    });
  }

  function positionPopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      const rect = event.currentTarget.getBoundingClientRect();
      popup.style.display = 'block';
      popup.style.left = `${event.clientX + 10}px`;
      popup.style.top = `${event.clientY + 10}px`;
    }
  }

  function hidePopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }
}