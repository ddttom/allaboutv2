export default async function decorate(block) {
    const blogListElement = document.querySelector('.bloglist');
    const url = '/query-index.json';

    if (blogListElement) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Filter the blog items based on the presence of "/blog/" in the path
            const filteredBlogItems = data.data.filter(item => item.path.includes('/blog/'));

            // Sort the filtered blog items by title
            const sortedBlogItems = filteredBlogItems.sort((a, b) => a.title.localeCompare(b.title));

            // Limit the sorted blog items to a maximum of 8
            const limitedBlogItems = sortedBlogItems.slice(0, 8);

            // Process the limited data and generate the content
            const content = generateContent(limitedBlogItems);

            blogListElement.innerHTML = content;
        } catch (error) {
            console.error('Error fetching the JSON data:', error);
        }
    } else {
        console.warn('Element with class "bloglist" not found in the DOM.');
    }
}

function generateContent(blogItems) {
    let content = '';

    blogItems.forEach(item => {
        const lastModifiedDate = new Date(item.lastModified * 1000);
        const formattedDate = formatDate(lastModifiedDate);

        content += `
            <div class="blog-item">
                <a href="${item.path}">
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p>Last Modified: ${formattedDate}</p>
                </a>
            </div>
        `;
    });

    return content;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function getMonthName(monthIndex) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[monthIndex];
}