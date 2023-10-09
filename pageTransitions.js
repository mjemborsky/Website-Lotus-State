let isAnimating = false;
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
// Circle Animation
function animateCircles(targetSVG) {
  // Get the current SVG and target SVG circles
  const currentSVG = document.querySelector('.background-svg');
  const currentCircles = currentSVG.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');

  // Calculate and apply the animation for each circle
  currentCircles.forEach((currentCircle, index) => {
    const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
    const currentRadius = parseFloat(currentCircle.getAttribute('r'));
    const radiusDifference = targetRadius - currentRadius;

    // Apply CSS transition to animate the 'r' attribute
    currentCircle.style.transition = 'r 4s ease-in-out';
    currentCircle.setAttribute('r', targetRadius);
  });
}
// Handle page transition including fade and AJAX loading
async function handlePageTransition(destinationURL, targetBackground) {
  const container = document.querySelector('.container');
  const content = document.querySelector('.fade-target');
  content.classList.add('fade-out'); // Add fade-out class to trigger fade-out animation

  try {
    // Fetch the new page content using AJAX
    const response = await fetch(destinationURL);
    const newPage = await response.text();

    // Start both the circle animation and fade-out concurrently
    const animationPromise = Promise.all([
      new Promise((resolve) => {
        // Start the circle animation during fade-out
        animateCircles(targetBackground);
        // Resolve the circle animation promise after 2 seconds (adjust as needed)
      }),

      new Promise((resolve) => {
      // Delay the fade-out class removal by 2 seconds
      setTimeout(() => {
        // Remove fade-out class after 2 seconds
        content.classList.remove('fade-out');
        content.style.opacity = '0';

        // Replace the container content with the new page content
        container.innerHTML = newPage;

        // Apply fade-in animation to the new content
        const newContent = container.querySelector('.fade-target');
        newContent.classList.add('fade-in');

        // Set opacity back to 1 for all contents after fade-in
        setTimeout(() => {
          newContent.classList.remove('fade-in');
          newContent.style.opacity = '1';
          resolve(); // Resolve the fade-out promise
        }, 2000); // 2 seconds for fade-in
      }, 2000); // 2 seconds delay before removing fade-out
      }),
    ]);

    // Wait for both animations to complete before continuing
    await animationPromise;

  } catch (error) {
    console.error('Error loading page:', error);
  }
}

// Function to start the idle animation
function startIdleAnimation() {
  isAnimating = true;
  // Create an interval that alternates between target SVGs
  const svgTargets = ['backgroundFour.svg', 'backgroundOne.svg']; // Add more SVGs as needed
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (!isAnimating) {
      clearInterval(interval); // Stop the animation if isAnimating becomes false
      return;
    }
    const targetSVG = getStoredSVG(svgTargets[currentIndex]);
    animateCircles(targetSVG);
    currentIndex = (currentIndex + 1) % svgTargets.length;
  }, 5000); // Change the interval time as needed (e.g., every 5 seconds)
}
// Function to stop the idle animation
function stopIdleAnimation() {
  isAnimating = false;
}
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
      stopIdleAnimation();
      const destinationURL = home.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundOne.svg');
      handlePageTransition(destinationURL, targetBackground);
    });
    // Event listeners for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        stopIdleAnimation();
        const destinationURL = link.getAttribute('href');
        const targetBackground = getStoredSVG('backgroundTwo.svg');
        handlePageTransition(destinationURL, targetBackground);
      });
    });
    // Event listener for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      stopIdleAnimation();
      const destinationURL = more.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundFive.svg');
      handlePageTransition(destinationURL, targetBackground);
    });

    // CALL IDLE ANIMATION HERE? (maybe after like a second delay?)
    setTimeout(() => {
      startIdleAnimation();
    }, 1000);
  });
});