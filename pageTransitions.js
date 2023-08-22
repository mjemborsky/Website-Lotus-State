const container = document.querySelector('.container');
container.classList.remove('fade-out');
container.classList.add('fade-in');

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

    home.addEventListener('click', function (event) {
    event.preventDefault();
    const targetBackground = getStoredSVG('backgroundOne.svg');
    container.classList.remove('fade-in');
    container.classList.add('fade-out');
    setTimeout(() => {
      currentBackground.innerHTML = targetBackground.innerHTML;
      container.classList.remove('fade-out');
      container.classList.add('fade-in');
    }, 2000);
  });

  projects.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetBackground = getStoredSVG('backgroundTwo.svg');
      container.classList.remove('fade-in');
      container.classList.add('fade-out');
      setTimeout(() => {
        currentBackground.innerHTML = targetBackground.innerHTML;
        container.classList.remove('fade-out');
        container.classList.add('fade-in');
      }, 2000);
    });
  });

  more.addEventListener('click', function (event) {
    event.preventDefault();
    const targetBackground = getStoredSVG('backgroundFive.svg');
    container.classList.remove('fade-in');
    container.classList.add('fade-out');
    setTimeout(() => {
      currentBackground.innerHTML = targetBackground.innerHTML;
      container.classList.remove('fade-out');
      container.classList.add('fade-in');
    }, 2000);
  });
});