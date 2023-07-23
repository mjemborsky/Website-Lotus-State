function setSVGBackground() {
  // Get current svg object and container (maybe have this specifically on each page)
  var svgObject = document.querySelector('background-svg');
  var contentElement = document.querySelector('container');

  if (svgObject && svgObject.contentDocument && contentElement) {
    var svgDoc = svgObject.contentDocument;
    var svgElement = svgDoc.querySelector('background-svg');;
    if (svgElement) {
      // Get the SVG content as XML
      var svgContent = new XMLSerializer().serializeToString(svgElement);
      // Create a data URI for the SVG content
      var svgDataUri = 'data:image/svg+xml;base64,' + btoa(svgContent);
      // Apply the SVG content as a background image to the content element
      contentElement.style.backgroundImage = 'url(' + svgDataUri + ')';
      console.log("Background Applied");
    }
  }
  return svgObject;
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

  // NEED TO INITIALIZE CONTAINERS?

  const currentBackground = setSVGBackground();

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
    console.log("Animate Background");
 }
});
