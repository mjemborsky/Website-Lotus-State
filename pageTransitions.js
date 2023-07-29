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
  // Get current container
  const container = document.querySelector('.container');
  // Set both SVG dimensions to match the container's dimensions
  currentBackground.setAttribute('width', container.clientWidth);
  currentBackground.setAttribute('height', container.clientHeight);
  targetBackground.setAttribute('width', container.clientWidth);
  targetBackground.setAttribute('height', container.clientHeight);
  // Position both SVGs at the top left corner of the container
  currentBackground.style.position = 'absolute';
  currentBackground.style.top = '0';
  currentBackground.style.left = '0';
  targetBackground.style.position = 'absolute';
  targetBackground.style.top = '0';
  targetBackground.style.left = '0';
  // Remove 'image' background and append SVG
  container.classList.add('animating');
  container.style.background = 'none';
  container.appendChild(currentBackground);

  // Get all the circle elements in the current and target SVGs
  const currentCircles = currentBackground.querySelectorAll('circle');
  console.log(currentCircles);
  const targetCircles = targetBackground.querySelectorAll('circle');
  console.log(targetCircles);

  // Calculate the animation step for each circle
  const animationSteps = [];
  currentCircles.forEach((circle, index) => {
    const targetCircle = targetCircles[index];
    const deltaX = targetCircle.cx.baseVal.value - circle.cx.baseVal.value;
    const deltaY = targetCircle.cy.baseVal.value - circle.cy.baseVal.value;
    animationSteps.push({ deltaX, deltaY });
  });

  // Animate the circles
  const animationDuration = 3000; // 1 second animation
  const startTime = performance.now();
  function step(timestamp) {
    const progress = (timestamp - startTime) / animationDuration;
    if (progress >= 1) {
      // Animation is complete
      targetCircles.forEach((targetCircle, index) => {
        const { deltaX, deltaY } = animationSteps[index];
        currentCircles[index].cx.baseVal.value += deltaX;
        currentCircles[index].cy.baseVal.value += deltaY;
      });
      currentBackground = targetBackground;
      container.classList.remove('animating');
      return;
    }

    targetCircles.forEach((targetCircle, index) => {
      const { deltaX, deltaY } = animationSteps[index];
      currentCircles[index].cx.baseVal.value += progress * deltaX;
      currentCircles[index].cy.baseVal.value += progress * deltaY;
    });
    // Request the next animation frame
    requestAnimationFrame(step);
  }
  // Start the animation
  requestAnimationFrame(step);
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
  var currentIndex = currentObject.getAttribute('index');
  var currentBackground;
  if (currentIndex == 0) {
    currentBackground = getStoredSVG('backgroundOne.svg');
  } else if (currentIndex == 1) {
    currentBackground = getStoredSVG('backgroundTwo.svg');
  } else {
    currentBackground = getStoredSVG('backgroundFive.svg');
  }
  console.log(currentBackground);

  // Event Listeners
  // Background: index
  home.addEventListener('click', function(i) {
    var targetBackground = getStoredSVG('backgroundOne.svg');
    console.log(targetBackground);
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      var targetBackground = getStoredSVG('backgroundTwo.svg');
      console.log(targetBackground);
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    var targetBackground = getStoredSVG('backgroundFive.svg');
    console.log(targetBackground);
    animateBackground(currentBackground, targetBackground);
  });
});



