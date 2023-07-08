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