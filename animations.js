document.addEventListener("DOMContentLoaded", function() {
  var container = document.querySelector(".container");
  var backgrounds = [
    "background.svg",
    "backgroundTwo.svg",
    "backgroundThree.svg",
    "backgroundFour.svg",
    "backgroundFive.svg"
  ];

  container.style.backgroundImage = "url('" + backgrounds[0] + "')";

  function changeBackground(index) {
    container.style.animation = "fade-out 0.5s";
    setTimeout(function() {
      container.style.backgroundImage = "url('" + backgrounds[index] + "')";
      container.style.animation = "fade-in 0.5s";
    }, 500);
  }

  var linkLeft = document.querySelectorAll(".link-left");
  for (var i = 0; i < linkLeft.length; i++) {
    linkLeft[i].addEventListener("click", function() {
      changeBackground(1);
    });
  }

  var linkRight = document.querySelectorAll(".link-right");
  for (var i = 0; i < linkRight.length; i++) {
    linkRight[i].addEventListener("click", function() {
      changeBackground(4);
    });
  }

  // Additional code to handle smooth transitions

  var transitionDuration = 2000; // 2 seconds

  container.style.transition = "background-image " + transitionDuration / 1000 + "s";

  function changeBackgroundWithTransition(index) {
    container.style.backgroundImage = "url('" + backgrounds[index] + "')";
  }

  for (var i = 0; i < linkLeft.length; i++) {
    linkLeft[i].addEventListener("click", function() {
      container.style.opacity = "0";
      setTimeout(function() {
        changeBackgroundWithTransition(1);
        container.style.opacity = "1";
      }, transitionDuration);
    });
  }

  for (var i = 0; i < linkRight.length; i++) {
    linkRight[i].addEventListener("click", function() {
      container.style.opacity = "0";
      setTimeout(function() {
        changeBackgroundWithTransition(4);
        container.style.opacity = "1";
      }, transitionDuration);
    });
  }
});