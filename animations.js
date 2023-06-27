document.addEventListener("DOMContentLoaded", function() {
  // Get the container element
  var container = document.querySelector(".container");

  // Define an array of background image URLs
  var backgrounds = [
    "background.svg",
    "backgroundTwo.svg",
    "backgroundThree.svg"
  ];

  // Set the initial background image
  container.style.backgroundImage = "url('" + backgrounds[0] + "')";

  // Function to change the background image
  function changeBackground() {
    // Get the current background image URL
    var currentBg = container.style.backgroundImage;

    // Get the index of the current background image in the array
    var currentIndex = backgrounds.indexOf(currentBg);

    // Calculate the index of the next background image
    var nextIndex = (currentIndex + 1) % backgrounds.length;

    // Set the next background image
    container.style.backgroundImage = "url('" + backgrounds[nextIndex] + "')";
  }

  // Call the changeBackground function every 3 seconds (3000 milliseconds)
  setInterval(changeBackground, 3000);
});
