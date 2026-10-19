// animations.js
// Created by: Michael Emborsky
// Last Modified: 10/14/2026

// PURPOSE - Page Transition and Idle Animations //
// This javascript file is used to load, manipulate, and 
// animate 2 svg's, the background circles and the idle 
// floating 'paths'. 

// TO DO: implement changes in animations done based on users speed and device settings to ensure clean design regardless


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
  return currentSVG && currentSVG.src.includes(filename);
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
    const path = document.createElementNS("http://w3.org", "path");
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
  const mobileCheck = isMobile();
  const cachedWidth = window.innerWidth;
  const cachedHeight = window.innerHeight;

  const pathData = Array.from(paths).map((path, index) => {
    const transformAttr = path.getAttribute('transform');
    const matrix = new DOMMatrix(transformAttr);
    const startX = matrix.m41;
    const startY = matrix.m42 - (mobileCheck ? cachedHeight * 2 : 0);
    const endY = cachedHeight * (mobileCheck ? 8 : 4);
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
    if (isPageHidden) return;
    pathData.forEach(data => {
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


// PAGE SPECIFIC MECHANICS
// THE BLOB!


let blobAnimationFrameId = null;
let blobPaused = false;
let cachedBlobRect = null;
let blobResizeObserver = null;

function animateBlob() {
  let targetElement = null;
  let path = null;
  let baseHeight = 100; // --- RESTORED UNIFORM SYSTEM HEIGHT TO PREVENT DISTORTION ---

  if (document.getElementById('yt-player')) {
    targetElement = document.getElementById('yt-player');
    path = document.getElementById('fluid-shape');
    baseHeight = 100;
  } else if (document.getElementById('sc-player')) {
    targetElement = document.getElementById('sc-player');
    path = document.getElementById('beats-fluid-shape');
    baseHeight = 120; 
  } else if (document.querySelector('.lotusmane-coverart')) {
    targetElement = document.querySelector('.lotusmane-coverart');
    path = document.getElementById('fluid-shape'); 
    baseHeight = 100; 
  }

  if (!path || !targetElement) return;

  if (blobAnimationFrameId) {
    cancelAnimationFrame(blobAnimationFrameId);
  }
  if (blobResizeObserver) {
    blobResizeObserver.disconnect();
  }

  cachedBlobRect = targetElement.getBoundingClientRect();

  blobResizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      cachedBlobRect = targetElement.getBoundingClientRect();
    }
  });
  blobResizeObserver.observe(targetElement);

  const points = 48; 
  const center = 200;

  const pointData = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    return {
      angle: angle,
      phaseShift: angle * 2.5, 
      freq: 1.6, 
      amp: 10 + Math.random() * 4 
    };
  });

  let t = 0;

  function update() {
    t += 0.005; 
    
    if (!targetElement || !path || !cachedBlobRect) return;

    const rect = cachedBlobRect;
    
    // --- FINE-TUNED POSITIONING VIA DYNAMIC STYLE OVERRIDES ---
    const isLotusmane = !!document.getElementById('lotusmane') || window.location.pathname.includes('lotusmane');
    const svgElement = document.getElementById('video-blob-svg');
    if (svgElement && document.getElementById('yt-player')) {
      if (isMobile()) {
        if (isLotusmane) {
          // Shifts the blob up further to perfectly frame the Lotusmane video player
          svgElement.style.top = "calc(43% - 24px)"; 
        } else {
          // Adjust this value if you need the index page blob higher or lower
          svgElement.style.top = "calc(43% + 14px)";   
        }
      } else {
        // Desktop rules remain perfect and untouched
        if (isLotusmane) {
          svgElement.style.top = "calc(50% - 6px)";
        } else {
          svgElement.style.top = "calc(50% + 3.5% + 6px)"; 
        }
      }
    }

    if (targetElement.id === 'sc-player') {
      const parentContainer = targetElement.offsetParent;
      if (parentContainer) {
        const containerRect = parentContainer.getBoundingClientRect();
        const playerCenterY = (rect.top + rect.bottom) / 2;
        const beatsSvg = document.getElementById('beats-blob-svg');
        if (beatsSvg) {
          const svgRect = beatsSvg.getBoundingClientRect();
          const relativeCenterY = (playerCenterY - containerRect.top) - (svgRect.height / 2);
          beatsSvg.style.top = `${relativeCenterY}px`;
        }
      }
    }

    let aspectRatio = rect.height > 0 ? rect.width / rect.height : 1;
    let currentBaseHeight = baseHeight;

    if (targetElement.id === 'sc-player') {
      aspectRatio = rect.width / rect.height; 
      currentBaseHeight = 65; 
    }

    const baseWidth = currentBaseHeight * aspectRatio;
    
    const coords = pointData.map((p, i) => {
      const cos = Math.cos(p.angle);
      const sin = Math.sin(p.angle);
      
      const rectScale = 1 / Math.max(Math.abs(cos), Math.abs(sin));
      const rectX = cos * rectScale * baseWidth;
      const rectY = sin * rectScale * currentBaseHeight;
      
      const circX = cos * baseWidth;
      const circY = sin * currentBaseHeight;
      
      const cornerSoftening = 0.95;
      let finalBaseX = (rectX * cornerSoftening) + (circX * (1 - cornerSoftening));
      let finalBaseY = (rectY * cornerSoftening) + (circY * (1 - cornerSoftening));
      
      const verticalStretch = 1.04;
      finalBaseY *= verticalStretch;

      const organicWave = Math.sin(i * 0.5 + t * p.freq + p.phaseShift);
      const microRipple = Math.sin(i * 1.5 - t * 3.5) * 0.35; 
      const baseWave = (organicWave + microRipple + 1) / 2; 
      
      let fluidExtension = 0.01;
      fluidExtension += (0.04 + baseWave * 0.55) * p.amp; 
      
      const x = center + finalBaseX + (cos * fluidExtension);
      const y = center + finalBaseY + (sin * fluidExtension);
      return { x, y };
    });

    let d = `M${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length; i++) {
      const p0 = coords[i];
      const p1 = coords[(i + 1) % coords.length];
      
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      
      d += ` Q${p0.x},${p0.y} ${midX},${midY}`;
    }
    d += "Z";
    path.setAttribute("d", d);

    blobAnimationFrameId = requestAnimationFrame(update);
  }

  blobAnimationFrameId = requestAnimationFrame(update);
}



// VIDEO SHUFFLE FUNCTIONALITY (INTRO & LOTUSMANE)
const videoUrls = [
  "https://www.youtube-nocookie.com/embed/_Crf-vFNHNM?si=dy7AOstn90wRR7GD",
  "https://www.youtube-nocookie.com/embed/30yJlb5-0mQ?si=PgXtKYOs_LLrDJxj",
  "https://www.youtube-nocookie.com/embed/rRkpHfpYAo8?si=Uczqa5ZckrpbTuAh",
  "https://www.youtube-nocookie.com/embed/oy4ReeOaB9k?si=PrGVYmRrtsCvOkBI",
  "https://www.youtube-nocookie.com/embed/kQrBVd6QZAA?si=V5WnoEEvn6olMwuy",
  "https://www.youtube-nocookie.com/embed/H8pFcm9_tEg?si=1k5OXZ35gtP-iLhZ",
  "https://www.youtube-nocookie.com/embed/jyyE36DKAdk?si=C18rdo1ySwhkYnDm",
  "https://www.youtube-nocookie.com/embed/Oi0qbaL0Pyo?si=8xaSilW3M8V4Dr1W",
  "https://www.youtube-nocookie.com/embed/dWnM27Nn9YU?si=ix97YYscdIxaYYnw"
];

const lotusmaneVideoUrls = [
  "https://www.youtube-nocookie.com/embed/y6I0NHgKHTk?si=EuZ46JOCAtpi-Tvi",
];

let playedVideos = [];
let playedLotusmaneVideos = [];

function shuffleVideo() {
  const player = document.getElementById('yt-player');
  if (!player) return;

  // Determine if we are currently on the Lotusmane page
  const isLotusmane = !!document.getElementById('lotusmane') || window.location.pathname.includes('lotusmane');

  const pool = isLotusmane ? lotusmaneVideoUrls : videoUrls;
  let history = isLotusmane ? playedLotusmaneVideos : playedVideos;

  // Reset history pool if all videos from current pool have been played
  if (history.length >= pool.length) {
    history.length = 0; // Clears the active history array in-place
  }

  // Filter out videos that have already been played in this session
  const availableVideos = pool.filter(video => !history.includes(video));

  // Pick a random video from the remaining unplayed options
  const randomIndex = Math.floor(Math.random() * availableVideos.length);
  const selectedVideo = availableVideos[randomIndex];

  // Save to history and load video into player
  history.push(selectedVideo);
  player.src = selectedVideo;
}
// BEATS PAGE
// Soundcloud shuffle functionality for the beats page
const trackUrls = [
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1858906977&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1858905702&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2401911327&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2403367047&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2404392147&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
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

// EXTRA PAGE
// Interactive background hover effect for the extra page
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




// START OF MAIN JAVASCRIPT FUNCTIONALITY (RUNTIME)




// Main function to handle page transitions: transfers content from current 
// page to future page and triggers circle animation, starts new idle animation
async function handlePageTransition(destinationURL, targetBackground) {
  if (window.isTransitioning) return;
  window.isTransitioning = true;

  if (blobAnimationFrameId) {
    cancelAnimationFrame(blobAnimationFrameId);
    blobAnimationFrameId = null;
  }

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
    const newPageText = await response.text(); 

    // NEW: Parse the fetched text into a readable HTML document
    const parser = new DOMParser();
    const doc = parser.parseFromString(newPageText, 'text/html');
    // Extract ONLY the inner HTML of the fetched page's container
    const newContainerHTML = doc.querySelector('.container').innerHTML;

    await Promise.all([
      new Promise((resolve) => {
        animateCircles(targetBackground);
        resolve();
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          // NEW: Inject only the container contents, not the whole page
          container.innerHTML = newContainerHTML;
          
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
          try {
            animateBlob();
          } catch (err) {
            console.warn("Blob script skipped:", err.message);
          }
          
          if (container.querySelector('#sc-player')) {
            shuffleTrack();
          }
          if (document.getElementById('yt-player')) {
            shuffleVideo();
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
            window.isTransitioning = false; // Reset global lock
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
    window.isTransitioning = false; // Reset global lock on error
  }
}


// FIRST TIME INITIALIZER
function initUI() {
  const home = document.querySelector(".header-text");
  const projects = document.querySelectorAll(".link-left");
  const more = document.querySelector(".link-right");
  var content = document.querySelectorAll(".fade-target");
  const idle = document.getElementById("idle");
  if (document.getElementById('sc-player')) {
    shuffleTrack();
  }
  if (document.getElementById('yt-player')) {
    shuffleVideo();
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