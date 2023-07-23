function setSVGBackground() {
  // Get current svg object and container (maybe have this specifically on each page)
  var svgObject = document.querySelector('.background-svg');
  var contentElement = document.querySelector('.container');

  if (svgObject && svgObject.contentDocument && contentElement) {
    var svgDoc = svgObject.contentDocument;
    var svgElement = svgDoc.querySelector('.background-svg');;
    if (svgElement) {
      // Get the SVG content as XML
      var svgContent = new XMLSerializer().serializeToString(svgElement);
      // Create a data URI for the SVG content
      var svgDataUri = 'data:image/svg+xml;base64,' + btoa(svgContent);
      // Apply the SVG content as a background image to the content element
      contentElement.style.backgroundImage = 'url(' + svgDataUri + ')';
      console.log("Background Applied");
    }
    return svgElement;
  }
}

function loadSVGFile(fileName) {
  return fetch(fileName) // Fetch the SVG file using its file name
    .then((response) => response.text())
    .then((svgContent) => {
      // Create a new DOM element for the SVG content
      const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
      return svgElement;
    })
    .catch((error) => {
      console.error('Error loading SVG file:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  const currentBackground = setSVGBackground();

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    loadSVGFile('backgroundOne').then(function(targetBackground) {
      animateBackground(currentBackground, targetBackground);
    });
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      loadSVGFile('backgroundTwo').then(function(targetBackground) {
        animateBackground(currentBackground, targetBackground);
      });
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    loadSVGFile('backgroundFive').then(function(targetBackground) {
      animateBackground(currentBackground, targetBackground);
    });
  });

  function animateBackground(currentBackground, targetBackground) {
    // Fetch the Snap.svg instances of both SVGs
    var currentSnap = Snap(currentBackground);
    var targetSnap = Snap(targetBackground);

    // Fetch all circles and positions from the current SVG
    var currentCircles = currentSnap.selectAll("circle");
    var currentPositions = [];
    currentCircles.forEach(function (circle) {
      currentPositions.push({
        cx: parseFloat(circle.attr("cx")),
        cy: parseFloat(circle.attr("cy"))
      });
    });

    // Fetch all circles and positions from the target SVG
    var targetCircles = targetSnap.selectAll("circle");
    var targetPositions = [];
    targetCircles.forEach(function (circle) {
      targetPositions.push({
        cx: parseFloat(circle.attr("cx")),
        cy: parseFloat(circle.attr("cy"))
      });
    });

    // Set the current background to black with current SVG elements on top
    currentSnap.attr({ fill: "black" });

    // Animate circle positions from current to target positions with a 3-second duration
    currentCircles.forEach(function (circle, index) {
      circle.animate({ cx: targetPositions[index].cx, cy: targetPositions[index].cy }, 3000);
    });

    // Set current background to target SVG after the animation
    setTimeout(function () {
      currentSnap.attr({ fill: "none" });
      targetSnap.attr({ fill: "black" });
    }, 3000); // Wait for the animation to complete (duration 3000ms)
  }
});
