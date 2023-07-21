
document.addEventListener('load', function() {
  // BACKGROUND ANIMATION //
  // Initializing Properties
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');
  const currentBackground = getFirstSvgElement()

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = document.getElementById('background');
    const currentBackground = getBackgroundObject();
    animateCircles(currentBackground.contentDocument, targetBackground);
    // // Check if currentBackground exists and is not null
    // if (currentBackground) {
    //   // Check if the element with ID targetBackground exists
    //   const targetBackground = document.getElementById('background');
    //   if (targetBackground) {
    //     // If all checks pass, call the animateCircles function
    //     animateCircles(currentBackground.contentDocument, targetBackground);
    //   } else {
    //     console.error('Element with ID "targetBackground" not found.');
    //   }
    // } else {
    //   console.error('currentBackground is null.');
    // }
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const targetBackground = document.getElementById('backgroundTwo');
      const currentBackground = getBackgroundObject();
      animateCircles(currentBackground.contentDocument, targetBackground);
      // const targetBackgroundId = this.getAttribute('data-background');
      // const targetBackground = document.getElementById(targetBackgroundId);
      // const currentBackground = getBackgroundObject();
      // // Check if currentBackground exists and is not null
      // if (currentBackground) {
      //   // Check if the element with ID targetBackground exists
      //   const targetBackground = document.getElementById('backgroundTwo');
      //   if (targetBackground) {
      //     // If all checks pass, call the animateCircles function
      //     animateCircles(currentBackground.contentDocument, targetBackground);
      //   } else {
      //     console.error('Element with ID "targetBackground" not found.');
      //   }
      // } else {
      //   console.error('currentBackground is null.');
      // }
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = document.getElementById('backgroundFive');
    const currentBackground = getBackgroundObject();
    animateCircles(currentBackground.contentDocument, targetBackground);
    // // Check if currentBackground exists and is not null
    // if (currentBackground) {
    //   // Check if the element with ID targetBackground exists
    //   const targetBackground = document.getElementById('backgroundFive');
    //   if (targetBackground) {
    //     // If all checks pass, call the animateCircles function
    //     animateCircles(currentBackground.contentDocument, targetBackground);
    //   } else {
    //     console.error('Element with ID "targetBackground" not found.');
    //   }
    // } else {
    //   console.error('currentBackground is null.');
    // }
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


function getFirstSvgElement() {
  const svgElements = document.getElementsByTagName("svg");
  if (svgElements.length > 0) {
    return svgElements[0];
  }
  return null; // Return null if no SVG elements are found on the page
}