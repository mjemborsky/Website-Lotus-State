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

  const duration = 3000; // Duration of the animation in milliseconds
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const progress = (currentTime - startTime) / duration;
    if (progress >= 1) {
      // Animation completed
      for (let i = 0; i < targetCircles.length; i++) {
        const targetCircle = targetCircles[i].cloneNode();
        container.appendChild(targetCircle);
        console.log('ANIMATED');
      }
      // Remove the currentBackground and targetBackground SVGs
      currentBackground.remove();
      targetBackground.remove();
      return;
    }

    for (let i = 0; i < currentCircles.length; i++) {
      const currentCircle = currentCircles[i];
      const targetCircle = targetCircles[i];
      const currentRadius = Number(currentCircle.getAttribute('r'));
      const targetRadius = Number(targetCircle.getAttribute('r'));
      const newRadius = currentRadius + (targetRadius - currentRadius) * progress;
      console.log(newRadius);

      // Create a new circle element for the animation
      const animatedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      animatedCircle.setAttribute('r', newRadius);
      animatedCircle.setAttribute('cx', currentCircle.getAttribute('cx'));
      animatedCircle.setAttribute('cy', currentCircle.getAttribute('cy'));
      animatedCircle.setAttribute('fill', currentCircle.getAttribute('fill'));
      animatedCircle.setAttribute('stroke', currentCircle.getAttribute('stroke'));
      animatedCircle.setAttribute('stroke-width', currentCircle.getAttribute('stroke-width'));

      container.appendChild(animatedCircle);
    }

    // Remove the previous frame's circles from the container
    const previousCircles = container.querySelectorAll('circle:not([fill])');
    for (const circle of previousCircles) {
      circle.remove();
    }
    // Request the next animation frame
    requestAnimationFrame(animate);
  }
  // Start the animation
  animate();
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