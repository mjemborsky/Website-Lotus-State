// animations.js
// Created by: Michael Emborsky
// Last Modified: 11/4/2023

// PURPOSE - Page Transition and Idle Animations //
// This javascript file is used to load, manipulate, and 
// animate 2 svg's, the background circles and the idle 
// floating 'paths'. 


// TO START (WHEN INDEX.HTML FIRST LOADS)
// Need to do animation of background circles with all r=0 to index.html svg
// Need to TEST this performance with performance.now to determine user's machine capabilities
// Need to establish categories of performance that determine what animation methods and how
// much animation will be shown (2g + low cores/low performance, 3g + medium cores/medium performance, 4/5g)


let lastTimestamp = null;
// Preload SVGs for Background - Stores svg's as list of names
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg'
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
    console.log("SVG's Preloaded");
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
function isMobile() {
  return window.innerWidth <= 430;
}

// Function to create and append paths dynamically into the <g> group
function createPaths(numPaths, container) {
  const group = container.querySelector('g'); // Target the <g> element inside the SVG
  for (let i = 0; i < numPaths; i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    // Randomize attributes for the path
    const randomLength = Math.random() * 50 + 10; // Random length for path
    const randomStrokeWidth = Math.random() * 3 + 1; // Random stroke width
    const randomOpacity = Math.random() * 0.5 + 0.5; // Random opacity between 0.5 and 1
    
    // Set the path attributes
    path.setAttribute("d", `M2.24 -${randomLength}L2.24 0Z`);
    path.setAttribute("stroke-width", randomStrokeWidth);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("opacity", randomOpacity);
    
    // Randomize initial X and Y positions (spread across screen width and vertical position)
    const initialX = Math.random() * (isMobile() ? window.innerWidth * 4 : window.innerWidth); // Random X position across the width of the screen
    const initialY = Math.random() * window.innerHeight - window.innerHeight; // Random Y position
    
    // Apply transform with both X and Y translation
    path.setAttribute("transform", `matrix(1, 0, 0, 1, ${initialX}, ${initialY})`);
    
    // Append the path to the <g> group
    group.appendChild(path);
  }
}

function setInitialPathPositions(paths) {
  paths.forEach(path => {
    const currentTransform = path.getAttribute('transform');
    const matrix = new DOMMatrix(currentTransform);
    const initialY = matrix.m42 - (isMobile() ? parseFloat(window.innerHeight * 2) : 0); // Keep the same initial Y position
    const initialX = matrix.m41; // Retain the initial X position
    path.setAttribute('transform', `matrix(1, 0, 0, 1, ${initialX}, ${initialY})`);
  });
}

function animatePathWithDelay(paths) {
  setInitialPathPositions(paths);
  const baseAnimationDuration = 20000; // Base duration
  const maxRandomOffset = 5000; // Max random time offset

  function getInitialY(path) {
    const transformAttribute = path.getAttribute('transform');
    const matrix = new DOMMatrix(transformAttribute);
    return matrix.m42;
  }

  function getInitialX(path) {
    const transformAttribute = path.getAttribute('transform');
    const matrix = new DOMMatrix(transformAttribute);
    return matrix.m41;
  }

  function animateSinglePath(path, initialStaggerDelay = 0) {
    const startY = getInitialY(path) - (isMobile() ? parseFloat(window.innerHeight) * 2 : 0);
    const startX = getInitialX(path); // Keep X position the same
    const endY = parseFloat(window.innerHeight * (isMobile() ? 8 : 4));
    let startTime;

    // Randomize duration for each path
    const randomDuration = baseAnimationDuration + (Math.random() * maxRandomOffset - maxRandomOffset / 2); // Randomized duration
    const randomInitialDelay = Math.random() * 5000 + initialStaggerDelay; // Randomized initial delay

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / randomDuration;

      if (progress >= 1) {
        path.setAttribute('transform', `matrix(1, 0, 0, 1, ${startX}, ${startY})`);
        startTime = timestamp; // Reset the time to repeat the animation
      } else {
        const newY = parseFloat(startY - progress * (startY - endY));
        path.setAttribute('transform', `matrix(1, 0, 0, 1, ${startX}, ${newY})`);
      }

      requestAnimationFrame(step);
    }

    setTimeout(() => requestAnimationFrame(step), randomInitialDelay); // Apply the random initial delay
  }

  paths.forEach((path, index) => {
    const initialStaggerDelay = index * 1000; // Staggered delay between path animations
    animateSinglePath(path, initialStaggerDelay); // Start animations with staggered delay
  });
}


