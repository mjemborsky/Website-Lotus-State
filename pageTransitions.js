async function getAllSVG(svgUrl) {
  const cachedSVG = sessionStorage.getItem(svgUrl);
  if (cachedSVG) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(cachedSVG, 'image/svg+xml');
    const svgRoot = svgDoc.documentElement;
    console.log('Cached SVG:', svgRoot);
    return svgRoot;
  } else {
    try {
      const response = await fetch(svgUrl);
      const svgContent = await response.text();
      sessionStorage.setItem(svgUrl, svgContent); // Cache the SVG content in SessionStorage
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgRoot = svgDoc.documentElement;
      console.log('Fetched SVG:', svgRoot);
      return svgRoot;
    } catch (error) {
      console.error('Error fetching SVG:', error);
      return null;
    }
  }
}

async function preloadSVGs(urls) {
  let remaining = urls.length;
    
  function preloadNext() {
    if (remaining === 0) {
      // All SVGs have been preloaded
      sessionStorage.setItem('preloadedSVGs', JSON.stringify(preloadedSVGs));
      console.log('All SVGs preloaded:', preloadedSVGs);
      return;
    }
    const url = urls[urls.length - remaining];
    getAllSVG(url)
      .then((svgRoot) => {
        preloadedSVGs.push(svgRoot);
        console.log(svgRoot);
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

function getStoredSVG(index) {
  const svgString = sessionStorage.getItem(`svg_${index}`);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  console.log(svgDoc.documentElement);
  return svgDoc.documentElement;
}

function extractCirclePositions(svgRoot) {
  const circles = svgRoot.querySelectorAll('circle'); // Select all circle elements
  const circlePositions = [];
  for (const circle of circles) {
    const cx = parseFloat(circle.getAttribute('cx'));
    const cy = parseFloat(circle.getAttribute('cy'));
    circlePositions.push({ cx, cy });
  }
  return circlePositions;
}

document.addEventListener('DOMContentLoaded', function () {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const home = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  const container = document.querySelector('.container');
  const svgUrls = [
    'backgroundOne.svg',
    'backgroundTwo.svg',
    'backgroundFive.svg',
    'backgroundThree.svg',
    'backgroundFour.svg'
  ];

  let preloadedSVGs = JSON.parse(sessionStorage.getItem('preloadedSVGs'));

  if (!preloadedSVGs) {
    preloadedSVGs = [];
    preloadSVGs(svgUrls);
  } else {
    console.log('SVGs already preloaded:', preloadedSVGs);
  }

  var currentObject = document.querySelector('.background-svg');
  var currentIndex = currentObject.getAttribute('index');
  var currentBackground = getStoredSVG[currentIndex];
  console.log(currentBackground);


  // Replace the object element with the preloaded SVG
  if (currentBackground) {
    currentObject.parentNode.replaceChild(currentBackground, currentObject);
  }
});


//   // Event Listeners
//   // Background: index
//   home.addEventListener('click', function(i) {
//     var targetBackground = preloadedSVGs[0];
//     animateBackground(currentBackground, targetBackground);
//   });
//   // Background: projects
//   projects.forEach(function(link) {
//     link.addEventListener('click', function(i) {
//       var targetBackground = preloadedSVGs[1];
//       animateBackground(currentBackground, targetBackground);
//     });
//   });
//   // Background: more
//   more.addEventListener('click', function(i) {
//     var targetBackground = preloadedSVGs[2];
//     animateBackground(currentBackground, targetBackground);
//   });

//   // Add a flag to indicate if an animation is currently in progress
//   let animationInProgress = false;
//   const animationQueue = []; // Store the queued animations

//   function animateBackground(currentBackground, targetBackground) {
//     // If an animation is already in progress, queue the new animation
//     if (animationInProgress) {
//       animationQueue.push(targetBackground);
//       return;
//     }
//     // Mark animation as in progress
//     animationInProgress = true;

//     // Store the current background locally within the animation closure
//     let currentBackgroundCopy = currentBackground;

//     const currentCircles = extractCirclePositions(currentBackgroundCopy);

//     // Animate the circles' positions
//     getSVGContent(targetBackground, function (targetSvgRoot) {
//       // Assuming each circle has the class 'circle' in your SVGs
//       const targetCircles = extractCirclePositions(targetSvgRoot);
//       // Ensure the number of circles is the same in both SVGs
//       if (currentCircles.length !== targetCircles.length) {
//         console.error('The number of circles in the SVGs is different!');
//         return;
//       }
//       const duration = 3000; // 3 seconds
//       const startTime = performance.now();

//       let animationFrameId;

//       function updatePositions(timestamp) {
//         const progress = (timestamp - startTime) / duration;
//         currentCircles.forEach((currentCircle, index) => {
//           const targetCircle = targetCircles[index];
//           const currentX = Number(currentCircle.getAttribute('cx'));
//           const currentY = Number(currentCircle.getAttribute('cy'));
//           const targetX = Number(targetCircle.getAttribute('cx'));
//           const targetY = Number(targetCircle.getAttribute('cy'));

//           const interpolatedX = currentX + (targetX - currentX) * progress;
//           const interpolatedY = currentY + (targetY - currentY) * progress;

//           currentCircle.setAttribute('cx', interpolatedX);
//           currentCircle.setAttribute('cy', interpolatedY);
//         });

//         if (progress < 1) {
//           animationFrameId = requestAnimationFrame(updatePositions);
//         } else {
//           // Animation is complete
//           currentBackgroundCopy = targetBackground;
//           // Mark animation as complete
//           animationInProgress = false;

//           // If there are queued animations, start the next one
//           if (animationQueue.length > 0) {
//             const nextBackground = animationQueue.shift();
//             animateBackground(currentBackgroundCopy, nextBackground);
//           }
//         }
//       }
//       // Start the animation loop and store the animation frame ID
//       animationFrameId = requestAnimationFrame(updatePositions);
//     });
//   }
// });
