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
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.container .background-svg');
  container.classList.add('fade-in');
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
    await preloadSVGs(svgUrls);
  } else {
    console.log('SVGs already preloaded');
  }

  home.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = getStoredSVG('backgroundOne.svg');
    container.classList.add('fade-out');
    // animateBackground(currentBackground, targetBackground);
  });

  projects.forEach(link => {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      container.classList.add('fade-out');
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      // animateBackground(currentBackground, targetBackground);
    });
  });

  more.addEventListener('click', function(i) {
    i.preventDefault();
    container.classList.add('fade-out');
    const targetBackground = getStoredSVG('backgroundFive.svg');
    // animateBackground(currentBackground, targetBackground);
  });
});