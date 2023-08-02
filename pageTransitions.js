async function getAllSVG(svgUrl) {
  const cachedSVG = sessionStorage.getItem(svgUrl);
  if (cachedSVG) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(cachedSVG, 'image/svg+xml');
    const svgRoot = svgDoc.documentElement;
    return svgRoot;
  } else {
    try {
      const response = await fetch(svgUrl);
      const svgContent = await response.text();
      sessionStorage.setItem(svgUrl, svgContent); // Cache the SVG content in SessionStorage
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgRoot = svgDoc.documentElement;
      return svgRoot;
    } catch (error) {
      return null;
    }
  }
}

async function preloadSVGs(urls) {
  let remaining = urls.length;
  function preloadNext() {
    if (remaining === 0) {
      return;
    }
    const url = urls[urls.length - remaining];
    getAllSVG(url)
      .then((svgRoot) => {
        remaining--;
        // Call the next preload iteration
        preloadNext();
      })
      .catch((error) => {
        console.error('Error preloading SVG:', error);
        remaining--;
        // Call the next preload iteration
        preloadNext();
      });
  }
  preloadNext();
}

function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}

function animateBackground(currentBackground, targetBackground) {
  // Gets current container
  const container = document.querySelector('.container');
  // NEEDS to access svg element with class .background-svg to change circles
  // NEEDS to pull current circle positions
  // Gets target circle positions (what the circle should shift too)
  const targetCircles = targetBackground.querySelectorAll('circle');
  console.log(targetCircles);

  // NEEDS to animate current svg circles to target position
    // In function...
    // It should, for each circle, at the same time,
      // Take all attributes from each circle of current (including r, cx and cy attributes)
      // Take all attributes from each circle of target (including r, cx and cy attributes)
      // Animate current svg circles to new attributes over 4 seconds
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  // Initializing Background Elements
  const container = document.querySelector('.container');
  const currentBackground = document.querySelector('.background-svg');
  console.log(currentBackground);
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
    var targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(currentBackground, targetBackground);
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      var targetBackground = getStoredSVG('backgroundTwo.svg');
      animateBackground(currentBackground, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    var targetBackground = getStoredSVG('backgroundFive.svg');
    animateBackground(currentBackground, targetBackground);
  });
});