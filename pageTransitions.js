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
  // Parse circle elements from the currentBackground SVG
  const currentCircles = currentBackground.querySelectorAll('circle');
  // Parse circle elements from the targetBackground SVG
  const targetCircles = targetBackground.querySelectorAll('circle');

  // Apply the transition class to the container to enable smooth animations
  document.querySelector('.container').classList.add('animate-transition');

  // Animate the positions of the circles
  for (let i = 0; i < currentCircles.length; i++) {
    const currentCircle = currentCircles[i];
    const targetCircle = targetCircles[i];

    // Get the initial position of the circle
    const initialX = currentCircle.getAttribute('cx');
    const initialY = currentCircle.getAttribute('cy');

    // Get the target position of the circle
    const targetX = targetCircle.getAttribute('cx');
    const targetY = targetCircle.getAttribute('cy');

    // Update the circle's position using CSS transitions
    currentCircle.style.transition = 'cx 3s ease-out, cy 3s ease-out';
    currentCircle.style.cx = targetX;
    currentCircle.style.cy = targetY;
  }

  // After the animation duration, remove the transition class to disable animations
  setTimeout(() => {
    document.querySelector('.container').classList.remove('animate-transition');

    // After the animation, remove the currentBackground and targetBackground SVGs
    currentBackground.remove();
    targetBackground.remove();
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  // Initializing Background Elements
  const container = document.querySelector('.container');
  const svgUrls = [
    'backgroundOne.svg',
    'backgroundTwo.svg',
    'backgroundFive.svg',
    'backgroundThree.svg',
    'backgroundFour.svg'
  ];

  // Preload SVGs for Background
  // Checks for 
  let preloadedSVGs = sessionStorage.getItem('backgroundFive.svg');
  if (!preloadedSVGs) {
    preloadedSVGs = [];
    preloadSVGs(svgUrls);
  } else {
    console.log('SVGs already preloaded');
  }

  var currentObject = document.querySelector('.background-svg');
  var currentId = currentObject.getAttribute('id');
  var currentBackground;
  if (currentId == 'backgroundOne') {
    currentBackground = getStoredSVG('backgroundOne.svg');
  } else if (currentId == 'backgroundTwo') {
    currentBackground = getStoredSVG('backgroundTwo.svg');
  } else {
    currentBackground = getStoredSVG('backgroundFive.svg');
  }
  console.log(currentBackground);
  // Event Listeners
  // Background: index
  home.addEventListener('click', function(i) {
    var targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(currentBackground, targetBackground);
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      var targetBackground = getStoredSVG('backgroundOne.svg');
      animateBackground(currentBackground, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    var targetBackground = getStoredSVG('backgroundOne.svg');
    animateBackground(currentBackground, targetBackground);
  });
});



