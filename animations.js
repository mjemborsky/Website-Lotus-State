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
    expandedLinks.style.left = '25px';
    expandedLinks.style.top = '75px';
  });
});

// // Get the link elements
// const index = document.querySelector('.header-text');
// const projects = document.querySelector('.link-left');
// const more = document.querySelector('.link-right');

// // Add event listeners to the links
// index.addEventListener('click', () => {
//   animateBackground('page1-container', 'page1-background', '#container-one', '#background');
// });

// projects.addEventListener('click', () => {
//   animateBackground('page2-container', 'page2-background', '#container-two', '#backgroundTwo');
// });

// more.addEventListener('click', () => {
//   animateBackground('page3-container', 'page3-background', 'page1-container', '#backgroundFive');
// });

// // Animation function
// function animateBackground(currentContainerId, currentBackgroundId, nextContainerId, nextBackgroundId) {
//   const currentContainer = document.getElementById(currentContainerId);
//   const currentBackground = document.getElementById(currentBackgroundId);
//   const nextContainer = document.getElementById(nextContainerId);
//   const nextBackground = document.getElementById(nextBackgroundId);

//   // Add animation logic using a library like GSAP or any other animation



// function animateBackground(source, target) {
//   // Get the source and target SVG elements
//   const sourceSVG = document.getElementById(source);
//   const targetSVG = document.getElementById(target);

//   // Perform any necessary setup or adjustments before the animation

//   // Animate the circle positions
//   // You can use a library like GSAP (GreenSock Animation Platform) for smooth animations
//   // Here's an example using GSAP
//   gsap.to(sourceSVG.querySelectorAll('circle'), {
//     duration: 1, // Adjust the duration as needed
//     attr: {
//       cx: (index, target) => target.getAttribute('cx') // Animate the 'cx' attribute to the target value
//     },
//     onComplete: () => {
//       // Animation complete
//       // Update the current page and set the background to the target SVG
//       currentPage = target;
//       sourceSVG.style.display = 'none'; // Hide the source SVG
//       targetSVG.style.display = 'block'; // Show the target SVG
//     }
//   });
// }
