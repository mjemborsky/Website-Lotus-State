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
});