// Animate Idle SVG (rain.svg)
function animateIdle() {
  const idle = document.getElementById("idle");
  const paths = idle.querySelectorAll('g path');
  animatePathWithDelay(paths);
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
        const newRadius = currentRadius + (radiusDifference * (elapsedTime / (animationDuration*2)));
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
  var container = document.querySelector('.container');
  var content = document.querySelectorAll('.fade-target');
  content.forEach((fadeItem) => {
    fadeItem.style.opacity = '0';
  });
  try {
    const response = await fetch(destinationURL);
    const newPage = await response.text();
    const animationPromise = Promise.all([
      await new Promise((resolve) => {
        animateCircles(targetBackground);
        resolve();
      }),
      await new Promise((resolve) => {
        setTimeout(() => {
          // Replace the container with the new page content
          const newContainer = document.createElement('div');
          newContainer.className = 'container';
          newContainer.innerHTML = newPage;
          container.parentNode.replaceChild(newContainer, container);

          // Update the reference to the container and content
          container = newContainer;
          content = container.querySelectorAll('.fade-target');
          setTimeout(() => {
            content.forEach((newFadeItem) => {
              newFadeItem.style.opacity = '1';
            });
          }, 100); // slight delay for browser rendering
          resolve();
        }, 2000);
      })
    ]);
    createPaths(200, idle);
    animateIdle();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}
// MAIN PAGE LISTENER/WINDOW ONLOAD FUNCTION TO SET UP EVENT LISTENERS
// Preload SVGs before setting up link event listeners
preloadSVGs(svgUrls).then(() => {
  window.onload = function() {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');
    var content = document.querySelectorAll('.fade-target');
    const idle = document.getElementById("idle");
    // Add fade-in class to trigger fade-in animation
    setTimeout(() => {
      content.forEach((element) => {
        element.style.opacity = '1';
      });
    }, 100); // slight delay for browser rendering
    // PROJECT LINK EXPANSION //
    // Initializing Properties
    const leftLink = document.querySelector('.left-link');
    const expandedLinks = document.querySelector('.expanded-links');
    expandedLinks.style.display = 'none';
    var isExpanded = false; // Flag to track the state of expanded links
    // Expand or Collapse Links
    leftLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isExpanded) {
            // Collapse the links
            expandedLinks.style.display = 'none';
            isExpanded = false;
            overlay.style.opacity = '0';
        } else {
            // Expand the links
            expandedLinks.style.display = 'flex';
            expandedLinks.style.alignItems = 'center';
            expandedLinks.style.flexDirection = 'column';
            expandedLinks.style.left = '25px';
            expandedLinks.style.top = '75px';
            isExpanded = true;
            overlay.style.opacity = '1';
        }
    });
    // Event listener for Home link
    home.addEventListener('click', function (event) {
      event.preventDefault();
      overlay.style.opacity = '0';
      expandedLinks.style.display = 'none';
      const destinationURL = home.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundOne.svg');
      handlePageTransition(destinationURL, targetBackground);
      home.blur();
    });
    // Event listeners for Projects links
    projects.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        expandedLinks.style.display = 'none';
        overlay.style.opacity = '0';
        const destinationURL = link.getAttribute('href');
        const targetBackground = getStoredSVG('backgroundTwo.svg');
        handlePageTransition(destinationURL, targetBackground);
        link.blur();
      });
    });
    // Event listener for More link
    more.addEventListener('click', function (event) {
      event.preventDefault();
      overlay.style.opacity = '0';
      expandedLinks.style.display = 'none';
      const destinationURL = more.getAttribute('href');
      const targetBackground = getStoredSVG('backgroundFive.svg');
      handlePageTransition(destinationURL, targetBackground);
      console.log("call page transition");
      more.blur();
    });
    createPaths(200, idle); // Generate 100 paths dynamically
    animateIdle();
  };
});