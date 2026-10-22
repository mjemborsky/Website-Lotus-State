// =========================================================================
// main.js - Application Bindings & Page Routines
// =========================================================================

import * as Engine from './render-engine.js';

const svgCache = new Map();
const svgUrls = ['backgroundOne.svg', 'backgroundTwo.svg', 'backgroundFive.svg'];

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
  return svgCache.get(url)?.cloneNode(true);
}

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
  const isLotusmane = !!document.getElementById('lotusmane') || window.location.pathname.includes('lotusmane');
  const pool = isLotusmane ? lotusmaneVideoUrls : videoUrls;
  let history = isLotusmane ? playedLotusmaneVideos : playedVideos;

  if (history.length >= pool.length) history.length = 0;
  const availableVideos = pool.filter(video => !history.includes(video));
  const selectedVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
  
  history.push(selectedVideo);
  player.src = selectedVideo;
}

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
  if (playedTracks.length === trackUrls.length) playedTracks = [];
  const availableTracks = trackUrls.filter(track => !playedTracks.includes(track));
  const selectedTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
  playedTracks.push(selectedTrack);
  player.src = selectedTrack;
}

function runTerminalAnimation(container) {
  const lines = [
    "> booting...", "> ...", "> status: ?unknown",
    "> awake.exe / dreaming.exe // loading", "> ...",
    "if(edges.exist()) { explore(); }", "question everything."
  ];
  container.innerHTML = "";
  let lineIndex = 0;
  function nextLine() {
    if (lineIndex < lines.length) {
      let i = 0;
      const interval = setInterval(() => {
        container.innerHTML += lines[lineIndex][i];
        i++;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        if (i >= lines[lineIndex].length) {
          clearInterval(interval);
          container.innerHTML += "<br>";
          lineIndex++;
          setTimeout(nextLine, 150);
        }
      }, 50);
    } else {
      container.innerHTML += '<span class="cursor">|</span>';
    }
  }
  nextLine();
}

