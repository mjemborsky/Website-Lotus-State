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

function animateCirclesToTarget(currentBackground, targetBackground) {
  const currentCircles = currentBackground.querySelectorAll('circle');
  const targetCircles = targetBackground.querySelectorAll('circle');

  // Calculate the target radii for each circle
  const targetRadii = [];
  for (let i = 0; i < currentCircles.length; i++) {
    const targetRadius = parseFloat(targetCircles[i].getAttribute('r'));
    targetRadii.push(targetRadius);
  }

  // Apply CSS animation variables
  container.style.setProperty('--animation-duration', '4s');
  for (let i = 0; i < currentCircles.length; i++) {
    currentCircles[i].style.setProperty('--target-radius', targetRadii[i]);
  }

  // Add class to trigger animation
  container.classList.add('animate-circles');
}

// Preload SVGs before setting up event listeners and animations
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading
  document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container');
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');

    // Event listener and animation for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      handleLinkClick('backgroundOne.svg');
    });

    // Event listeners and animations for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        handleLinkClick('backgroundTwo.svg');
      });
    });

    // Event listener and animation for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      handleLinkClick('backgroundFive.svg');
    });
  });
});

// Function to handle link clicks and animations
function handleLinkClick(targetBackgroundUrl) {
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.container .background-svg')
  container.classList.remove('fade-in');
  container.classList.add('fade-out');

  // Get the preloaded SVG
  const targetBackground = getStoredSVG(targetBackgroundUrl);

  animateCirclesToTarget(currentBackground, targetBackground);

  // After any additional manipulations, trigger the fade-in animation
  setTimeout(() => {
    container.classList.remove('fade-out');
    container.classList.add('fade-in');
  }, 2000); // Wait for the fade-out animation to complete before fading in
}