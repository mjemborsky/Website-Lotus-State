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
  // Remove existing animation classes from the current circles
  currentBackground.querySelectorAll('circle').forEach((currentCircle) => {
    currentCircle.classList.remove('animate-circle');
  });

  // Add animation classes to the target circles
  targetBackground.querySelectorAll('circle').forEach((targetCircle, index) => {
    const currentCircle = currentBackground.querySelectorAll('circle')[index];
    const targetR = targetCircle.getAttribute('r');
    const targetCX = targetCircle.getAttribute('cx');
    const targetCY = targetCircle.getAttribute('cy');

    // Wait a bit to apply the animation class to trigger the transition
    setTimeout(() => {
      currentCircle.classList.add('animate-circle');
      currentCircle.setAttribute('r', targetR);
      currentCircle.setAttribute('cx', targetCX);
      currentCircle.setAttribute('cy', targetCY);
    }, 10); // Adjust the delay as needed
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  // Initializing Background Elements
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.background-svg');
  console.log('current background:',currentBackground);
  const currentCircles = currentBackground.querySelectorAll('circle');
  console.log('current circles: ',currentCircles);
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