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

document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // NEED TO MAKE FUNCTION FOR SVG RETRIEVAL HERE
  // CALL WITH CURRENTBACKGROUND


  // SVG Extractor Function
  function getSVGContent(svgUrl, callback) {
    fetch(svgUrl)
      .then((response) => response.text())
      .then((svgContent) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgRoot = svgDoc.documentElement;
        callback(svgRoot);
      });
  }
  // Event Listeners
  let currentBackground; // Define this variable to store the current background SVG root
  const container = document.querySelector('.container');

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    var targetBackground = 'backgroundOne.svg';
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      var targetBackground = 'backgroundTwo.svg';
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    var targetBackground = 'backgroundFive.svg';
    animateBackground(currentBackground, targetBackground);
  });

  function animateBackground(currentBackground, targetBackground) {
    const container = document.querySelector('.container');

    // Add 'animating' class to disable pointer events during animation
    container.classList.add('animating');

    // Add 'fade-out' class to start the fading effect
    container.classList.add('fade-out');

    const currentCircles = extractCirclePositions(currentBackground);

    // Animate the circles' positions
    getSVGContent(targetBackground, function (targetSvgRoot) {
      // Assuming each circle has the class 'circle' in your SVGs
      const targetCircles = extractCirclePositions(targetSvgRoot);
      // Ensure the number of circles is the same in both SVGs
      if (currentCircles.length !== targetCircles.length) {
        console.error('The number of circles in the SVGs is different!');
        return;
      }

      const duration = 3000; // 3 seconds
      const startTime = performance.now();

      function updatePositions(timestamp) {
        const progress = (timestamp - startTime) / duration;

        // Inside the updatePositions function:
        if (progress >= 1) {
          // Animation is complete
          currentBackground = targetSvgRoot;

          // Remove the 'animating' class after animation is complete
          container.classList.remove('animating');
          // Remove the 'fade-out' class after animation is complete
          container.classList.remove('fade-out');
        }

        currentCircles.forEach((currentCircle, index) => {
          const targetCircle = targetCircles[index];
          const currentX = Number(currentCircle.getAttribute('cx'));
          const currentY = Number(currentCircle.getAttribute('cy'));
          const targetX = Number(targetCircle.getAttribute('cx'));
          const targetY = Number(targetCircle.getAttribute('cy'));

          const interpolatedX = currentX + (targetX - currentX) * progress;
          const interpolatedY = currentY + (targetY - currentY) * progress;

          currentCircle.setAttribute('cx', interpolatedX);
          currentCircle.setAttribute('cy', interpolatedY);
        });

        if (progress < 1) {
          requestAnimationFrame(updatePositions);
        }
      }
      requestAnimationFrame(updatePositions);
    });
  }
});
