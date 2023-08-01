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
  const currentCircles = currentBackground.querySelectorAll('circle');
  const targetCircles = targetBackground.querySelectorAll('circle');
  const container = document.querySelector('.container');

  // Animate the positions of the circles
  for (let i = 0; i < currentCircles.length; i++) {
    const currentCircle = currentCircles[i];
    const targetCircle = targetCircles[i];

    const initialX = currentCircle.getAttribute('cx');
    const initialY = currentCircle.getAttribute('cy');
    const targetX = targetCircle.getAttribute('cx');
    const targetY = targetCircle.getAttribute('cy');

    const currentRadius = Number(currentCircle.getAttribute('r'));
    const targetRadius = Number(targetCircle.getAttribute('r'));

    // Create a new circle element for the animation
    const animatedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    animatedCircle.setAttribute('r', currentRadius);
    animatedCircle.setAttribute('cx', initialX);
    animatedCircle.setAttribute('cy', initialY);
    animatedCircle.setAttribute('fill', currentCircle.getAttribute('fill'));
    animatedCircle.setAttribute('stroke', currentCircle.getAttribute('stroke'));
    animatedCircle.setAttribute('stroke-width', currentCircle.getAttribute('stroke-width'));

    container.appendChild(animatedCircle);

    // Animate the circle position over 3 seconds
    animatedCircle.animate(
      [
        { cx: initialX, cy: initialY, r: currentRadius },
        { cx: targetX, cy: targetY, r: targetRadius }
      ],
      {
        duration: 3000,
        easing: 'ease-out'
      }
    );

    // Remove the current circle from the container after animation
    animatedCircle.addEventListener('finish', function () {
      animatedCircle.remove();
    });
  }
  // After the animation, remove the currentBackground and targetBackground SVGs
  currentBackground.remove();
  targetBackground.remove();
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



