// animations.js
// Created by: Michael Emborsky
// Purpose: Main source of animations for Lotus State website, including 
// the expansion of the project sub-links in the header and the background page 
// transition animation and idle animation.


// IDEA: Maybe when index.html first loads, FOR THE FIRST TIME, loads from black and all elements fade in


document.addEventListener('DOMContentLoaded', function() {
  // PROJECT LINK EXPANSION //
  // Initializing Properties
  var leftLink = document.querySelector('.left-link');
  var expandedLinks = document.querySelector('.expanded-links');
  expandedLinks.style.display = 'none';
  var isExpanded = false; // Flag to track the state of expanded links
  // Expand or Collapse Links
  leftLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (isExpanded) {
      // Collapse the links
      expandedLinks.style.display = 'none';
      isExpanded = false;
    } else {
      // Expand the links
      expandedLinks.style.display = 'flex';
      expandedLinks.style.alignItems = 'center';
      expandedLinks.style.flexDirection = 'column';
      expandedLinks.style.left = '25px';
      expandedLinks.style.top = '75px';
      isExpanded = true;
    }
  });

  // BACKGROUND ANIMATION //
  // Initializing Properties
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Function to get the background object element based on data attribute
  function getBackgroundObject() {
    const backgroundObjects = document.querySelectorAll('object[data]');
    const currentPath = window.location.pathname;

    for (const obj of backgroundObjects) {
      const dataValue = obj.getAttribute('data');
      if (dataValue && currentPath.includes(dataValue)) {
        return obj;
      }
    }
    return const obj = 'background.svg'; // Return null if no matching background object is found
  }

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackgroundId = this.getAttribute('data-background');
    const targetBackground = document.getElementById(targetBackgroundId);
    const currentBackground = getBackgroundObject();
    // Check if currentBackground exists and is not null
    if (currentBackground) {
      // Check if the element with ID targetBackground exists
      const targetBackground = document.getElementById('background');
      if (targetBackground) {
        // If all checks pass, call the animateCircles function
        animateCircles(currentBackground.contentDocument, targetBackground);
      } else {
        console.error('Element with ID "targetBackground" not found.');
      }
    } else {
      console.error('currentBackground is null.');
    }
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const targetBackgroundId = this.getAttribute('data-background');
      const targetBackground = document.getElementById(targetBackgroundId);
      const currentBackground = getBackgroundObject();
      // Check if currentBackground exists and is not null
      if (currentBackground) {
        // Check if the element with ID targetBackground exists
        const targetBackground = document.getElementById('backgroundTwo');
        if (targetBackground) {
          // If all checks pass, call the animateCircles function
          animateCircles(currentBackground.contentDocument, targetBackground);
        } else {
          console.error('Element with ID "targetBackground" not found.');
        }
      } else {
        console.error('currentBackground is null.');
      }
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackgroundId = this.getAttribute('data-background');
    const targetBackground = document.getElementById(targetBackgroundId);
    const currentBackground = getBackgroundObject();
    // Check if currentBackground exists and is not null
    if (currentBackground) {
      // Check if the element with ID targetBackground exists
      const targetBackground = document.getElementById('backgroundFive');
      if (targetBackground) {
        // If all checks pass, call the animateCircles function
        animateCircles(currentBackground.contentDocument, targetBackground);
      } else {
        console.error('Element with ID "targetBackground" not found.');
      }
    } else {
      console.error('currentBackground is null.');
    }
  });

  function animateCircles(currentBackground, targetBackground) {
    anime({
      targets: currentBackground.querySelectorAll('circle'),
      r: [576, 0], // From the initial radius to 0
      easing: 'easeInOutSine',
      duration: 1000, // Duration of the animation in milliseconds
      complete: function() {
      // After the animation is complete, switch the backgrounds
      currentBackground.style.display = 'none';
      targetBackground.style.display = 'block';
      }
    });
  };
});
