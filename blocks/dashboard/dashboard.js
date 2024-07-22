export default function decorate(block) {
  const dashboardContainer = block.querySelector('.dashboard-container') || block;
  const jsonUrl = '/query-index.json';
  let mouseX = 0;
  let mouseY = 0;
  let activePopup = null;
  let data = null;

  // Fetch JSON data and create dashboard
  fetch(jsonUrl)
    .then(response => response.json())
    .then(jsonData => {
      console.log('Fetched data:', jsonData);
      data = jsonData.data;
      const dashboardElement = createDashboard(data);
      dashboardContainer.appendChild(dashboardElement);
      addEventListeners();
      handleResponsiveLayout();
    })
    .catch(error => console.error('Error fetching data:', error));

  function createDashboard(data) {
    console.log('Creating dashboard with data:', data);
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
      th.className = 'sortable';
      th.dataset.column = index;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(item => {
      const row = createTableRow(item);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
  }

  function createTableRow(item) {
    console.log('createTableRow item:', item);
    const row = document.createElement('tr');

    const titleCell = createCell(item.title, 'title-cell');
    const pathCell = createPathCell(item.path, item.image);
    const descriptionCell = createCell(item.description, 'description-cell');
    const lastModifiedCell = createDateCell(item.lastModified, 'last-modified-cell');
    const reviewDateCell = createDateCell(calculateReviewDate(item.lastModified), 'review-date-cell');
    const expiryDateCell = createDateCell(calculateExpiryDate(item.lastModified), 'expiry-date-cell');

    row.appendChild(titleCell);
    row.appendChild(pathCell);
    row.appendChild(descriptionCell);
    row.appendChild(lastModifiedCell);
    row.appendChild(reviewDateCell);
    row.appendChild(expiryDateCell);

    return row;
  }

  function createCell(text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    cell.className = className;
    return cell;
  }

  function createPathCell(path, image) {
    const cell = document.createElement('td');
    cell.className = 'path-cell';

    const link = document.createElement('a');
    link.href = path;
    link.className = 'path-link';
    link.textContent = path.length > 20 ? path.substring(0, 17) + '...' : path;
    link.title = path;

    if (image) {
      const popup = document.createElement('div');
      popup.className = 'image-popup';
      const img = document.createElement('img');
      img.src = image;
      img.alt = 'Preview';
      popup.appendChild(img);
      link.appendChild(popup);
    }

    cell.appendChild(link);
    return cell;
  }

  function createDateCell(date, className) {
    console.log('createDateCell input:', date, className);
    const cell = document.createElement('td');
    cell.className = `date-cell ${className}`;
    const formattedDate = typeof date === 'string' ? date : formatDate(parseDate(date));
    console.log('createDateCell formattedDate:', formattedDate);
    cell.textContent = formattedDate;
    if (formattedDate === 'Invalid Date') {
      cell.classList.add('red');
    }
    return cell;
  }

  function calculateReviewDate(lastModified) {
    console.log('calculateReviewDate input:', lastModified);
    if (!lastModified) {
      console.log('calculateReviewDate: lastModified is falsy');
      return 'Invalid Date';
    }
    const reviewPeriod = parseInt(window.siteConfig?.['$co:defaultreviewperiod']) || 180;
    console.log('Review period:', reviewPeriod);
    const lastModifiedDate = parseDate(lastModified);
    console.log('Parsed lastModifiedDate:', lastModifiedDate);
    if (!lastModifiedDate) {
      console.log('calculateReviewDate: lastModifiedDate is invalid');
      return 'Invalid Date';
    }
    const reviewDate = new Date(lastModifiedDate.getTime() + reviewPeriod * 24 * 60 * 60 * 1000);
    console.log('Calculated reviewDate:', reviewDate);
    const formattedReviewDate = formatDate(reviewDate);
    console.log('Formatted reviewDate:', formattedReviewDate);
    return formattedReviewDate;
  }

  function calculateExpiryDate(lastModified) {
    console.log('calculateExpiryDate input:', lastModified);
    if (!lastModified) {
      console.log('calculateExpiryDate: lastModified is falsy');
      return 'Invalid Date';
    }
    const expiryPeriod = parseInt(window.siteConfig?.['$co:defaultexpiryperiod']) || 365;
    console.log('Expiry period:', expiryPeriod);
    const lastModifiedDate = parseDate(lastModified);
    console.log('Parsed lastModifiedDate:', lastModifiedDate);
    if (!lastModifiedDate) {
      console.log('calculateExpiryDate: lastModifiedDate is invalid');
      return 'Invalid Date';
    }
    const expiryDate = new Date(lastModifiedDate.getTime() + expiryPeriod * 24 * 60 * 60 * 1000);
    console.log('Calculated expiryDate:', expiryDate);
    const formattedExpiryDate = formatDate(expiryDate);
    console.log('Formatted expiryDate:', formattedExpiryDate);
    return formattedExpiryDate;
  }

  function parseDate(dateString) {
    console.log('parseDate input:', dateString);
    if (dateString instanceof Date) {
      console.log('parseDate: input is already a Date object');
      return dateString;
    }
    const parsedDate = new Date(dateString);
    console.log('parseDate result:', parsedDate);
    if (isNaN(parsedDate.getTime())) {
      console.log('parseDate: parsed date is invalid');
      return null;
    }
    return parsedDate;
  }

  function formatDate(date) {
    console.log('formatDate input:', date);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.log('formatDate: invalid date');
      return 'Invalid Date';
    }
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    console.log('formatDate result:', formatted);
    return formatted;
  }

  function addEventListeners() {
    window.addEventListener('resize', handleResponsiveLayout);
    document.getElementById('status-filter').addEventListener('change', filterTable);
    document.addEventListener('mousemove', updateMousePosition);
    const pathLinks = document.querySelectorAll('.path-link');
    pathLinks.forEach(link => {
      link.addEventListener('mouseenter', showPopup);
      link.addEventListener('mouseleave', hidePopup);
    });
    const headers = document.querySelectorAll('.content-table th');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = parseInt(header.dataset.column);
        const isAscending = header.classList.contains('asc');
        sortTable(column, !isAscending);
      });
    });
  }

  function updateMousePosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (activePopup) {
      positionPopup(activePopup);
    }
  }

  function showPopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      activePopup = popup;
      popup.style.display = 'block';
      positionPopup(popup);
    }
  }

  function hidePopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      popup.style.display = 'none';
      activePopup = null;
    }
  }

  function positionPopup(popup) {
    const rect = popup.getBoundingClientRect();
    let left = mouseX + 10;
    let top = mouseY + 10;

    if (left + rect.width > window.innerWidth) {
      left = window.innerWidth - rect.width - 10;
    }
    if (top + rect.height > window.innerHeight) {
      top = window.innerHeight - rect.height - 10;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
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

  function sortTable(column, ascending) {
    const tbody = document.querySelector('.content-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aValue = a.children[column].textContent.trim();
      let bValue = b.children[column].textContent.trim();

      if (column >= 3) {  // Date columns
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (ascending) {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
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