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

    currentCircle.style.transition = 'none'; // Disable CSS transitions temporarily

    // Calculate the attribute differences between the current and target circles
    const dX = parseFloat(targetCircle.getAttribute('cx')) - parseFloat(currentCircle.getAttribute('cx'));
    const dY = parseFloat(targetCircle.getAttribute('cy')) - parseFloat(currentCircle.getAttribute('cy'));
    const dR = parseFloat(targetCircle.getAttribute('r')) - parseFloat(currentCircle.getAttribute('r'));

    const startTime = performance.now();

    function updateCircleAttributes(timestamp) {
      const progress = Math.min((timestamp - startTime) / 4000, 1); // 4000 ms (4 seconds) duration

      // Update the attributes based on the progress
      currentCircle.setAttribute('cx', parseFloat(currentCircle.getAttribute('cx')) + dX * progress);
      currentCircle.setAttribute('cy', parseFloat(currentCircle.getAttribute('cy')) + dY * progress);
      currentCircle.setAttribute('r', parseFloat(currentCircle.getAttribute('r')) + dR * progress);

      if (progress < 1) {
        // Keep animating if the progress is not 100%
        requestAnimationFrame(updateCircleAttributes);
      } else {
        // Reset CSS transitions when animation is done
        currentCircle.style.transition = 'cx 4s ease-out, cy 4s ease-out, r 4s ease-out';
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