
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

// Preload SVGs for Background
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg',
  'backgroundThree.svg',
  'backgroundFour.svg'
];

// Handle page transition animations
function handlePageTransition(targetBackgroundUrl) {
  // Get the target SVG and circles
  const targetBackground = getStoredSVG(targetBackgroundUrl);
  const targetCircles = targetBackground.querySelectorAll('circle');

  // Remove the fade class to trigger the fade-out animation (duration 2 seconds)
  container.classList.remove('fade');

  // Listen for the 'transitionend' event on the container element
  container.addEventListener('transitionend', function handleTransitionEnd() {
    // Once the fade-out animation is complete, set the new background and circles
    container.innerHTML = ''; // Clear the container
    container.appendChild(targetBackground.cloneNode(true)); // Add the new background
    container.classList.add('fade'); // Add the fade class to trigger the fade-in animation

    // Remove the transitionend event listener
    container.removeEventListener('transitionend', handleTransitionEnd);
  });
}


// Preload SVGs before setting up event listeners and animations
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading
  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.container');
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');

    container.classList.add('fade');

    // Event listener and animation for links
    function handleLinkClick(targetBackgroundUrl) {
      handlePageTransition(targetBackgroundUrl);
    }

    // Event listener and animation for Home link
    home.addEventListener('click', function (event) {
      handleLinkClick('backgroundOne.svg');
    });

    // Event listeners and animations for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        handleLinkClick('backgroundTwo.svg');
      });
    });

    // Event listener and animation for More link
    more.addEventListener('click', function (event) {
      handleLinkClick('backgroundFive.svg');
    });
  });
});