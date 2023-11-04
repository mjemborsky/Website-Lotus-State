// Preload SVGs for Background
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg',
  'backgroundThree.svg',
  'backgroundFour.svg'
];
// Preload SVGs
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
// Get stored SVG from SessionStorage
function getStoredSVG(url) {
  const svgString = sessionStorage.getItem(url);
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  return svgDoc.documentElement;
}
// Function to check if the currentSVG matches a specific SVG filename
function isCurrentSVG(filename) {
  const currentSVG = document.querySelector('.background-svg');
  return currentSVG.src.includes(filename);
}
// Circle Animation
function animateCircles(targetSVG) {
  const currentSVG = document.querySelector('.background-svg');
  const currentCircles = currentSVG.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');
  // Store the animation start time
  const animationDuration = 4000; // 4 seconds
  const startTime = performance.now();
  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    // Ensure elapsed time does not exceed the animation duration
    if (elapsedTime < animationDuration) {
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        const currentRadius = parseFloat(currentCircle.getAttribute('r'));
        const radiusDifference = targetRadius - currentRadius;
        // Calculate the new radius based on elapsed time and animation duration
        const newRadius = currentRadius + (radiusDifference * (elapsedTime / (animationDuration*4)));
        currentCircle.setAttribute('r', newRadius);
      });
      // Continue the animation
      requestAnimationFrame(animate);
    } else {
      // Ensure the final radius values are set correctly
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        currentCircle.setAttribute('r', targetRadius);
      });
    }
  }
  // Start the animation
  requestAnimationFrame(animate);
}
// Handle page transition including fade and AJAX loading
async function handlePageTransition(destinationURL, targetBackground) {
  const container = document.querySelector('.container');
  const content = document.querySelectorAll('.fade-target');
  content.forEach((fadeItem) => {
    fadeItem.classList.add('fade-out');
  });
  try {
    // Fetch the new page content using AJAX
    const response = await fetch(destinationURL);
    const newPage = await response.text();
    // Start both the circle animation and fade-out concurrently
    const animationPromise = Promise.all([
      new Promise((resolve) => {
        // Start the circle animation during fade-out
        animateCircles(targetBackground);
        // Resolve the circle animation promise after 4 seconds (adjust as needed)
        setTimeout(() => {
          resolve();
        }, 4000);
      }),
      new Promise((resolve) => {
        // Delay the fade-out class removal by 2 seconds
        setTimeout(() => {
          // Remove fade-out class after 2 seconds
          content.forEach((fadeItem) => {
            fadeItem.classList.remove('fade-out');
            fadeItem.style.opacity = '0';
          });
          // Replace the container content with the new page content
          container.innerHTML = newPage;
          // Apply fade-in animation to the new content
          const newContent = newPage.querySelectorAll('.fade-target');
          newContent.forEach((newFadeItem) => {
            newFadeItem.classList.add('fade-in');
            setTimeout(() => {
              newFadeItem.classList.remove('fade-in');
              newFadeItem.style.opacity = '1';
            });
          }, 2000); // 2 seconds for fade-in
        }, 2000);
        resolve(); 
      }),
    ]);
    // Wait for both animations to complete before continuing
    await animationPromise;
  } catch (error) {
    console.error('Error loading page:', error);
  }
}
// Animate Idle SVG (rain.svg)
// function animateIdle() {
//   const idle = document.querySelector('.idle');
//   const paths = idle.querySelectorAll('path');
//   // Set the animation properties
//   const animationDuration = 6000; // 6 seconds
//   const screenHeight = window.innerHeight;
//   paths.forEach((path, index) => {
//     // Calculate the animation delay for each path so they appear one after another
//     const delay = (index * animationDuration) / paths.length;
//     // Apply CSS animation to the path
//     path.style.animation = `moveUp ${animationDuration}ms linear ${delay}ms infinite`;
//     // Define the keyframes for the animation
//     const keyframes = `@keyframes moveUp {
//       0% {
//         transform: translateY(0);
//       }
//       100% {
//         transform: translateY(-${screenHeight}px);
//       }
//     }`;
//     // Add the keyframes to a style element and append it to the document
//     const styleElement = document.createElement('style');
//     styleElement.appendChild(document.createTextNode(keyframes));
//     document.head.appendChild(styleElement);
//   });
// }
// 1. Implement Idle Bubbles with fade during transition
// Bubbles.svg should be inside the section element so it fades with it, this SHOULD take care of the fading
// When page is loaded...
// Select bubbles svg
// Call forever...
    // AnimateBubbles function
        // Should store all circles in the svg
        // Circles should probably be selected with different selector than 'circle', maybe so class
        // Animate them up the screen until they get to a full screen height from the initial position,
        // Then reset to initial position and run again.
        // When links are clicked, animation should continue but fade should be applied and opacity set to 0




// MAIN PAGE LISTENER
// Preload SVGs before setting up link event listeners
preloadSVGs(svgUrls).then(() => {
  // Setup event listeners after preloading background SVG's
  document.addEventListener('DOMContentLoaded', function () {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');
    const content = document.querySelector('.fade-target');
    // Add fade-in class to trigger fade-in animation
    content.classList.add('fade-in');
    // Remove fade-in class after animation duration
    setTimeout(function () {
      content.classList.remove('fade-in');
      content.style.opacity = '1';
    }, 2000); // 2 seconds

    // Event listener for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = home.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundOne.svg');
      handlePageTransition(destinationURL, targetBackground);
    });
    // Event listeners for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const destinationURL = link.getAttribute('href');
        const targetBackground = getStoredSVG('backgroundTwo.svg');
        handlePageTransition(destinationURL, targetBackground);
      });
    });
    // Event listener for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      const destinationURL = more.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundFive.svg');
      handlePageTransition(destinationURL, targetBackground);
    });

    // APPLY IDLE ANIMATION HERE (CALL FUNCTION TO ANIMATE FLOATING PATHS)
    // animateIdle();
  });
});