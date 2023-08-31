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

function handlePageTransition() {
  // Items to be applied fade in/out
  const contents = document.querySelectorAll('.container > *:not(svg)');
  // Apply fade-out animation to the current container (needs a timeout/delay to ensure 2 second transition here)
  contents.forEach(item => {
    item.classList.add('fade-out')
  });
  // Needs to then remove the fade out effect after 2 seconds
  setTimeout(function() {
    contents.forEach(item => {
      item.classList.remove('fade-out')
    });
  }, 2000);
}

// MAIN FUNCTION
// Preload SVGs before setting up event listeners and animations
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container');
    const contents = document.querySelectorAll('.container > *:not(svg)');
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');

    contents.forEach(item => {
      item.classList.add('fade-in')
    });

    // Event listener and animation for links
    function handleLinkClick() {
      handlePageTransition();
    }

    // Event listener and animation for Home link
    home.addEventListener('click', function (event) {
      handleLinkClick();
    });

    // Event listeners and animations for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        handleLinkClick();
      });
    });

    // Event listener and animation for More link
    more.addEventListener('click', function (event) {
      handleLinkClick();
    });
  });
});