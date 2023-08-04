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

    currentCircle.style.transition = 'cx 4s ease-out, cy 4s ease-out, r 4s ease-out';

    // Set the target attributes for each specific SVG element after a delay of 4 seconds
    setTimeout(() => {
      currentCircle.setAttribute('cx', targetCircle.getAttribute('cx'));
      currentCircle.setAttribute('cy', targetCircle.getAttribute('cy'));
      currentCircle.setAttribute('r', targetCircle.getAttribute('r'));
    }, 4000); // 4 seconds delay
  }
}

With this change, the entire transition should now take place over 4 seconds. The setTimeout function with a delay of 4000 milliseconds (4 seconds) ensures that the attributes are updated after the CSS transitions have had time to run. This will result in a smooth 4-second animation for the circles between the current and target backgrounds.


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