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



// BACKGROUND SVG HANDLING, PRELOAD SET UP
const svgCache = new Map();
const svgUrls = [
  'backgroundOne.svg',
  'backgroundTwo.svg',
  'backgroundFive.svg'
];
async function preloadSVGs(urls) {
  for (const url of urls) {
    if (!svgCache.has(url)) {
      const response = await fetch(url);
      const svgContent = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      svgCache.set(url, svgDoc.documentElement);
    }
  }
}
function getStoredSVG(url) {
  return svgCache.get(url).cloneNode(true);
}
const preloadPromise = preloadSVGs(svgUrls);

// Variable to check if page is hidden/visible
let isPageHidden = false;
// Function to check if the currentSVG matches a specific SVG filename
function isCurrentSVG(filename) {
  const currentSVG = document.querySelector('.background-svg');
  return currentSVG.src.includes(filename);
}
// Function to check if user is on mobile device
function isMobile() {
  return window.innerWidth <= 430;
}

function getPerformanceTier() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const memory = navigator.deviceMemory || 4; // GB, may be undefined in some browsers
  const cores = navigator.hardwareConcurrency || 4;
  const screenWidth = window.innerWidth;

  // Tier 1: Very low-end devices or accessibility settings
  if (reduceMotion || memory <= 2 || cores <= 2 || screenWidth <= 480) {
    return 1;
  }

  // Tier 2: Mid-range tablets, older laptops/desktops
  if (memory <= 4 || cores <= 4 || screenWidth <= 768) {
    return 2;
  }

  // Tier 3: Full-feature modern devices
  return 3;
}

function getNumPaths() {
  const tier = getPerformanceTier();
  if (tier === 1) return 0;
  if (tier === 2) return 30;
  return 150;
}
function shouldAnimateIdle() {
  return getPerformanceTier() > 1;
}

// IDLE ANIMATION
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


