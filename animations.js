// animations.js
// Created by: Michael Emborsky
// Last Modified: 11/4/2023

// PURPOSE - Page Transition and Idle Animations //
// This javascript file is used to load, manipulate, and 
// animate 2 svg's, the background circles and the idle 
// floating 'paths'. 

// TO DO: implement changes in animations done based on users speed and device settings to ensure clean design regardless

// -- 1 -- REWRITE IDLE PATHS TO BE BETTER ON MOBILE FOR PERFORMANCE
// ----- possible steps - > use this instead path.style.transform = `translate(${startX}px, ${newY}px)`;
// ----- also handle all paths at once, then animate one by one
// function animateAllPaths(paths) {
//   function step(timestamp) {
//     paths.forEach(path => {
//       // compute newY from stored start/end values
//       // update path.style.transform
//     });
//     if (!isPageHidden) requestAnimationFrame(step);
//   }
//   requestAnimationFrame(step);
// }
//
// -- 2 -- Reduced motion?
// const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// if (reduceMotion) {
//   // use fewer paths and no circle transitions
// }
//
// -- 3 -- Stagger animations of circles, optimize all code in general



// Variable to check if page is hidden/visible
let isPageHidden = false;
// Array of Circle SVG's used
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg'
];
// Function to preload SVGs
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
// Function to check if user is on mobile device
function isMobile() {
  return window.innerWidth <= 430;
}
// Function to clear all paths from the current page
function clearPaths(container) {
  const group = container.querySelector('g');
  while (group.firstChild) {
    group.removeChild(group.firstChild);
  }
}
// Function to create and append paths dynamically into the <g> group
function createPaths(numPaths, container) {
  const group = container.querySelector('g');
  for (let i = 0; i < numPaths; i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const randomLength = Math.random() * 50 + 10;
    const randomStrokeWidth = Math.random() * 3 + 1;
    const randomOpacity = Math.random() * 0.5 + 0.5;
    path.setAttribute("d", `M2.24 -${randomLength}L2.24 0Z`);
    path.setAttribute("stroke-width", randomStrokeWidth);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("opacity", randomOpacity);
    const initialX = Math.random() * (isMobile() ? window.innerWidth * 4 : window.innerWidth);
    const initialY = Math.random() * window.innerHeight - window.innerHeight;
    path.setAttribute("transform", `matrix(1, 0, 0, 1, ${initialX}, ${initialY})`);
    group.appendChild(path);
  }
}
// Function for setting initial positions for each path
function setInitialPathPositions(paths) {
  paths.forEach(path => {
    const currentTransform = path.getAttribute('transform');
    const matrix = new DOMMatrix(currentTransform);
    const initialY = matrix.m42 - (isMobile() ? parseFloat(window.innerHeight * 2) : 0); 
    const initialX = matrix.m41; 
    path.setAttribute('transform', `matrix(1, 0, 0, 1, ${initialX}, ${initialY})`);
  });
}
// Function for animating single path
function animatePathWithDelay(paths) {
  setInitialPathPositions(paths);
  const baseAnimationDuration = 20000;
  const maxRandomOffset = 5000;
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
    const startX = getInitialX(path); 
    const endY = parseFloat(window.innerHeight * (isMobile() ? 8 : 4));
    let startTime;
    const randomDuration = baseAnimationDuration + (Math.random() * maxRandomOffset - maxRandomOffset / 2);
    const randomInitialDelay = Math.random() * 5000 + initialStaggerDelay; 

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / randomDuration;
      if (progress >= 1) {
        path.setAttribute('transform', `matrix(1, 0, 0, 1, ${startX}, ${startY})`);
        startTime = timestamp; 
      } else {
        const newY = parseFloat(startY - progress * (startY - endY));
        path.setAttribute('transform', `matrix(1, 0, 0, 1, ${startX}, ${newY})`);
      }

      if (!isPageHidden) {
        requestAnimationFrame(step);
      }
    }
    setTimeout(() => {
      if (!isPageHidden) {
        requestAnimationFrame(step);
      }
    }, randomInitialDelay);
  }
  paths.forEach((path, index) => {
    const initialStaggerDelay = index * 1000; 
    animateSinglePath(path, initialStaggerDelay);
  });
}
function getNumPaths() {
  if (isMobile()) return 50;       // mobile = light
  if (navigator.hardwareConcurrency <= 4) return 100; // weaker desktops
  return 200;                      // full effect
}
// Animate Idle SVG (bubbles.svg)
function animateIdle() {
  const idle = document.getElementById("idle");
  const paths = idle.querySelectorAll('g path');
  animatePathWithDelay(paths);
}


// Checks if page is inactive/not visible, and stops and restarts idle animation
document.addEventListener('visibilitychange', function () {
  isPageHidden = document.hidden;
  const idle = document.getElementById("idle");
  if (!isPageHidden) {
    createPaths(getNumPaths(), idle);
    animateIdle();
  } else {
    clearPaths(idle);
  }
});
// Circle Animation
function animateCircles(targetSVG) {
  const currentSVG = document.querySelector('.background-svg');
  const currentCircles = currentSVG.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');
  const animationDuration = 4000;
  const startTime = performance.now();
  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime < animationDuration) {
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        const currentRadius = parseFloat(currentCircle.getAttribute('r'));
        const radiusDifference = targetRadius - currentRadius;
        const newRadius = currentRadius + (radiusDifference * (elapsedTime / (animationDuration*2)));
        currentCircle.setAttribute('r', newRadius);
      });
      requestAnimationFrame(animate);
    } else {
      currentCircles.forEach((currentCircle, index) => {
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        currentCircle.setAttribute('r', targetRadius);
      });
    }
  }
  requestAnimationFrame(animate);
}

