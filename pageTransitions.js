document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Get combined background file
  var backgrounds = document.querySelector('.backgrounds');

  // Get current container in use
  var container = document.querySelector('.container');
  // Get the first used <use> in the SVG on the page
  var firstUse = document.querySelector('use');
  // Get the id of the firstUse <use> element (which is the filename)
  var currentBackgroundId = firstUse.getAttribute('id');
  // Get the referenced SVG element using the xlink:href attribute
  var referencedSvgId = firstUse.getAttributeNS('http://www.w3.org/1999/xlink', 'href').slice(1);
  var referencedSvg = document.getElementById(referencedSvgId);
  // Get the outerHTML of the referenced SVG and set it as the container background
  var backgroundImageSvg = new XMLSerializer().serializeToString(referencedSvg);
  var backgroundImageUrl = 'data:image/svg+xml,' + encodeURIComponent(backgroundImageSvg);
  container.style.backgroundImage = 'url(' + backgroundImageUrl + ')';
  console.log('Page Background Applied');

  var currentBackground = backgroundImageSvg;

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.querySelector('symbol:nth-of-type(1)');
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      var targetBackground = backgrounds.querySelector('symbol:nth-of-type(2)');
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.querySelector('symbol:nth-of-type(5)');
    animateBackground(currentBackground, targetBackground);
  });

  function animateBackground(currentBackground, targetBackground) {
    // Fetch the Snap.svg instances of both SVGs
    var currentSnap = Snap.select(currentBackground);
    var targetSnap = Snap.select(targetBackground);
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

    // Animate circle positions from current to target positions with a 3-second duration
    Snap.animate(currentPositions, targetPositions, function (value) {
      currentCircles.forEach(function (circle, index) {
        circle.attr({ cx: value[index].cx, cy: value[index].cy });
      });
    }, 3000, mina.easeout, function() {
      // Animation completed
      currentSnap.attr({ fill: "none" });
      targetSnap.attr({ fill: "black" });
      contentElement.style.backgroundImage = "url('path/to/your/svg/file.svg')"; // Replace 'path/to/your/svg/file.svg' with the actual path to your target SVG
    });
  }
});
