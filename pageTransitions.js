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
  const container = document.querySelector('.container');
  const contents = container.querySelectorAll('*:not(svg)');

  container.classList.add('fade-out'); // Add fade-out class to trigger fade-out animation

  setTimeout(function () {
    // Remove fade-out class after animation duration
    container.classList.remove('fade-out');
    contents.forEach(content => {
      content.style.opacity = '0';
    });
    // Move to next page
    window.location.href = destinationURL;
  }, 2000); // 2 seconds
}
// MAIN PAGE LISTENER
// Preload SVGs before setting up link event listeners
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading background SVG's
  document.addEventListener('DOMContentLoaded', function () {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');

    const container = document.querySelector('.container');
    const contents = container.querySelectorAll('*:not(svg)');

    // Add fade-in class to trigger fade-in animation
    container.classList.add('fade-in');

    // Remove fade-in class after animation duration
    setTimeout(function () {
      container.classList.remove('fade-in');

      // Set opacity back to 1 for all contents
      contents.forEach(content => {
        content.style.opacity = '1';
      });
    }, 2000); // 2 seconds

    // Event listener and animation for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = home.getAttribute('href');
      handlePageTransition(destinationURL);
    });

    // Event listeners and animations for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const destinationURL = link.getAttribute('href');
        handlePageTransition(destinationURL);
      });
    });

    // Event listener and animation for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = more.getAttribute('href');
      handlePageTransition(destinationURL);
    });
  });
});