function animatePaths(paths) {
  const pathData = Array.from(paths).map((path, index) => {
    const transformAttr = path.getAttribute('transform');
    const matrix = new DOMMatrix(transformAttr);
    const startX = matrix.m41;
    const startY = matrix.m42 - (isMobile() ? window.innerHeight * 2 : 0);
    const endY = window.innerHeight * (isMobile() ? 8 : 4);
    const duration = 20000 + (Math.random() * 5000 - 2500);
    const delay = Math.random() * 5000 + index * 1000;

    return {
      path,
      startX,
      startY,
      endY,
      duration,
      delay,
      startTime: null,
    };
  });

  function step(timestamp) {
    pathData.forEach(data => {
      if (isPageHidden) return;

      if (timestamp < data.delay) return;

      if (!data.startTime) data.startTime = timestamp;
      const elapsed = timestamp - data.startTime - data.delay;
      const progress = (elapsed % data.duration) / data.duration;

      const newY = data.startY + (data.endY - data.startY) * progress;
      data.path.setAttribute('transform', `matrix(1, 0, 0, 1, ${data.startX}, ${newY})`);
    });

    if (!isPageHidden) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
// Animate Idle SVG (bubbles.svg)
function animateIdle() {
  const idle = document.getElementById("idle");
  const paths = idle.querySelectorAll('g path');
  animatePaths(paths);
}
// Checks if page is inactive/not visible, and stops and restarts idle animation
document.addEventListener('visibilitychange', function () {
  isPageHidden = document.hidden;
  const idle = document.getElementById("idle");
  if (!isPageHidden && shouldAnimateIdle()) {
    createPaths(getNumPaths(), idle);
    animateIdle();
  } else {
    clearPaths(idle);
  }
});



// CIRCLE ANIMATION
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


// EXTRA ANIMATION
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
          container.innerHTML += `<span style="opacity:1">${char}</span>`;
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

const trackUrls = [
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1858906977&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1858905702&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
];
let playedTracks = [];

function shuffleTrack() {
  const player = document.getElementById('sc-player');
  if (!player) return;

  // If all tracks have played once, reset the history pool safely
  if (playedTracks.length === trackUrls.length) {
    playedTracks = [];
  }

  // Filter out tracks that have already been played
  const availableTracks = trackUrls.filter(track => !playedTracks.includes(track));

  // Pick a random track from the remaining unplayed options
  const randomIndex = Math.floor(Math.random() * availableTracks.length);
  const selectedTrack = availableTracks[randomIndex];

  // Save this track to our played history so it won't be picked again
  playedTracks.push(selectedTrack);

  // Load the song into the player
  player.src = selectedTrack;
}

// Main function to handle page transitions: transfers content from current 
// page to future page and triggers circle animation, starts new idle animation
async function handlePageTransition(destinationURL, targetBackground) {
  var container = document.querySelector('.container');
  
  // 1. Target ALL elements that could contain or overlay your header text
  const mainHeaderH1 = document.querySelector('.center-link h1, .Acenter-link h1');
  const overlayHeaderText = document.querySelector('.header-text');
  
  // Check if the CURRENT page is Lotusmane before wiping the container
  const isCurrentlyLotusmane = !!container.querySelector('.lotusmane-coverart');

  // Query normal targets inside the container
  var currentContent = Array.from(container.querySelectorAll('.fade-target'));

  // If leaving Lotusmane, fade elements out smoothly
  if (isCurrentlyLotusmane) {
    if (mainHeaderH1) {
      mainHeaderH1.style.transition = 'opacity 0.4s ease-in-out';
      mainHeaderH1.style.opacity = '0';
    }
    if (overlayHeaderText) {
      overlayHeaderText.style.transition = 'opacity 0.4s ease-in-out';
      overlayHeaderText.style.opacity = '0';
    }
  }

  currentContent.forEach((fadeItem) => {
    fadeItem.style.opacity = '0';
  });

  try {
    const response = await fetch(destinationURL);
    const newPage = await response.text();
    
    await Promise.all([
      new Promise((resolve) => {
        animateCircles(targetBackground);
        resolve();
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          container.innerHTML = newPage;
          
          // Query fresh elements inside the container
          var newContent = Array.from(container.querySelectorAll('.fade-target'));

          // Check if the NEW incoming page is Lotusmane
          const incomingLotusmane = container.querySelector('.lotusmane-coverart');
          const aboutMe = container.querySelector('.about-me');
          
          // 2. MULTI-LAYER TEXT SWAP: Update text and fonts on BOTH layers simultaneously
          const headerLayers = [mainHeaderH1, overlayHeaderText].filter(Boolean);
          
          headerLayers.forEach(layer => {
            // If the layer is an <h1> tag, update textContent; if it's an <a> link, update textContent or innerText safely
            const textTarget = layer.tagName === 'H1' ? layer : (layer.querySelector('h1') || layer);
            
            if (incomingLotusmane) {
              textTarget.textContent = 'LOTUSMANE';
              layer.classList.remove('defaultTitle');
              layer.classList.add('lotusmaneTitle');
              
              if (!isCurrentlyLotusmane) {
                layer.style.transition = 'none';
                layer.style.opacity = '0';
              }
            } else {
              layer.classList.remove('lotusmaneTitle');
              layer.classList.add('defaultTitle');
              textTarget.textContent = 'Lotus State';
              
              if (!isCurrentlyLotusmane) {
                layer.style.opacity = '1';
              }
            }
          });

          // RUNNING OTHER PAGE SPECIFIC INTERACTIONS
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
          
          animateBlob();
          if (container.querySelector('#sc-player')) {
            shuffleTrack();
          }
          setTimeout(() => {
            // Fade container content back in
            newContent.forEach((newFadeItem) => {
              newFadeItem.style.opacity = '1';
            });
            
            // 3. Fade both header elements back up perfectly synchronized
            headerLayers.forEach(layer => {
              if (incomingLotusmane || isCurrentlyLotusmane) {
                layer.style.transition = 'opacity 0.6s ease-in-out';
                layer.style.opacity = '1';
              }
            });

            if (incomingLotusmane) {
              incomingLotusmane.style.opacity = '.7';
            }
          }, 50);
          resolve();
        }, 1250);
      })
    ]);

    if (shouldAnimateIdle()) {
      const idle = document.getElementById("idle");
      createPaths(getNumPaths(), idle);
      animateIdle();
    }
  } catch (error) {
    console.error('Error loading page:', error);
  }
}


