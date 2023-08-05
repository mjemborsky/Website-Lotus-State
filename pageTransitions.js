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
  const animationDuration = 8000; // Set your desired duration in milliseconds

  // Apply the CSS transitions for each specific SVG element
  for (let i = 0; i < currentCircles.length; i++) {
    const currentCircle = currentCircles[i];
    const targetCircle = targetCircles[i];
    const targetR = parseFloat(targetCircle.getAttribute('r'));
    console.log('target r: ', targetR);
    const dR = targetR - parseFloat(currentCircle.getAttribute('r'));
    console.log('distance: ', dR);
    const startTime = performance.now();
    function updateCircleAttributes(timestamp) {
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);
      const easedProgress = progress ** 3;
      const newR = parseFloat(currentCircle.getAttribute('r')) + dR * easedProgress;
      currentCircle.setAttribute('r', newR);

      if (progress < 1) {
        requestAnimationFrame(updateCircleAttributes);
      } else {
        // Remove CSS transitions when animation is done
        console.log('animationComplete');
        currentCircle.style.transition = 'none';
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

  console.log(currentBackground);
  console.log(currentBackground.querySelectorAll('circle'));

  home.addEventListener('click', function() {
    const targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(currentBackground, targetBackground); // Pass true to start the animation
  });

  projects.forEach(link => {
    link.addEventListener('click', function() {
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      animateBackground(currentBackground, targetBackground); // Pass true to start the animation
    });
  });

  more.addEventListener('click', function() {
    const targetBackground = getStoredSVG('backgroundFive.svg');
    animateBackground(currentBackground, targetBackground); // Pass true to start the animation
  });
});