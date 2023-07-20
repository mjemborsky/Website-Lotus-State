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
    return null; // Return null if no matching background object is found
  }

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackgroundId = this.getAttribute('data-background');
    const targetBackground = document.getElementById(targetBackgroundId);
    const currentBackground = getBackgroundObject();
    animateCircles(currentBackground.contentDocument, targetBackground);
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const targetBackgroundId = this.getAttribute('data-background');
      const targetBackground = document.getElementById(targetBackgroundId);
      const currentBackground = getBackgroundObject();
      animateCircles(currentBackground.contentDocument, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackgroundId = this.getAttribute('data-background');
    const targetBackground = document.getElementById(targetBackgroundId);
    const currentBackground = getBackgroundObject();
    animateCircles(currentBackground.contentDocument, targetBackground);
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
  // Animating Background
  // function animateCircles(currentBackground, targetBackground) {
  //   // Get the circles from the currentBackground SVG
  //   const currentCircles = Array.from(currentBackground.getElementsByTagName('circle'));

  //   // Get the circles from the targetBackground SVG
  //   const targetCircles = Array.from(targetBackground.getElementsByTagName('circle'));

  //   // Store the initial positions and required information of the current circles
  //   const initialPositions = currentCircles.map(circle => ({
  //     cx: circle.getAttribute('cx'),
  //     cy: circle.getAttribute('cy'),
  //     radius: circle.getAttribute('r')
  //     // Add any other required information you need
  //   }));

  //   // Store the target positions and required information of the target circles
  //   const targetPositions = targetCircles.map(circle => ({
  //     cx: circle.getAttribute('cx'),
  //     cy: circle.getAttribute('cy'),
  //     radius: circle.getAttribute('r')
  //     // Add any other required information you need
  //   }));

  //   // Animate the positions of the circles
  //   // You can use any animation library or implement your own animation logic here

  //   // Example using the anime.js library
  //   anime({
  //     targets: currentCircles,
  //     duration: 1000, // Animation duration in milliseconds
  //     easing: 'easeInOutSine', // Easing function
  //     update: function (anim) {
  //       const progress = anim.progress; // Animation progress from 0 to 1

  //       // Update the position of each circle based on the progress
  //       currentCircles.forEach((circle, index) => {
  //         const initialPos = initialPositions[index];
  //         const targetPos = targetPositions[index];

  //         const currentX = initialPos.cx + (targetPos.cx - initialPos.cx) * progress;
  //         const currentY = initialPos.cy + (targetPos.cy - initialPos.cy) * progress;

  //         circle.setAttribute('cx', currentX);
  //         circle.setAttribute('cy', currentY);
  //       });
  //     }
  //   });
  // }
//   // Get the circles from the current background SVG
//   const currentCircles = Array.from(currentBackground.getElementsByTagName("circle"));

//   // Get the circles from the target background SVG
//   const targetCircles = Array.from(targetBackgroundClone.getElementsByTagName("circle"));

//   // Store the initial positions and required information of the current circles
//   const initialPositions = currentCircles.map((circle) => ({
//     cx: circle.getAttribute("cx"),
//     cy: circle.getAttribute("cy"),
//     radius: circle.getAttribute("r"),
//     // Add any other required information you need
//   }));

//   // Store the target positions and required information of the target circles
//   const targetPositions = targetCircles.map((circle) => ({
//     cx: circle.getAttribute("cx"),
//     cy: circle.getAttribute("cy"),
//     radius: circle.getAttribute("r"),
//     // Add any other required information you need
//   }));

//   // Set the initial positions of the target circles to match the current circles
//   targetCircles.forEach((circle, index) => {
//     const initialPos = initialPositions[index];
//     circle.setAttribute("cx", initialPos.cx);
//     circle.setAttribute("cy", initialPos.cy);
//   });

//   // Animate the positions of the circles
//   anime({
//     targets: targetCircles,
//     duration: 1000, // Animation duration in milliseconds
//     easing: "easeInOutSine", // Easing function
//     update: function (anim) {
//       const progress = anim.progress; // Animation progress from 0 to 1

//       // Update the position of each circle based on the progress
//       targetCircles.forEach((circle, index) => {
//         const initialPos = initialPositions[index];
//         const targetPos = targetPositions[index];

//         const currentX = initialPos.cx + (targetPos.cx - initialPos.cx) * progress;
//         const currentY = initialPos.cy + (targetPos.cy - initialPos.cy) * progress;

//         circle.setAttribute("cx", currentX);
//         circle.setAttribute("cy", currentY);
//       });
//     },
//     complete: function () {
//       // Remove the target background clone from the container
//       container.removeChild(targetBackgroundClone);
//     },
//   });
// }

