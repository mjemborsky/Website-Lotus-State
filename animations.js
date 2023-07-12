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

  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const link = i.target;
    targetBackground = "background.svg";
    animateBackground(targetBackground);
  })

  // Background: projects
  projects.addEventListener('click', function(i) {
    i.preventDefault();
    const link = i.target;
    targetBackground = "backgroundTwo.svg";
    animateBackground(targetBackground);
  })

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const link = i.target;
    targetBackground = "backgroundFive.svg";
    animateBackground(targetBackground);
  })

  // Animate the background transition using GSAP
  function animateBackground(targetBackground) {
    gsap.to(targetBackground {
      opacity: 0, // Fade out the current background
      duration: 0.5,
      onComplete: () => {
        // Update the current background to the target background
        currentBackground = targetBackground;

        // Load the new page or update content accordingly

        // Update the background image
        gsap.set(".background", { backgroundImage: `url(${currentBackground})` });
        return currentBackground;
      }

    });
    return currentBackground;
  }

});
