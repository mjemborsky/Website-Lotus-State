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

  var container = document.querySelector('.container');
  var firstUse = document.querySelector('use');
  var currentBackground = firstUse.instanceRoot;
  container.style.backgroundImage = 'url(' + currentBackground + ')';
  console.log('Page Background Applied');


  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    loadSVGFile('backgroundOne.svg').then(function(targetBackground) {
      animateBackground(currentBackground, targetBackground);
    });
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      loadSVGFile('backgroundTwo.svg').then(function(targetBackground) {
        animateBackground(currentBackground, targetBackground);
      });
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    loadSVGFile('backgroundFive.svg').then(function(targetBackground) {
      animateBackground(currentBackground, targetBackground);
    });
  });

  function animateBackground(currentBackground, targetBackground) {
    // Fetch the Snap.svg instances of both SVGs
    var currentSnap = Snap(currentBackground);
    var targetSnap = Snap(targetBackground);
    var contentElement = document.querySelector('.container');

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

    currentCircles.forEach(function (circle, index) {
      circle.addClass('animate-circle'); // Add a class for animation
    });


    // // Animate circle positions from current to target positions with a 3-second duration
    // currentCircles.forEach(function (circle, index) {
    //   circle.animate(
    //     { cx: targetPositions[index].cx, cy: targetPositions[index].cy },
    //     3000, // 3 seconds duration
    //     function() {
    //       console.log("Circle " + index + " animation completed.");
    //     }
    //   );
    // });

    // Set current background to target SVG after the animation
    setTimeout(function () {
      currentSnap.attr({ fill: "none" });
      targetSnap.attr({ fill: "black" });
    }, 3000); // Wait for the animation to complete (duration 3000ms)

    contentElement.style.backgroundImage = "url(data:image/svg+xml;utf8," + targetBackground + ")";
  }
  console.log("animated!");
});
