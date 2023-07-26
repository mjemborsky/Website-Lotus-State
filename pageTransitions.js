document.addEventListener('DOMContentLoaded', function() {
  // BACKGROUND ANIMATION //
  // Initializing Links
  const index = document.querySelector('.header-text');
  const projects = document.querySelectorAll('.link-left');
  const more = document.querySelector('.link-right');

  // Get combined background file
  var backgrounds = document.querySelector('.backgrounds');

  // Get the first referenced SVG element using the xlink:href attribute
  var firstUse = document.querySelector('.background-svg:first-child');
  var referencedSvgId = firstUse.getAttribute('id'); // Remove the '#' symbol
  console.log(referencedSvgId);
  var referencedSvg = document.getElementById(referencedSvgId);
  console.log(referencedSvg);

  // Set the container background as the referenced SVG element
  var container = document.querySelector('.container');
  container.appendChild(referencedSvg.cloneNode(true));
  console.log('Page Background Applied');

  // Add CSS to make the SVG fill the container
  container.style.backgroundSize = "100% 100%";
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundPosition = "center";

  var currentBackground = referencedSvg;

  // Event Listeners
  // Background: index
  index.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.getElementById('#backgroundOne');
    animateBackground(currentBackground, targetBackground);
  });
  // Background: projects
  projects.forEach(function(link) {
    link.addEventListener('click', function(i) {
      i.preventDefault();
      var targetBackground = backgrounds.querySelector('#backgroundTwo');
      animateBackground(currentBackground, targetBackground);
    });
  });
  // Background: more
  more.addEventListener('click', function(i) {
    i.preventDefault();
    var targetBackground = backgrounds.querySelector('#backgroundFive');
    animateBackground(currentBackground, targetBackground);
  });

  function animateBackground(currentBackground, targetBackground) {
    // Add class for animation
    currentBackground.classList.add('animate-background');

    // Wait for the animation to finish
    setTimeout(function () {
      // Remove animation class
      currentBackground.classList.remove('animate-background');
      // Set target background to black
      targetBackground.style.fill = "black";
      // Set container background image
      var contentElement = document.querySelector('.container');
      contentElement.style.backgroundImage = "url('path/to/your/svg/file.svg')"; // Replace 'path/to/your/svg/file.svg' with the actual path to your target SVG
    }, 3000); // 3000ms is the animation duration, adjust as needed
  }
});
