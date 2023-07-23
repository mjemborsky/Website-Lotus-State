function findCurrentSymbolElement() {
  const useElements = document.getElementsByTagName('use');
  for (const useElement of useElements) {
    const href = useElement.getAttribute('xlink:href');
    const symbolId = href.substring(1); // Remove the leading '#' from the ID
    // Check if the symbol is currently used (active)
    if (useElement.instanceRoot === useElement && symbolId !== "") {
      return symbolId; // Return the ID of the active symbol
    }
  }
  return null; // Return null if no symbol is currently used
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

  let currentBackgroundSymbol;
  let currentBackground;

  // Get Current Background SVG
  window.addEventListener('load', function() {
    const currentSymbolElement = findCurrentSymbolElement();
  });

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