// MAIN PAGE HANDLING FUNCTION AND INITIALIZER
function initUI() {
  const home = document.querySelector(".header-text");
  const projects = document.querySelectorAll(".link-left");
  const more = document.querySelector(".link-right");
  var content = document.querySelectorAll(".fade-target");
  const idle = document.getElementById("idle");

  if (document.getElementById('sc-player')) {
    shuffleTrack();
  }
  
  setTimeout(() => {
    content.forEach((element) => {
      element.style.opacity = "1";
    });
  }, 100);
  
  const leftLink = document.querySelector(".left-link");
  const expandedLinks = document.querySelector(".expanded-links");
  
  try {
    animateBlob();
  } catch (err) {
    console.warn("Blob script skipped:", err.message);
  }

  // Clean up states out-of-the-gate
  expandedLinks.classList.remove("show");
  const initialOverlay = document.getElementById("overlay");
  if (initialOverlay) {
    initialOverlay.style.opacity = "0";
    initialOverlay.style.zIndex = "4";
    initialOverlay.style.pointerEvents = "none";
  }

  // 1. LEFT LINK MENU TOGGLE WITH LIVE OVERLAY SCOPING
  leftLink.addEventListener("click", function (e) {
    e.preventDefault();
    const liveOverlay = document.getElementById("overlay"); // Always find it fresh in the DOM
    const isExpanded = expandedLinks.classList.contains("show");
    
    if (isExpanded) {
      expandedLinks.classList.remove("show");
      if (liveOverlay) {
        liveOverlay.style.opacity = "0";
        liveOverlay.style.zIndex = "4";
        liveOverlay.style.pointerEvents = "none";
      }
    } else {
      expandedLinks.classList.add("show");
      if (liveOverlay) {
        liveOverlay.style.opacity = "1";
        liveOverlay.style.zIndex = "15";
        liveOverlay.style.pointerEvents = "auto";
      }
    }
  });

  // 2. HOME NAVIGATION
  home.addEventListener("click", function (event) {
    event.preventDefault();
    const liveOverlay = document.getElementById("overlay");
    if (liveOverlay) liveOverlay.style.opacity = "0";
    expandedLinks.classList.remove("show");
    
    const destinationURL = home.getAttribute("href");
    const targetBackground = getStoredSVG("backgroundOne.svg");
    handlePageTransition(destinationURL, targetBackground);
    home.blur();
  });

  // 3. PROJECTS NAVIGATION
  projects.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const liveOverlay = document.getElementById("overlay");
      expandedLinks.classList.remove("show");
      if (liveOverlay) liveOverlay.style.opacity = "0";
      
      const destinationURL = link.getAttribute("href");
      const targetBackground = getStoredSVG("backgroundTwo.svg");
      handlePageTransition(destinationURL, targetBackground);
      link.blur();
    });
  });

  // 4. MORE NAVIGATION
  more.addEventListener("click", function (event) {
    event.preventDefault();
    const liveOverlay = document.getElementById("overlay");
    if (liveOverlay) liveOverlay.style.opacity = "0";
    expandedLinks.classList.remove("show");
    
    const destinationURL = more.getAttribute("href");
    const targetBackground = getStoredSVG("backgroundFive.svg");
    handlePageTransition(destinationURL, targetBackground);
    more.blur();
  });

  if (shouldAnimateIdle()) {
    createPaths(getNumPaths(), idle);
    animateIdle();
  }
}

preloadPromise.then(() => {
  const initWhenReady = () => {
    requestAnimationFrame(() => {
      initUI();
    });
  };

  if (document.readyState === "complete") {
    initWhenReady();
  } else {
    window.addEventListener("load", initWhenReady);
  }
});