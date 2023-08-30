
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

// Assuming you have a function to handle page transitions
function handlePageTransition(targetPage) {
  // Apply fade-out animation to the current container
  const currentContainer = document.querySelector('.container');
  currentContainer.classList.add('fade-out');
  
  // Listen for the animationend event to trigger page navigation
  currentContainer.addEventListener('animationend', function() {
    // Remove the animation class
    currentContainer.classList.remove('fade-out');

    // Navigate to the target page after a delay
    setTimeout(function() {
      window.location.href = targetPage;

      // Apply fade-in animation to the next container after another delay
      setTimeout(function() {
        const futureContainer = document.querySelector('.next-container');
        futureContainer.classList.add('fade-in');
      }, 2000); // 2 seconds delay
    }, 2000); // 2 seconds delay
  });
}

Remember that effective implementation might require additional adjustments based on your specific HTML structure and JavaScript logic.



// Preload SVGs before setting up event listeners and animations
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading
  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.container');
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');

    // Event listener and animation for links
    function handleLinkClick(targetBackgroundUrl, nextContainer) {
      handlePageTransition(targetBackgroundUrl, nextContainer);
    }

    // Event listener and animation for Home link
    home.addEventListener('click', function (event) {
      handleLinkClick('backgroundOne.svg', "container-one");
    });

    // Event listeners and animations for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        handleLinkClick('backgroundTwo.svg', "container-two");
      });
    });

    // Event listener and animation for More link
    more.addEventListener('click', function (event) {
      handleLinkClick('backgroundFive.svg', "container-five");
    });
  });
});