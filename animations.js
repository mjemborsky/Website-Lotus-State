// animations.js
// Created by: Michael Emborsky
// Purpose: Main source of animations for Lotus State website, including 
// the expansion of the project sub-links in the header and the background page 
// transition animation and idle animation.


// IDEA: Maybe when index.html first loads, FOR THE FIRST TIME, loads from black and all elements fade in


document.addEventListener('DOMContentLoaded', function() {
  // For Expanding
  var leftLink = document.querySelector('.left-link');
  var expandedLinks = document.querySelector('.expanded-links');

  // Constants for Background Animation
  const index = document.querySelector('.header-text');
  const projects = document.querySelector('.link-left');
  const more = document.querySelector('.link-right');

  // Initializing
  expandedLinks.style.display = 'none';
  let currentBackground = "background.svg";
  let targetBackground = "";

  // EVENT LISTENERS //

  // Expanded Links
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

  // Background
  links.forEach(link => {
    link.addEventListener("click", handleClick);
  });

  // Handle link click event
  function handleClick(event) {
    event.preventDefault();
    const link = event.target;

    // Determine the target background based on the link's class
    if (link.classList.contains("link-left")) {
      targetBackground = "backgroundTwo.svg";
    } else if (link.classList.contains("header-text")) {
      targetBackground = "background.svg";
    } else if (link.classList.contains("link-right")) {
      targetBackground = "backgroundFive.svg";
    }

    // Animate the background transition
    animateBackground();
  }

  // Animate the background transition using GSAP
  function animateBackground() {
    gsap.to(".background", {
      opacity: 0, // Fade out the current background
      duration: 0.5,
      onComplete: () => {
        // Update the current background to the target background
        currentBackground = targetBackground;

        // Load the new page or update content accordingly
        // ...
        
        // Update the background image and fade it in
        gsap.set(".background", { backgroundImage: `url(${currentBackground})` });
        gsap.to(".background", { opacity: 1, duration: 0.5 });
      }
    });
  }

});




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
