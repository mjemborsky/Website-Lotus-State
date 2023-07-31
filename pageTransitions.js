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

function animateBackground(currentBackground, targetBackground) {
  const container = document.querySelector('.container');
  container.classList.add('animating', 'animate-background');

  const currentContainer = Snap(container);
  const currentCircles = currentBackground.selectAll("circle");
  const targetCircles = targetBackground.selectAll("circle");

  if (currentCircles.length !== targetCircles.length) {
    console.error("The number of circles in the SVGs should be the same.");
    return;
  }

  const animationDuration = 3000; // 3 seconds

  currentCircles.forEach(function (currentCircle, index) {
    const targetCircle = targetCircles[index];
    const targetRadius = targetCircle.attr("r");
    const targetFill = targetCircle.attr("fill");

    currentCircle.animate(
      {
        r: targetRadius,
        fill: targetFill,
      },
      animationDuration,
      mina.easeinout
    );
  });

  currentContainer.append(targetBackground);
  container.classList.remove('animating');
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



