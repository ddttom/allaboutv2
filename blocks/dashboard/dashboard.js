/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
export default function decorate(block) {
  const dashboardContainer = document.querySelector('.dashboard-container');
  const jsonUrl = '/query-index.json';
  let mouseX = 0;
  let mouseY = 0;

  // Fetch JSON data and create dashboard
  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      const dashboardElement = createDashboard(data);
      dashboardContainer.appendChild(dashboardElement);
      addPopupListeners();
      addSortListeners();
      // Indicate initial sort
      const titleHeader = document.querySelector('.content-table th[data-column="0"]');
      titleHeader.classList.add('asc');
    })
    .catch(error => console.error('Error fetching data:', error));

  function createDashboard(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Sort data by title initially
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
    ['Title', 'Path', 'Description', 'Last Modified', 'Review Date', 'Expiry Date'].forEach((headerText, index) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      th.className = 'sortable';
      th.dataset.column = index;
      if (headerText === 'Last Modified' || headerText === 'Review Date' || headerText === 'Expiry Date') {
        th.classList.add('date-column');
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
    lastModifiedCell.dataset.timestamp = item.lastModified;

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
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function createReviewDateCell(lastModified) {
    const cell = document.createElement('td');
    cell.className = 'date-column';
    
    const lastModifiedDate = new Date(lastModified * 1000);
    const reviewPeriod = parseInt(window.siteConfig['$co:defaultreviewperiod']) || 0;
    const reviewDate = new Date(lastModifiedDate.getTime() + reviewPeriod * 24 * 60 * 60 * 1000);
    
    cell.textContent = formatDate(reviewDate.getTime() / 1000);
    cell.dataset.timestamp = reviewDate.getTime() / 1000;
    
    const today = new Date();
    const daysUntilReview = Math.ceil((reviewDate - today) / (24 * 60 * 60 * 1000));
    
    cell.style.backgroundColor = getColorForDays(daysUntilReview);
    
    return cell;
  }

  function createExpiryDateCell(lastModified) {
    const cell = document.createElement('td');
    cell.className = 'date-column';
    
    const lastModifiedDate = new Date(lastModified * 1000);
    const expiryPeriod = parseInt(window.siteConfig['$co:defaultexpiryperiod']) || 0;
    const expiryDate = new Date(lastModifiedDate.getTime() + expiryPeriod * 24 * 60 * 60 * 1000);
    
    cell.textContent = formatDate(expiryDate.getTime() / 1000);
    cell.dataset.timestamp = expiryDate.getTime() / 1000;
    
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (24 * 60 * 60 * 1000));
    
    cell.style.backgroundColor = getColorForDays(daysUntilExpiry);
    
    return cell;
  }

  function getColorForDays(days) {
    if (days < 0) {
      return 'red';
    } else if (days <= 30) {
      return 'orange';
    } else {
      return 'green';
    }
  }

  function addPopupListeners() {
    const pathLinks = document.querySelectorAll('.path-link');
    pathLinks.forEach(link => {
      link.addEventListener('mouseenter', showPopup);
      link.addEventListener('mouseleave', hidePopup);
      link.addEventListener('mousemove', updateMousePosition);
    });
    document.addEventListener('scroll', updatePopupPositions);
  }

  function updateMousePosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    positionPopup(event.currentTarget);
  }

  function showPopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      popup.style.display = 'block';
      positionPopup(event.currentTarget);
    }
  }

  function hidePopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  function positionPopup(link) {
    const popup = link.querySelector('.image-popup');
    if (popup) {
      const rect = link.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Position the popup above the mouse cursor
      let left = mouseX + scrollX + 10; // 10px to the right of the cursor
      let top = mouseY + scrollY - 10 - popup.offsetHeight; // 10px above the cursor

      // Ensure the popup doesn't go off-screen
      if (left + popup.offsetWidth > window.innerWidth + scrollX) {
        left = window.innerWidth + scrollX - popup.offsetWidth - 10;
      }
      if (top < scrollY) {
        top = mouseY + scrollY + 20; // 20px below the cursor if it would go above the viewport
      }

      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    }
  }

  function updatePopupPositions() {
    const visiblePopups = document.querySelectorAll('.image-popup[style*="display: block"]');
    visiblePopups.forEach(popup => {
      const link = popup.closest('.path-link');
      if (link) {
        positionPopup(link);
      }
    });
  }

  function addSortListeners() {
    const headers = document.querySelectorAll('.content-table th');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.column;
        const isAscending = header.classList.contains('asc');
        sortTable(column, !isAscending);
      });
    });
  }

  function sortTable(column, ascending) {
    const tbody = document.querySelector('.content-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aValue = a.children[column].textContent.trim();
      let bValue = b.children[column].textContent.trim();

      if (column >= 3) {  // Date columns
        aValue = a.children[column].dataset.timestamp;
        bValue = b.children[column].dataset.timestamp;
      }

      if (ascending) {
        return aValue.localeCompare(bValue, undefined, {numeric: true, sensitivity: 'base'});
      } else {
        return bValue.localeCompare(aValue, undefined, {numeric: true, sensitivity: 'base'});
      }
    });

    // Clear the table
    tbody.innerHTML = '';

    // Add sorted rows
    rows.forEach(row => tbody.appendChild(row));

    // Update sort indicators
    const headers = document.querySelectorAll('.content-table th');
    headers.forEach(header => {
      header.classList.remove('asc', 'desc');
    });
    const sortedHeader = document.querySelector(`.content-table th[data-column="${column}"]`);
    sortedHeader.classList.add(ascending ? 'asc' : 'desc');
  }
}