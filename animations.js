// animations.js
// Created by: Michael Emborsky
// Purpose: Main source of animations for Lotus State website, including 
// the expansion of the project sub-links in the header and the background page 
// transition animation and idle animation.

// Function: Responsible for displaying either the "Projects" label or the various sub options.
document.addEventListener('DOMContentLoaded', function() {
  var leftLink = document.querySelector('.left-link');
  var expandedLinks = document.querySelector('.expanded-links');
  // Initially hide the expanded links
  expandedLinks.style.display = 'none';
  // When the left link is clicked
  leftLink.addEventListener('click', function(e) {
    e.preventDefault();

    // Hide the left link
    leftLink.style.display = 'none';

    // Show the expanded links
    expandedLinks.style.display = 'flex';

    // Set CSS properties dynamically using JavaScript
    expandedLinks.style.alignItems = 'center';
    expandedLinks.style.flexDirection = 'column';
    expandedLinks.style.left = '20px';
    expandedLinks.style.top = '20px';
  });
});








// Function: Potential animation for circles
// function animateCircles(sourceSVG, targetSVG, duration) {
//   // Load the source and target SVG files
//   var sourceCircles = Snap.selectAll(sourceSVG + ' g:first-of-type circle');
//   var targetCircles = Snap.selectAll(targetSVG + ' g:first-of-type circle');

//   // Extract the positions of the circles from the source SVG
//   var sourcePositions = [];
//   sourceCircles.forEach(function(circle) {
//     sourcePositions.push({
//       x: circle.attr('cx'),
//       y: circle.attr('cy')
//     });
//   });

//   // Extract the positions of the circles from the target SVG
//   var targetPositions = [];
//   targetCircles.forEach(function(circle) {
//     targetPositions.push({
//       x: circle.attr('cx'),
//       y: circle.attr('cy')
//     });
//   });

//   // Apply the positions from the source SVG to the target SVG
//   targetCircles.forEach(function(circle, index) {
//     circle.attr({
//       cx: sourcePositions[index].x,
//       cy: sourcePositions[index].y
//     });
//   });

//   // Animate the circles to the new positions in the target SVG
//   targetCircles.forEach(function(circle, index) {
//     circle.animate({
//       cx: targetPositions[index].x,
//       cy: targetPositions[index].y
//     }, duration);
//   });
// }
// window.onload = function () {
//         // Set the initial background color to solid black
//         var container = document.querySelector('.container-two');
//         container.style.backgroundColor = '#000';

//         // After 2 seconds, change the background color back to the default
//         setTimeout(function () {
//           animateCircles('#background', '#backgroundTwo', 2000);
//           container.style.backgroundColor = '';
//         }, 2000);
//       };