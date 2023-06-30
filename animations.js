function animateCircles(sourceSVG, targetSVG, duration) {
  // Load the source and target SVG files
  var sourceCircles = Snap.selectAll(sourceSVG + ' g:first-of-type circle');
  var targetCircles = Snap.selectAll(targetSVG + ' g:first-of-type circle');

  // Extract the positions of the circles from the source SVG
  var sourcePositions = [];
  sourceCircles.forEach(function(circle) {
    sourcePositions.push({
      x: circle.attr('cx'),
      y: circle.attr('cy')
    });
  });

  // Extract the positions of the circles from the target SVG
  var targetPositions = [];
  targetCircles.forEach(function(circle) {
    targetPositions.push({
      x: circle.attr('cx'),
      y: circle.attr('cy')
    });
  });

  // Apply the positions from the source SVG to the target SVG
  targetCircles.forEach(function(circle, index) {
    circle.attr({
      cx: sourcePositions[index].x,
      cy: sourcePositions[index].y
    });
  });

  // Animate the circles to the new positions in the target SVG
  targetCircles.forEach(function(circle, index) {
    circle.animate({
      cx: targetPositions[index].x,
      cy: targetPositions[index].y
    }, duration);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Get all the links with the class "link-left"
  var links = document.querySelectorAll('.link-left');

  // Add click event listener to each link
  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default link behavior
      animateCircles('#background', '#backgroundTwo', 2000); // Adjust duration as needed
    });
  });
});