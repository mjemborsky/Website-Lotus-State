// Preload SVGs for Background
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg',
  'backgroundThree.svg',
  'backgroundFour.svg'
];
// Preload SVGs
async function preloadSVGs(urls) {
  try {
    for (const url of urls) {
      const cachedSVG = sessionStorage.getItem(url);
      if (!cachedSVG) {
        const response = await fetch(url);
        const svgContent = await response.text();
        sessionStorage.setItem(url, svgContent); // Cache the SVG content in SessionStorage
      }
    }
  } catch (error) {
    console.error('Error preloading SVG:', error);
  }
}
// Get stored SVG from SessionStorage
function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}
// Handle page transition including fade and call to translate circles
function handlePageTransition(destinationURL) {
  const content = document.querySelector('.fade-target');
  content.classList.add('fade-out'); // Add fade-out class to trigger fade-out animation
  // Fetch the new page content using AJAX
  fetch(destinationURL)
    .then(response => response.text())
    .then(nextPage => {
      setTimeout(function () {
        // Remove fade-out class after animation duration
        content.classList.remove('fade-out');
        content.style.opacity = '0';
        // Replace the container content with the new page content
        container.innerHTML = nextPage;
        const newContent = container.querySelector('.fade-target');
        // Apply fade-in animation to the new content
        newContent.classList.add('fade-in');
        setTimeout(function () {
          // Set opacity back to 1 for all contents
          newContent.classList.remove('fade-in');
          newContent.style.opacity = '1';
        }, 2000); // 2 seconds for fade-in
      }, 2000); // 2 seconds for fade-out
    })
    .catch(error => {
      console.error('Error loading page:', error);
    })
    .finally(() => {
      // Move to next page
      window.location.href = destinationURL;
    });
}
// MAIN PAGE LISTENER
// Preload SVGs before setting up link event listeners
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading background SVG's
  document.addEventListener('DOMContentLoaded', function () {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');
    const content = document.querySelector('.fade-target');

    // Add fade-in class to trigger fade-in animation
    content.classList.add('fade-in');
    // Remove fade-in class after animation duration
    setTimeout(function () {
      content.classList.remove('fade-in');
      content.style.opacity = '1';
    }, 2000); // 2 seconds

    // Event listener for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = home.getAttribute('href');
      handlePageTransition(destinationURL);
    });
    // Event listeners for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const destinationURL = link.getAttribute('href');
        handlePageTransition(destinationURL);
      });
    });
    // Event listener for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = more.getAttribute('href');
      handlePageTransition(destinationURL);
    });
  });
});