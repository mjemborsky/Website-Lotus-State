function animateCircles(sourceSVG, targetSVG, duration) {
  // Load the source and target SVG files
  gsap.registerPlugin(MorphSVGPlugin);
  var sourceCircles = gsap.utils.toArray(sourceSVG + ' g:first-of-type circle');
  var targetCircles = gsap.utils.toArray(targetSVG + ' g:first-of-type circle');

  // Extract the positions of the circles from the source SVG
  var sourcePositions = [];
  sourceCircles.forEach(function(circle) {
    sourcePositions.push({
      x: circle.getAttribute('cx'),
      y: circle.getAttribute('cy')
    });
  });

  // Extract the positions of the circles from the target SVG
  var targetPositions = [];
  targetCircles.forEach(function(circle) {
    targetPositions.push({
      x: circle.getAttribute('cx'),
      y: circle.getAttribute('cy')
    });
  });

  // Apply the positions from the source SVG to the target SVG
  targetCircles.forEach(function(circle, index) {
    gsap.set(circle, {
      attr: {
        cx: sourcePositions[index].x,
        cy: sourcePositions[index].y
      }
    });
  });

  // Animate the circles to the new positions in the target SVG
  gsap.to(targetCircles, {
    duration: duration,
    attr: {
      cx: function(index, target) {
        return targetPositions[index].x;
      },
      cy: function(index, target) {
        return targetPositions[index].y;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Get all the links with the class "link-left"
  var links = document.querySelectorAll('.link-left');

  // Add click event listener to each link
  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default link behavior
      animateCircles('#background', '#backgroundTwo', 2);
    });
  });
});