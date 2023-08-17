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

function showNextContent() {
  // Hide the current content
  const currentContainer = document.querySelector('.container');
  currentContainer.style.opacity = 0;

  // Update the content here, e.g., change the SVG or other elements

  // Show the next content with fade-in
  const nextContainer = document.getElementById('container-two'); // Change to the ID of your next container
  nextContainer.style.opacity = 1;
}

function animateBackground(targetSVG) {
  const currentBackground = document.querySelector('.container .background-svg');
  const currentCircles = currentBackground.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');

  const tl = gsap.timeline({ duration: 5, onComplete: showNextContent });

  currentCircles.forEach((currentCircle, index) => {
    const targetCircle = targetCircles[index];
    const initialRadius = parseFloat(currentCircle.getAttribute('r'));
    const targetRadius = parseFloat(targetCircle.getAttribute('r'));

    tl.to(currentCircle, {
      duration: 5,
      attr: { r: targetRadius },
      ease: 'power2.inOut',
    });
  });

  // Use the tl.call to trigger showNextContent after the circles animation starts
  tl.call(showNextContent, null, null, 0); // Adjust timing as needed

  tl.play();
}


document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  const currentBackground = document.querySelector('.container .background-svg');
  console.log(currentBackground);
  // Initializing Background Elements
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

  home.addEventListener('click', function() {
    const targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(targetBackground);
  });

  projects.forEach(link => {
    link.addEventListener('click', function() {
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      animateBackground(targetBackground);
    });
  });

  more.addEventListener('click', function() {
    const targetBackground = getStoredSVG('backgroundFive.svg');
    animateBackground(targetBackground);
  });
});