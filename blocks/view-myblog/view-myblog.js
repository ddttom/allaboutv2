/**
 * View MyBlog Block
 * Fetches and displays blog content from my-blog.json
 * Features:
 * - Auto-generates latestPosts if not provided (top 3 most recent non-index posts)
 * - Single category mode: hides Latest Posts and Category Map when only one category
 * - Filters out index pages (URLs ending with /, /index, /index.html, /index.htm)
 * - Hides empty category sections
 * - Shows category map only when there are multiple active categories
 */

/**
 * Check if a URL is an index page
 */
function isIndexPage(url) {
  // Normalize URL to handle both relative and absolute URLs
  const urlPath = url.toLowerCase();

  // Check for paths ending with /
  if (urlPath.endsWith('/')) {
    return true;
  }

  // Check for paths ending with /index
  if (urlPath.endsWith('/index')) {
    return true;
  }

  // Check for paths ending with /index.html or /index.htm
  if (urlPath.endsWith('/index.html') || urlPath.endsWith('/index.htm')) {
    return true;
  }

  return false;
}

/**
 * Generate latestPosts from categories if not provided
 * Collects all posts from all categories, filters index pages,
 * sorts by lastModified (newest first), and returns top 3
 */
function generateLatestPosts(categories) {
  const allPosts = [];

  // Collect all posts from all categories
  if (categories) {
    categories.forEach((category) => {
      if (category.posts) {
        category.posts.forEach((post) => {
          // Filter out index pages
          if (!isIndexPage(post.url)) {
            allPosts.push(post);
          }
        });
      }
    });
  }

  // Sort by lastModified date (newest first)
  allPosts.sort((a, b) => {
    const dateA = new Date(a.lastModified || '1970-01-01');
    const dateB = new Date(b.lastModified || '1970-01-01');
    return dateB - dateA;
  });

  // Return top 3 most recent posts
  return allPosts.slice(0, 3);
}

/**
 * Create a blog entry article
 */
function createBlogEntry(entry, isLast = false) {
  const article = document.createElement('article');
  article.className = 'view-myblog-entry';
  if (isLast) {
    article.classList.add('view-myblog-entry--last');
  }

  const title = document.createElement('h3');
  title.className = 'view-myblog-entry-title';

  const link = document.createElement('a');
  link.href = entry.url;
  link.textContent = entry.title;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  title.appendChild(link);

  const description = document.createElement('p');
  description.className = 'view-myblog-entry-description';
  description.textContent = entry.description;

  article.appendChild(title);
  article.appendChild(description);

  return article;
}

/**
 * Create a featured section (Latest Posts or Most Visited)
 */
function createFeaturedSection(title, posts, type = 'latest') {
  const section = document.createElement('section');
  section.className = `view-myblog-section view-myblog-section--${type}`;

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'view-myblog-section-title';
  sectionTitle.textContent = title;

  section.appendChild(sectionTitle);

  posts.forEach((post, index) => {
    const isLast = index === posts.length - 1;
    section.appendChild(createBlogEntry(post, isLast));
  });

  return section;
}

/**
 * Create the category map table
 */
function createCategoryMap(categories) {
  const nav = document.createElement('nav');
  nav.className = 'view-myblog-category-map';
  nav.setAttribute('aria-label', 'Category navigation');

  const heading = document.createElement('h2');
  heading.className = 'view-myblog-category-map-title';
  heading.textContent = 'Category Map, click one to jump';

  const table = document.createElement('table');
  table.className = 'view-myblog-category-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Category</th>
      <th>Articles</th>
      <th>Focus Area</th>
    </tr>
  `;

  const tbody = document.createElement('tbody');
  categories.forEach((category, index) => {
    const tr = document.createElement('tr');
    if (index < categories.length - 1) {
      tr.classList.add('view-myblog-category-row--bordered');
    }

    tr.innerHTML = `
      <td><a href="#${category.id}">${category.name}</a></td>
      <td class="view-myblog-category-count">${category.count}</td>
      <td class="view-myblog-category-description">${category.description}</td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  nav.appendChild(heading);
  nav.appendChild(table);

  return nav;
}

/**
 * Create a category section with blog posts
 */
function createCategorySection(category) {
  const section = document.createElement('section');
  section.className = 'view-myblog-section';
  section.id = category.id;

  const title = document.createElement('h2');
  title.className = 'view-myblog-section-title';
  title.textContent = category.name;

  section.appendChild(title);

  // Handle Additional Resources differently (it has links instead of posts)
  if (category.links) {
    const quickLinksDiv = document.createElement('div');
    quickLinksDiv.style.marginBottom = '2rem';

    const quickLinksTitle = document.createElement('h3');
    quickLinksTitle.style.color = '#667eea';
    quickLinksTitle.style.fontSize = '1.1rem';
    quickLinksTitle.style.marginBottom = '1rem';
    quickLinksTitle.textContent = 'Quick Links & Publications';

    const linksList = document.createElement('ul');
    linksList.style.listStyle = 'none';
    linksList.style.paddingLeft = '0';

    category.links.forEach((link) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';

      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.title;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.color = '#667eea';
      a.style.textDecoration = 'none';
      a.style.transition = 'color 0.3s ease';
      a.addEventListener('mouseenter', () => {
        a.style.color = '#764ba2';
      });
      a.addEventListener('mouseleave', () => {
        a.style.color = '#667eea';
      });

      li.appendChild(a);
      linksList.appendChild(li);
    });

    quickLinksDiv.appendChild(quickLinksTitle);
    quickLinksDiv.appendChild(linksList);
    section.appendChild(quickLinksDiv);
  } else if (category.posts) {
    // Regular category with blog posts
    // Sort posts based on sortOrder metadata
    const posts = [...category.posts];
    if (category.sortOrder === 'oldest-first') {
      // Sort by lastModified date ascending (oldest first)
      posts.sort((a, b) => {
        const dateA = new Date(a.lastModified || '1970-01-01');
        const dateB = new Date(b.lastModified || '1970-01-01');
        return dateA - dateB;
      });
    }
    // Default is newest-first (no sorting needed as JSON is already in that order)

    posts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'view-myblog-entry';

      const postTitle = document.createElement('h3');
      postTitle.className = 'view-myblog-entry-title';

      const link = document.createElement('a');
      link.href = post.url;
      link.textContent = post.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      postTitle.appendChild(link);

      const description = document.createElement('p');
      description.className = 'view-myblog-entry-description';
      description.textContent = post.description;

      article.appendChild(postTitle);
      article.appendChild(description);

      if (post.lastModified) {
        const meta = document.createElement('p');
        meta.className = 'view-myblog-entry-meta';
        meta.textContent = `Last Modified: ${post.lastModified}`;
        article.appendChild(meta);
      }

      section.appendChild(article);
    });
  }

  return section;
}

