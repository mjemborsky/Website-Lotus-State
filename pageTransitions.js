function setSVGBackground() {
  // Get current svg object and container (maybe have this specifically on each page)
  var svgObject = document.getElementById('backgroundOne');
  var contentElement = document.getElementById('container-one');

  if (svgObject && svgObject.contentDocument && contentElement) {
    var svgDoc = svgObject.contentDocument;
    var svgElement = svgDoc.getElementById('backgroundElement');
    if (svgElement) {
      // Get the SVG content as XML
      var svgContent = new XMLSerializer().serializeToString(svgElement);
      // Create a data URI for the SVG content
      var svgDataUri = 'data:image/svg+xml;base64,' + btoa(svgContent);
      // Apply the SVG content as a background image to the content element
      contentElement.style.backgroundImage = 'url(' + svgDataUri + ')';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Initializing SVG's
  // svgOne - for index.html
  const svgOne = document.getElementById('backgroundOne');
  // svgTwo - for any project pages
  const svgTwo = document.getElementById('backgroundTwo');
  // svgFive - for extra.html
  const svgFive = document.getElementById('backgroundFive');

  // NEED TO INITIALIZE CONTAINERS



  // Get Current Background SVG and Set
  let currentBackgroundSymbol;
  let currentBackground;

  currentBackgroundSymbol = findCurrentSymbolElement();
  if (currentBackgroundSymbol === 'backgroundOne') {
    // Code for when backgroundOne is active
    currentBackground = svgOne;
    console.log('backgroundOne is currently used.');
  } else if (currentBackgroundSymbol === 'backgroundTwo') {
    // Code for when backgroundTwo is active
    currentBackground = svgTwo;
    console.log('backgroundTwo is currently used.');
  } else if (currentBackgroundSymbol === 'backgroundFive') {
    // Code for when backgroundFive is active
    currentBackground = svgFive;
    console.log('backgroundFive is currently used.');
  } else {
    // Code for when none of the specified symbols is active
    currentBackground = svgOne;
    console.log('No specified symbol is currently used.');
  }

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = document.getElementById('backgroundOne');
    animateCircles(currentBackground, targetBackground);
  });

  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      const targetBackground = document.getElementById('backgroundTwo');
      animateCircles(currentBackground, targetBackground);
    });
  });

  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    const targetBackground = document.getElementById('backgroundFive');
    animateCircles(currentBackground, targetBackground);
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
 }
});
