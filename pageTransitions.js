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
function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}


function animateBackground(currentBackground, targetBackground) {
  const currentCircles = currentBackground.querySelectorAll('circle');
  const targetCircles = targetBackground.querySelectorAll('circle');

  // Apply the CSS transitions for each specific SVG element
  for (let i = 0; i < currentCircles.length; i++) {
    const currentCircle = currentCircles[i];
    const targetCircle = targetCircles[i];
    const targetR = parseFloat(targetCircle.getAttribute('r'));
    const dR = targetR - parseFloat(currentCircle.getAttribute('r'));
    const startTime = performance.now();
    function updateCircleAttributes(timestamp) {
      const progress = Math.min((timestamp - startTime) / 8000, 1); // 8000 ms (8 seconds) duration with cubic easing
      // Apply cubic easing for smoother animation
      const easedProgress = progress ** 3;
      // Update the 'r' attribute based on the eased progress
      currentCircle.setAttribute('r', parseFloat(currentCircle.getAttribute('r')) + dR * easedProgress);
      if (progress < 1) {
        // Keep animating if the progress is not 100%
        requestAnimationFrame(updateCircleAttributes);
      } else {
        // Reset CSS transitions when animation is done
        currentCircle.style.transition = 'r 4s ease-out';
      }
    }
    // Start the animation
    requestAnimationFrame(updateCircleAttributes);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  // Initializing Background Elements
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.background-svg');
  const svgUrls = [
    'backgroundOne.svg',
    'backgroundTwo.svg',
    'backgroundFive.svg',
    'backgroundThree.svg',
    'backgroundFour.svg'
  ];
  // Preload SVGs for Background
  let preloadedSVGs = sessionStorage.getItem('backgroundFour.svg');
  if (!preloadedSVGs) {
    preloadedSVGs = [];
    preloadSVGs(svgUrls);
  } else {
    console.log('SVGs already preloaded');
  }

  // Event Listeners
  // Background: index
  home.addEventListener('click', function(i) {
    const targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(currentBackground, targetBackground);

  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      animateBackground(currentBackground, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    const targetBackground = getStoredSVG('backgroundFive.svg');
    animateBackground(currentBackground, targetBackground);
  });
});