/**
 * Main decorate function
 */
export default async function decorate(block) {
  // Get data URL from block content or use default
  const blockContent = block.textContent.trim();
  const dataUrl = blockContent || '/my-blog.json';

  // Clear the block content (the parameter)
  block.textContent = '';

  // Configuration
  const config = {
    dataUrl,
    errorMessage: 'Unable to load blog content. Please try again later.',
  };

  try {
    // Show loading state
    block.innerHTML = '<p class="view-myblog-loading">Loading blog content...</p>';

    // Fetch blog data
    const response = await fetch(config.dataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Auto-generate latestPosts if not provided
    if (!data.latestPosts || data.latestPosts.length === 0) {
      data.latestPosts = generateLatestPosts(data.categories);
    }

    // Count active categories (categories with posts after index page filtering)
    let activeCategoryCount = 0;
    if (data.categories) {
      data.categories.forEach((category) => {
        if (category.posts) {
          const nonIndexPosts = category.posts.filter((post) => !isIndexPage(post.url));
          if (nonIndexPosts.length > 0) {
            activeCategoryCount += 1;
          }
        } else if (category.links) {
          // Additional Resources section counts as active
          activeCategoryCount += 1;
        }
      });
    }

    // Clear the block
    block.textContent = '';

    // Create main container
    const container = document.createElement('div');
    container.className = 'view-myblog-content';

    // Add featured sections container
    const featuredContainer = document.createElement('div');
    featuredContainer.className = 'view-myblog-featured';

    // Add Latest Posts section only if there are multiple active categories
    if (activeCategoryCount > 1 && data.latestPosts && data.latestPosts.length > 0) {
      const filteredLatest = data.latestPosts.filter((post) => !isIndexPage(post.url));
      if (filteredLatest.length > 0) {
        featuredContainer.appendChild(
          createFeaturedSection('Latest Posts', filteredLatest, 'latest'),
        );
      }
    }

    // Add Most Visited section (filter out index pages)
    if (data.mostVisited && data.mostVisited.length > 0) {
      const filteredVisited = data.mostVisited.filter((post) => !isIndexPage(post.url));
      if (filteredVisited.length > 0) {
        featuredContainer.appendChild(
          createFeaturedSection('Most Visited', filteredVisited, 'popular'),
        );
      }
    }

    container.appendChild(featuredContainer);

    // Add Category Map (recalculate counts, filter empty categories, only show if > 1 active)
    if (data.categoryMap && data.categoryMap.length > 1) {
      // Filter out categories that would have 0 posts after index page filtering
      const activeCategoryMap = data.categoryMap.map((cat) => {
        // Find matching category to check actual post count
        const matchingCategory = data.categories?.find((c) => c.id === cat.id);
        if (matchingCategory?.posts) {
          const filteredCount = matchingCategory.posts.filter((post) => !isIndexPage(post.url)).length;
          return { ...cat, count: filteredCount };
        }
        return cat;
      }).filter((cat) => cat.count > 0); // Remove categories with 0 posts

      // Only show map if there's still more than one active category
      if (activeCategoryMap.length > 1) {
        container.appendChild(createCategoryMap(activeCategoryMap));
      }
    }

    // Add category sections with blog posts (filter index pages and hide empty categories)
    if (data.categories && data.categories.length > 0) {
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'view-myblog-categories';

      data.categories.forEach((category) => {
        // Filter out index pages from category posts
        if (category.posts) {
          const filteredPosts = category.posts.filter((post) => !isIndexPage(post.url));

          // Only render category section if it has posts after filtering
          if (filteredPosts.length > 0) {
            const filteredCategory = { ...category, posts: filteredPosts };
            categoriesContainer.appendChild(createCategorySection(filteredCategory));
          }
        } else if (category.links) {
          // Additional Resources section - render as-is
          categoriesContainer.appendChild(createCategorySection(category));
        }
      });

      // Only append categories container if it has children
      if (categoriesContainer.children.length > 0) {
        container.appendChild(categoriesContainer);
      }
    }

    // Append to block
    block.appendChild(container);
  } catch (error) {
    console.error('View MyBlog block failed:', error);
    block.innerHTML = `<p class="view-myblog-error">${config.errorMessage}</p>`;
  }
}
