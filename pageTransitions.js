async function getAllSnapSVG(svgUrl) {
  const cachedSVG = sessionStorage.getItem(svgUrl);
  if (cachedSVG) {
    return Snap.parse(cachedSVG);
  } else {
    try {
      const response = await fetch(svgUrl);
      const svgContent = await response.text();
      sessionStorage.setItem(svgUrl, svgContent); // Cache the SVG content in SessionStorage
      return Snap.parse(svgContent);
    } catch (error) {
      return null;
    }
  }
}


async function preloadSVGs(urls) {
  let remaining = urls.length;
  async function preloadNext() { // Add 'async' here
    if (remaining === 0) {
      return;
    }
    const url = urls[urls.length - remaining];
    try { // Add try-catch block for better error handling
      await getAllSnapSVG(url);
    } catch (error) {
      console.error('Error preloading SVG:', error);
    }
    remaining--;
    // Call the next preload iteration
    preloadNext();
  }
  preloadNext();
}

function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  if (!svgString) {
    return null; // SVG not found in SessionStorage, handle this case accordingly
  }
  return Snap.parse(svgString);
}

// Function to animate circle positions
function animateBackground(currentBackground, targetBackground) {
  // Parse circle elements from the currentBackground SVG
  const currentCircles = currentBackground.querySelectorAll('circle');
  // Parse circle elements from the targetBackground SVG
  const targetCircles = targetBackground.querySelectorAll('circle');
  
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

    // Create a new circle element for the animation
    const animatedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    animatedCircle.setAttribute('r', currentCircle.getAttribute('r'));
    animatedCircle.setAttribute('cx', initialX);
    animatedCircle.setAttribute('cy', initialY);
    animatedCircle.setAttribute('fill', currentCircle.getAttribute('fill'));
    animatedCircle.setAttribute('stroke', currentCircle.getAttribute('stroke'));
    animatedCircle.setAttribute('stroke-width', currentCircle.getAttribute('stroke-width'));

    // Append the animated circle to the existing container
    document.querySelector('.container').appendChild(animatedCircle);

    // Animate the circle position over 3 seconds
    animatedCircle.animate(
      [
        { cx: initialX, cy: initialY },
        { cx: targetX, cy: targetY }
      ],
      {
        duration: 3000,
        easing: 'ease-out'
      }
    );
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
    getAllSnapSVG('backgroundOne.svg').then((targetBackground) => {
      animateBackground(currentBackground, targetBackground);
      currentBackground = targetBackground;
    });
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      getAllSnapSVG('backgroundTwo.svg').then((targetBackground) => {
        animateBackground(currentBackground, targetBackground);
        currentBackground = targetBackground;
      });
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    getAllSnapSVG('backgroundFive.svg').then((targetBackground) => {
      animateBackground(currentBackground, targetBackground);
      currentBackground = targetBackground;
    });
  });
});



