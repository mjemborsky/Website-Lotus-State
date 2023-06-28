var container = document.querySelector(".container");
var backgrounds = [
  "background.svg",
  "backgroundTwo.svg",
  "backgroundThree.svg",
  "backgroundFour.svg",
  "backgroundFive.svg"
];

container.style.backgroundImage = "url('" + backgrounds[0] + "')";

$(document).ready(function() {
  $('.link-left').on('click', function() {
    pageTransitionOne();
  });
  $('.link-right').on('click', function() {
    pageTransitionOne();
  });
});


function pageTransitionOne() {
  // Get the SVG element
  const svg = document.getElementById('backgroundTwo.svg');

  // Get the circle elements
  const circles = svg.getElementsByTagName('circle');

  // Define the final positions array
  const finalPositions = [];

  // Iterate over the circles and extract their final positions
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const cx = parseFloat(circle.getAttribute('cx'));
    const cy = parseFloat(circle.getAttribute('cy'));

    // Add the final position to the array
    finalPositions.push({ cx, cy });
  }

  // Iterate over the circles and animate the transition
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const finalPosition = finalPositions[i];

    // Animate the circle's transition
    circle.animate(
      [
        { cx: circle.cx.baseVal.value, cy: circle.cy.baseVal.value },
        { cx: finalPosition.cx, cy: finalPosition.cy }
      ],
      {
        duration: 2000, // 2 seconds
        easing: 'ease-out' // Adjust easing function as needed
      }
    );
  }
}


// function animateCircles() {
//   const svg = document.getElementById('your-svg-id');
//   const circles = svg.getElementsByTagName('circle');

//   // Set initial positions from the first SVG
//   for (let i = 0; i < circles.length; i++) {
//     circles[i].setAttribute('cx', '50%');
//     circles[i].setAttribute('cy', '0');
//   }

//   // Animate the circles' positions to the second SVG
//   for (let i = 0; i < circles.length; i++) {
//     const finalCX = '50%';
//     const finalCY = '100%';
//     const duration = 2000; // Animation duration in milliseconds

//     // Use CSS animation to animate the circles' positions
//     circles[i].animate(
//       [
//         { cx: '50%', cy: '0' },
//         { cx: finalCX, cy: finalCY }
//       ],
//       {
//         duration: duration,
//         easing: 'ease-in-out',
//         fill: 'forwards'
//       }
//     );
//   }
// }

// var linkLeft = document.querySelectorAll(".link-left");
// var linkRight = document.querySelectorAll(".link-right");

// function changeBackgroundWithTransition(index) {
//   container.style.backgroundImage = "url('" + backgrounds[index] + "')";
// }

// function handleLinkClick(index) {
//   container.style.opacity = "0";
//   setTimeout(function() {
//     changeBackgroundWithTransition(index);
//     container.style.opacity = "1";
//   }, transitionDuration);
// }

// for (var i = 0; i < linkLeft.length; i++) {
//   linkLeft[i].addEventListener("click", function() {
//     handleLinkClick(1);
//   });
// }

// for (var i = 0; i < linkRight.length; i++) {
//   linkRight[i].addEventListener("click", function() {
//     handleLinkClick(4);
//   });
// }