async function handlePageTransition(destinationURL, targetBackground) {
  if (window.isTransitioning) return;
  window.isTransitioning = true;
  Engine.cancelBlobAnimation();

  const container = document.querySelector('.container');
  const mainHeaderH1 = document.querySelector('.center-link h1, .Acenter-link h1');
  const overlayHeaderText = document.querySelector('.header-text');
  const isCurrentlyLotusmane = !!container.querySelector('.lotusmane-coverart');
  const currentContent = Array.from(container.querySelectorAll('.fade-target'));
  
  if (isCurrentlyLotusmane) {
    if (mainHeaderH1) mainHeaderH1.style.opacity = '0';
    if (overlayHeaderText) overlayHeaderText.style.opacity = '0';
  }
  currentContent.forEach(item => item.style.opacity = '0');
  
  try {
    const response = await fetch(destinationURL);
    const newPageText = await response.text(); 
    const parser = new DOMParser();
    const doc = parser.parseFromString(newPageText, 'text/html');
    const newContainerHTML = doc.querySelector('.container').innerHTML;

    Engine.animateCircles(targetBackground);

    setTimeout(() => {
      container.innerHTML = newContainerHTML;
      const newContent = Array.from(container.querySelectorAll('.fade-target'));
      const incomingLotusmane = container.querySelector('.lotusmane-coverart');
      const aboutMe = container.querySelector('.about-me');
      
      const headerLayers = [mainHeaderH1, overlayHeaderText].filter(Boolean);
      headerLayers.forEach(layer => {
        const textTarget = layer.tagName === 'H1' ? layer : (layer.querySelector('h1') || layer);
        if (incomingLotusmane) {
          textTarget.textContent = 'LOTUSMANE';
          layer.classList.remove('defaultTitle');
          layer.classList.add('lotusmaneTitle');
        } else {
          layer.classList.remove('lotusmaneTitle');
          layer.classList.add('defaultTitle');
          textTarget.textContent = 'Lotus State';
        }
      });
      
      if (aboutMe) {
        aboutMe.addEventListener('mousemove', (e) => {
          const rect = aboutMe.getBoundingClientRect();
          aboutMe.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          aboutMe.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
      }
      
      const terminalContainer = container.querySelector('.terminal');
      if (terminalContainer) runTerminalAnimation(terminalContainer);
      
      try { Engine.animateBlob(); } catch(e) {}
      if (container.querySelector('#sc-player')) shuffleTrack();
      if (document.getElementById('yt-player')) shuffleVideo();
      
      if (Engine.shouldAnimateIdle()) {
        const idle = document.getElementById("idle");
        if (idle) {
          Engine.createPaths(Engine.getNumPaths(), idle);
          Engine.animateIdle(idle);
        }
      }
      
      setTimeout(() => {
        newContent.forEach(item => item.style.opacity = '1');
        headerLayers.forEach(layer => layer.style.opacity = '1');
        
        initUI();
        window.isTransitioning = false;
      }, 50);
    }, 1250);

  } catch (error) {
    window.isTransitioning = false;
  }
}


function initUI() {
  const home = document.querySelector(".header-text");
  const projects = document.querySelectorAll(".link-left");
  const more = document.querySelector(".link-right");
  const content = document.querySelectorAll(".fade-target");
  const idle = document.getElementById("idle");

  setTimeout(() => content.forEach(el => el.style.opacity = "1"), 100);

  const leftLink = document.querySelector(".left-link");
  const expandedLinks = document.querySelector(".expanded-links");
  try { Engine.animateBlob(); } catch(e) {}

  leftLink?.addEventListener("click", (e) => {
    e.preventDefault();
    const liveOverlay = document.getElementById("overlay");
    const isExpanded = expandedLinks?.classList.contains("show");
    
    if (isExpanded) {
      expandedLinks?.classList.remove("show");
      if (liveOverlay) {
        liveOverlay.style.opacity = "0";
        liveOverlay.style.zIndex = "4";
        liveOverlay.style.pointerEvents = "none";
      }
    } else {
      expandedLinks?.classList.add("show");
      if (liveOverlay) {
        liveOverlay.style.opacity = "1";
        liveOverlay.style.zIndex = "15";
        liveOverlay.style.pointerEvents = "auto";
      }
    }
  });

  home?.addEventListener("click", (e) => {
    e.preventDefault();
    expandedLinks?.classList.remove("show");
    const liveOverlay = document.getElementById("overlay");
    if (liveOverlay) {
      liveOverlay.style.opacity = "0";
      liveOverlay.style.pointerEvents = "none";
    }
    handlePageTransition(home.getAttribute("href"), getStoredSVG("backgroundOne.svg"));
  });

  projects.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      expandedLinks?.classList.remove("show");
      const liveOverlay = document.getElementById("overlay");
      if (liveOverlay) {
        liveOverlay.style.opacity = "0";
        liveOverlay.style.pointerEvents = "none";
      }
      handlePageTransition(link.getAttribute("href"), getStoredSVG("backgroundTwo.svg"));
    });
  });

  more?.addEventListener("click", (e) => {
    e.preventDefault();
    expandedLinks?.classList.remove("show");
    const liveOverlay = document.getElementById("overlay");
    if (liveOverlay) {
      liveOverlay.style.opacity = "0";
      liveOverlay.style.pointerEvents = "none";
    }
    handlePageTransition(more.getAttribute("href"), getStoredSVG("backgroundFive.svg"));
  });

  if (Engine.shouldAnimateIdle() && idle) {
    Engine.createPaths(Engine.getNumPaths(), idle);
    Engine.animateIdle(idle);
  }
}

// Explicit window bindings to allow old inline elements to resolve safely
window.shuffleVideo = shuffleVideo;
window.shuffleTrack = shuffleTrack;

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('shuffle-btn')) {
    e.preventDefault();
    if (document.getElementById('yt-player')) {
      shuffleVideo();
    } else if (document.getElementById('sc-player')) {
      shuffleTrack();
    }
  }
});

document.addEventListener('visibilitychange', () => {
  const hidden = document.hidden;
  Engine.setPageHidden(hidden);
  const idle = document.getElementById("idle");
  if (Engine.shouldAnimateIdle() && idle) {
    Engine.createPaths(Engine.getNumPaths(), idle);
    Engine.animateIdle(idle);
  }
});

preloadSVGs(svgUrls).then(() => {
  if (document.readyState === "complete") {
    initUI();
  } else {
    window.addEventListener("load", initUI);
  }
});