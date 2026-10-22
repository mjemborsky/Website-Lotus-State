// =========================================================================
// render-engine.js - Isolated Math & Animation Loops
// =========================================================================

export let blobAnimationFrameId = null;
let cachedBlobRect = null;
let blobResizeObserver = null;
let isPageHidden = false;

export function isMobile() {
  return window.innerWidth <= 430;
}

export function getPerformanceTier() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const screenWidth = window.innerWidth;
  if (reduceMotion || memory <= 2 || cores <= 2 || screenWidth <= 480) return 1;
  if (memory <= 4 || cores <= 4 || screenWidth <= 768) return 2;
  return 3;
}

export function getNumPaths() {
  const tier = getPerformanceTier();
  if (tier === 1) return 0;
  if (tier === 2) return 30;
  return 150;
}

export function shouldAnimateIdle() {
  return getPerformanceTier() > 1;
}

export function clearPaths(container) {
  if (!container) return;
  const group = container.querySelector('g');
  if (!group) return;
  while (group.firstChild) {
    group.removeChild(group.firstChild);
  }
}

export function createPaths(numPaths, container) {
  if (!container) return;
  const group = container.querySelector('g');
  if (!group) return;

  // Clear previous entries to avoid clumping stacks
  while (group.firstChild) {
    group.removeChild(group.firstChild);
  }

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

export function setInitialPathPositions(paths) {
  paths.forEach(path => {
    const currentTransform = path.getAttribute('transform');
    if (!currentTransform) return;
    const matrix = new DOMMatrix(currentTransform);
    const initialY = matrix.m42 - (isMobile() ? parseFloat(window.innerHeight * 2) : 0); 
    const initialX = matrix.m41; 
    path.setAttribute('transform', `matrix(1, 0, 0, 1, ${initialX}, ${initialY})`);
  });
}

export function animatePaths(paths) {
  if (!paths || paths.length === 0) return;
  const mobileCheck = isMobile();
  const cachedHeight = window.innerHeight;
  
  // Track execution runtime to handle modular page transitions seamlessly
  let animationStartTimestamp = null;

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
    if (!animationStartTimestamp) animationStartTimestamp = timestamp;
    
    // Normalize timeline offset context
    const runtimeClock = timestamp - animationStartTimestamp;

    pathData.forEach(data => {
      if (runtimeClock < data.delay) return;
      if (!data.startTime) data.startTime = runtimeClock;
      
      const elapsed = runtimeClock - data.startTime;
      const progress = (elapsed % data.duration) / data.duration;
      const newY = data.startY + (data.endY - data.startY) * progress;
      data.path.setAttribute('transform', `matrix(1, 0, 0, 1, ${data.startX}, ${newY})`);
    });
    
    if (!isPageHidden) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function animateIdle(customContainer) {
  const idle = customContainer || document.getElementById("idle");
  if (!idle) return;
  const paths = idle.querySelectorAll('g path');
  animatePaths(paths);
}

export function setPageHidden(hiddenState) {
  isPageHidden = hiddenState;
}

export function cancelBlobAnimation() {
  if (blobAnimationFrameId) {
    cancelAnimationFrame(blobAnimationFrameId);
    blobAnimationFrameId = null;
  }
  if (blobResizeObserver) {
    blobResizeObserver.disconnect();
    blobResizeObserver = null;
  }
}

export function animateBlob() {
  let targetElement = null;
  let path = null;
  let baseHeight = 100;

  if (document.getElementById('yt-player')) {
    targetElement = document.getElementById('yt-player');
    path = document.getElementById('fluid-shape');
    baseHeight = 100;
  } else if (document.getElementById('sc-player')) {
    targetElement = document.getElementById('sc-player');
    path = document.getElementById('beats-fluid-shape');
    baseHeight = 100; 
  } else if (document.querySelector('.lotusmane-coverart')) {
    targetElement = document.querySelector('.lotusmane-coverart');
    path = document.getElementById('fluid-shape'); 
    baseHeight = 100; 
  }

  if (!path || !targetElement) return;

  cancelBlobAnimation();

  cachedBlobRect = targetElement.getBoundingClientRect();
  blobResizeObserver = new ResizeObserver(() => {
    if (targetElement) cachedBlobRect = targetElement.getBoundingClientRect();
  });
  blobResizeObserver.observe(targetElement);

  const points = 48; 
  const center = 200;
  const pointData = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    return { angle, phaseShift: angle * 2.5, freq: 1.6, amp: 10 + Math.random() * 4 };
  });

  let t = 0;

  function update() {
    t += 0.005; 
    if (!targetElement || !path || !cachedBlobRect) return;
    const rect = cachedBlobRect;
    const isLotusmane = !!document.getElementById('lotusmane') || window.location.pathname.includes('lotusmane');
    const svgElement = document.getElementById('video-blob-svg');
    
    if (svgElement && document.getElementById('yt-player')) {
      if (isMobile()) {
        svgElement.style.top = isLotusmane ? "calc(43% - 24px)" : "calc(43% + 14px)";
      } else {
        svgElement.style.top = "calc(50% + 3.5% + 6px)";
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
      currentBaseHeight = 52; 
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
      
      finalBaseY *= 1.04;
      const baseWave = (Math.sin(i * 0.5 + t * p.freq + p.phaseShift) + Math.sin(i * 1.5 - t * 3.5) * 0.35 + 1) / 2; 
      let fluidExtension = 0.01 + (0.04 + baseWave * 0.55) * p.amp; 
      
      return { x: center + finalBaseX + (cos * fluidExtension), y: center + finalBaseY + (sin * fluidExtension) };
    });

    let d = `M${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length; i++) {
      const p0 = coords[i];
      const p1 = coords[(i + 1) % coords.length];
      d += ` Q${p0.x},${p0.y} ${(p0.x + p1.x) / 2},${(p0.y + p1.y) / 2}`;
    }
    d += "Z";
    path.setAttribute("d", d);
    blobAnimationFrameId = requestAnimationFrame(update);
  }
  blobAnimationFrameId = requestAnimationFrame(update);
}

export function animateCircles(targetSVG) {
  const currentSVG = document.querySelector('.background-svg');
  if (!currentSVG || !targetSVG) return;
  const currentCircles = currentSVG.querySelectorAll('circle');
  const targetCircles = targetSVG.querySelectorAll('circle');
  const animationDuration = 4000;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime < animationDuration) {
      currentCircles.forEach((currentCircle, index) => {
        if (!targetCircles[index]) return;
        const targetRadius = parseFloat(targetCircles[index].getAttribute('r'));
        const currentRadius = parseFloat(currentCircle.getAttribute('r'));
        const newRadius = currentRadius + ((targetRadius - currentRadius) * (elapsedTime / (animationDuration * 2)));
        currentCircle.setAttribute('r', newRadius);
      });
      requestAnimationFrame(animate);
    } else {
      currentCircles.forEach((currentCircle, index) => {
        if (targetCircles[index]) currentCircle.setAttribute('r', targetCircles[index].getAttribute('r'));
      });
    }
  }
  requestAnimationFrame(animate);
}
