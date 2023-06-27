document.addEventListener("DOMContentLoaded", function() {
  // Get the container element
  var container = document.querySelector(".container");

  // Define an array of background image URLs
  var backgrounds = [
    "background.svg",
    "backgroundTwo.svg",
    "backgroundThree.svg",
    "backgroundFour.svg",
    "backgroundFive.svg"
  ];

  // Set the initial background image
  container.style.backgroundImage = "url('" + backgrounds[0] + "')";

  // Function to change the background image
  function changeBackground(index) {
    // Set the background image
    container.style.backgroundImage = "url('" + backgrounds[index] + "')";
  }

  // Add event listeners to links with the class "link-left"
  var linkLeft = document.querySelectorAll(".link-left");
  for (var i = 0; i < linkLeft.length; i++) {
    linkLeft[i].addEventListener("click", function() {
      // Call the changeBackground function with the index of backgroundTwo.svg
      changeBackground(1);
    });
  }

  // Add event listeners to links with the class "link-right"
  var linkRight = document.querySelectorAll(".link-right");
  for (var i = 0; i < linkRight.length; i++) {
    linkRight[i].addEventListener("click", function() {
      // Call the changeBackground function with the index of backgroundFive.svg
      changeBackground(4);
    });
  }
});