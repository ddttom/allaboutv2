const DASHBOARD_CONFIG = {
  JSON_URL: '/query-index.json',
  DASHBOARD_TITLE: 'Edge Delivery Services Content Dashboard',
  FILTER_LABEL: 'Filter by status: ',
  STATUS_OPTIONS: ['All', 'Green', 'Amber', 'Red'],
  TABLE_HEADERS: ['Title', 'Path', 'Description', 'Last Modified', 'Review', 'Expiry'],
  PATH_TRUNCATE_LENGTH: 20,
  PATH_TRUNCATE_SUFFIX: '...',
  REVIEW_PERIOD_FALLBACK: 300, // days
  EXPIRY_PERIOD_FALLBACK: 365, // days
  RESPONSIVE_BREAKPOINT: 1024, // px
  POPUP_OFFSET: 10, // px
  IMAGE_POPUP_MAX_SIZE: 300, // px
  ERROR_MESSAGE: 'Error fetching data',
};

export default function decorate(block) {
  const dashboardContainer = block;
  let mouseX = 0;
  let mouseY = 0;
  let activePopup = null;
  let data = null;

  // Fetch JSON data and create dashboard
  async function init() {
    try {
      const response = await fetch(DASHBOARD_CONFIG.JSON_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      data = jsonData.data;
      const dashboardElement = createDashboard(data);
      dashboardContainer.appendChild(dashboardElement);
      addEventListeners();
      handleResponsiveLayout();

      // Sort initially by Title
      sortTable(0, true);
      const firstHeader = block.querySelector('.content-table th[data-column="0"]');
      if (firstHeader) {
        firstHeader.classList.add('asc');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`${DASHBOARD_CONFIG.ERROR_MESSAGE}:`, error);
    }
  }

  init();

  function createDashboard(data) {
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    const title = document.createElement('h1');
    title.textContent = DASHBOARD_CONFIG.DASHBOARD_TITLE;
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
    label.textContent = DASHBOARD_CONFIG.FILTER_LABEL;
    filterContainer.appendChild(label);

    const select = document.createElement('select');
    select.id = 'status-filter';

    DASHBOARD_CONFIG.STATUS_OPTIONS.forEach(option => {
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
    DASHBOARD_CONFIG.TABLE_HEADERS.forEach((text, index) => {
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
    const row = document.createElement('tr');

    const titleCell = createCell(item.title, 'title-cell');
    const pathCell = createPathCell(item.path, item.image);
    const descriptionCell = createCell(item.description, 'description-cell');
    const lastModifiedCell = createDateCell(item.lastModified, 'last-modified-cell');
    const reviewDateCell = createDateCell(calculateReviewDate(item.lastModified), 'review-date-cell');
    const expiryDateCell = createDateCell(calculateExpiryDate(item.lastModified), 'expiry-date-cell');

    titleCell.setAttribute('data-label', 'Title');
    pathCell.setAttribute('data-label', 'Path');
    descriptionCell.setAttribute('data-label', 'Description');
    lastModifiedCell.setAttribute('data-label', 'Last Modified');
    reviewDateCell.setAttribute('data-label', 'Review');
    expiryDateCell.setAttribute('data-label', 'Expiry');

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
    const truncateLength = DASHBOARD_CONFIG.PATH_TRUNCATE_LENGTH;
    link.textContent = path.length > truncateLength
      ? path.substring(0, truncateLength - 3) + DASHBOARD_CONFIG.PATH_TRUNCATE_SUFFIX
      : path;
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
    const cell = document.createElement('td');
    cell.className = `date-cell ${className}`;
    const parsedDate = parseDate(date);
    const formattedDate = parsedDate ? formatDate(parsedDate) : 'Invalid Date';
    cell.textContent = formattedDate;
    
    if (formattedDate === 'Invalid Date') {
      cell.classList.add('red');
    } else if (className === 'review-date-cell' || className === 'expiry-date-cell') {
      const daysUntil = Math.ceil((parsedDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntil < 0) {
        cell.classList.add('red');
      } else if (daysUntil <= 30) {
        cell.classList.add('amber');
      } else {
        cell.classList.add('green');
      }
    }
    
    return cell;
  }

  function parseDate(dateInput) {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'number' || (typeof dateInput === 'string' && !isNaN(dateInput))) {
      const timestamp = typeof dateInput === 'string' ? parseInt(dateInput, 10) : dateInput;
      return new Date(timestamp * 1000);
    }
    const parsedDate = new Date(dateInput);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function calculateReviewDate(lastModified) {
    if (!lastModified) {
      return 'Invalid Date';
    }
    const reviewPeriod = parseInt(window.siteConfig?.['$co:defaultreviewperiod'], 10)
      || DASHBOARD_CONFIG.REVIEW_PERIOD_FALLBACK;
    const lastModifiedDate = parseDate(lastModified);
    if (!lastModifiedDate) {
      return 'Invalid Date';
    }
    return new Date(lastModifiedDate.getTime() + reviewPeriod * 24 * 60 * 60 * 1000);
  }

  function calculateExpiryDate(lastModified) {
    if (!lastModified) {
      return 'Invalid Date';
    }
    const expiryPeriod = parseInt(window.siteConfig?.['$co:defaultexpiryperiod'], 10)
      || DASHBOARD_CONFIG.EXPIRY_PERIOD_FALLBACK;
    const lastModifiedDate = parseDate(lastModified);
    if (!lastModifiedDate) {
      return 'Invalid Date';
    }
    return new Date(lastModifiedDate.getTime() + expiryPeriod * 24 * 60 * 60 * 1000);
  }

  function addEventListeners() {
    window.addEventListener('resize', handleResponsiveLayout);
    const statusFilter = block.querySelector('#status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', filterTable);
    }
    document.addEventListener('mousemove', updateMousePosition);
    const pathLinks = block.querySelectorAll('.path-link');
    pathLinks.forEach(link => {
      link.addEventListener('mouseenter', showPopup);
      link.addEventListener('mouseleave', hidePopup);
    });
    const headers = block.querySelectorAll('.content-table th');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = parseInt(header.dataset.column, 10);
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
      popup.classList.add('visible');
      positionPopup(popup);
    }
  }

  function hidePopup(event) {
    const popup = event.currentTarget.querySelector('.image-popup');
    if (popup) {
      popup.classList.remove('visible');
      activePopup = null;
    }
  }

  function positionPopup(popup) {
    const rect = popup.getBoundingClientRect();
    const offset = DASHBOARD_CONFIG.POPUP_OFFSET;
    let left = mouseX + offset;
    let top = mouseY + offset;

    if (left + rect.width > window.innerWidth) {
      left = window.innerWidth - rect.width - offset;
    }
    if (top + rect.height > window.innerHeight) {
      top = window.innerHeight - rect.height - offset;
    }

    popup.style.setProperty('--popup-left', `${left}px`);
    popup.style.setProperty('--popup-top', `${top}px`);
  }

  function handleResponsiveLayout() {
    const dashboard = block.querySelector('.dashboard');
    const table = block.querySelector('.content-table');
    if (window.innerWidth < DASHBOARD_CONFIG.RESPONSIVE_BREAKPOINT) {
      if (dashboard) dashboard.classList.add('card-view');
      if (table) table.classList.add('card-layout');
    } else {
      if (dashboard) dashboard.classList.remove('card-view');
      if (table) table.classList.remove('card-layout');
    }
  }

  function filterTable() {
    const statusFilter = block.querySelector('#status-filter');
    if (!statusFilter) return;

    const filterValue = statusFilter.value;
    const rows = block.querySelectorAll('.content-table tbody tr');
    rows.forEach(row => {
      const reviewDateCell = row.querySelector('.review-date-cell');
      const expiryDateCell = row.querySelector('.expiry-date-cell');
      const showRow = filterValue === 'all'
        || (filterValue === 'green' && reviewDateCell.classList.contains('green') && expiryDateCell.classList.contains('green'))
        || (filterValue === 'amber' && (reviewDateCell.classList.contains('amber') || expiryDateCell.classList.contains('amber')))
        || (filterValue === 'red' && (reviewDateCell.classList.contains('red') || expiryDateCell.classList.contains('red')));

      if (showRow) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }

  function sortTable(column, ascending) {
    const tbody = block.querySelector('.content-table tbody');
    if (!tbody) return;

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
      }
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    const headers = block.querySelectorAll('.content-table th');
    headers.forEach(header => {
      header.classList.remove('asc', 'desc');
    });
    const sortedHeader = block.querySelector(`.content-table th[data-column="${column}"]`);
    if (sortedHeader) {
      sortedHeader.classList.add(ascending ? 'asc' : 'desc');
    }
  }
}