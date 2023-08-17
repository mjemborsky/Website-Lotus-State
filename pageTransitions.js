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


function animateBackground(targetSVG) {
  const currentBackground = document.querySelector('.container .background-svg');
  const currentCircles = currentBackground.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');

  console.log('current: ', currentCircles);
  console.log('target: ', targetCircles);

  const tl = gsap.timeline({ duration: 5, onComplete: showNextPage });

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

  tl.play();

  function showNextPage() {
    currentBackground.style.opacity = 0;
    // Show the next page's content (you need to implement this part)
    // For example, you can update the DOM to display the next content
    // and set its SVG to be visible.
  }
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