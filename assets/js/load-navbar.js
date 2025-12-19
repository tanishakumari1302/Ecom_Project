/**
 * Load navbar from navbar.html and insert it into the page
 */
async function loadNavbar() {
  try {
    const response = await fetch('./navbar.html');
    if (!response.ok) {
      throw new Error('Failed to load navbar');
    }
    const navbarHtml = await response.text();
    
    // Find the placeholder or insert before body content
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = navbarHtml;
    } else {
      // Insert at the beginning of body if no placeholder found
      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', navbarHtml);
      }
    }
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  loadNavbar();
}