function runTerminalAnimation(container) {
  const lines = [
    "> booting...",
    "> ...",
    "> ...",
    "> status: ?unknown",
    "> awake.exe / dreaming.exe // loading",
    "> ...",
    "> memory> flicker | pulse | shift",
    "> echo <fragmented> // familiar? strange? yes",
    "> time ~ loop // skip // fold",
    "> curiosity++ // fear--",
    "if(edges.exist()) { explore(); }",
    "input = whispers + static + shadows",
    "decoding... // part 1, part 2, ?",
    "signal unstable / meaning???",
    "0xDEAD 0xBEEF / perception.overload();",
    "error 0xCAFEBABE: reality not found",
    "follow the glitches >> trace the echoes",
    "question everything.",
    "output = ?",
    "end sequence? or begin..."
  ];

  container.innerHTML = "";
  let lineIndex = 0;

  function typeLine(line, callback, repeat = 0) {
    let i = 0;
    let currentRepeat = 0;

    function typeOnce() {
      const interval = setInterval(() => {
        let char = line[i];
        if (Math.random() < 0.05) {
          container.innerHTML += `<span style="opacity:0.3">${char}</span>`;
        } else {
          container.innerHTML += char;
        }
        i++;

        // Auto-scroll
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });

        if (i >= line.length) {
          clearInterval(interval);
          container.innerHTML += "<br>";
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });

          // Repeat "..." line if needed
          if (line.trim() === "..." && currentRepeat < repeat) {
            currentRepeat++;
            i = 0;
            typeOnce();
          } else {
            callback();
          }
        }
      }, 50);
    }

    typeOnce();
  }

  function nextLine() {
    if (lineIndex < lines.length) {
      // Repeat "..." lines 2–3 times for thinking effect
      const repeatCount = lines[lineIndex].trim() === "..." ? 2 : 0;
      typeLine(lines[lineIndex], () => {
        lineIndex++;
        setTimeout(nextLine, 150);
      }, repeatCount);
    } else {
      container.innerHTML += '<span class="cursor">|</span>';
    }
  }

  nextLine();
}


// Main function to handle page transitions: transfers content from current 
// page to future page and triggers circle animation, starts new idle animation
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
          container.innerHTML = newPage;
          content = container.querySelectorAll('.fade-target');

          // RUNNING PAGE SPECIFIC ANIMATIONS
          const lotusmane = container.querySelector('.lotusmane-coverart');
          const centerHeaderText = container.querySelector('.center-link h1');
          const aboutMe = container.querySelector('.about-me');
          if (aboutMe) {
            aboutMe.addEventListener('mousemove', (e) => {
              const rect = aboutMe.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              aboutMe.style.setProperty('--mouse-x', `${x}%`);
              aboutMe.style.setProperty('--mouse-y', `${y}%`);
            });
            aboutMe.addEventListener('mouseleave', () => {
              aboutMe.style.setProperty('--mouse-x', `50%`);
              aboutMe.style.setProperty('--mouse-y', `50%`);
            });
          }
          const terminalContainer = container.querySelector('.terminal');
          if (terminalContainer) {
            runTerminalAnimation(terminalContainer);
          }
          setTimeout(() => {
            content.forEach((newFadeItem) => {
              newFadeItem.style.opacity = '1';
              if (lotusmane) {
                centerHeaderText.textContent = 'LOTUSMANE';
                lotusmane.style.opacity = '.7';
              }
              else {
                centerHeaderText.textContent = 'Lotus State';
              }
            });
          }, 100);
          resolve();
        }, 2000);
      })
    ]);
    createPaths(getNumPaths(), idle);
    animateIdle();
  } catch (error) {
    console.error('Error loading page:', error);
  }
}
// MAIN PAGE LISTENER/WINDOW ONLOAD FUNCTION TO SET UP EVENT LISTENERS
preloadSVGs(svgUrls).then(() => {
  window.onload = function() {
    const home = document.querySelector('.header-text');
    const projects = document.querySelectorAll('.link-left');
    const more = document.querySelector('.link-right');
    var content = document.querySelectorAll('.fade-target');
    const idle = document.getElementById("idle");
    setTimeout(() => {
      content.forEach((element) => {
        element.style.opacity = '1';
      });
    }, 100);
    // PROJECT LINK EXPANSION //
    // Initializing Properties
    const leftLink = document.querySelector('.left-link');
    const expandedLinks = document.querySelector('.expanded-links');
    expandedLinks.style.display = 'none';
    var isExpanded = false;
    leftLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (isExpanded) {
            expandedLinks.style.display = 'none';
            isExpanded = false;
            overlay.style.opacity = '0';
        } else {
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
      more.blur();
    });
    // Sets initial idle animation
    createPaths(getNumPaths(), idle);
    animateIdle();
  };
});