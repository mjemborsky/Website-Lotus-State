
// WHEN ON INDEX.HTML (Homepage)
// IDEA: Maybe when index.html first loads, FOR THE FIRST TIME, loads from black and all elements fade in
// Implement unique idle animation, I am thinking like
// some sparkly, iridescent fluttery lights/patterns that will
// appear randomly overlayed on the background, kind of like
// embers from a fire or a similar effect
// This effect will most likely have to be a video file, but it needs to have a transparent
// background, and be overlayed over everything, with opacity down
// Could create in after effects, and COULD be a svg but animating the svg would be not good for performance
// It honestly might not require any javascript, and could be set up with css and have autoplay on

// WHEN ON PROJECT PAGES OR EXTRA.HTML
// Needs to wait for page to load
// Then it identifies the active svg and current points,
// then identifies the target svg based off the current (projects or extra)
// then WHILE the page is opened and not navigating,
// it should call a function, idleCircles that accepts one svg (target)
// It should animate the r values of the current svg to this new svg positions over 4 seconds, with no ease in or out (linear velocity)
// Then the code should call the function in reverse, so that it animates the circle positions back to the current svg over 4 seconds, same ease
// Honestly might be better to include in pageTransitions as it could be linked to the links as well as us the animation functions already described.

// isIdle = true;
    // // Check if the currentSVG matches a specific SVG filename
    // if (isCurrentSVG("backgroundTwo.svg")) {
    //   var idleSVG = getStoredSVG("backgroundThree.svg");
    // } else if (isCurrentSVG("backgroundFive.svg")) {
    //   var idleSVG = getStoredSVG("backgroundFour.svg");
    // } else {
    //   var idleSVG = document.getElementById('idle-video');
    // }
    // console.log(idleSVG);
    // // Call Idle Animation
    // while (isIdle) {
    //   // Check if idleSVG is sparkle, 
    //   // if it is
    //   // then load it on top of svg
    //   // else
    //   animateCircles(targetSVG);
    //   animateCircles(currentSVG);
    // }

// document.addEventListener('DOMContentLoaded', function () {
//     // Get all the circle elements within the SVG
//     const bubbleSVG = document.querySelector('svg:nth-child(2)');
//     console.log(bubbleSVG);
//     const bubbles = bubbleSVG.querySelectorAll('circle');
    
//     // Set the animation parameters
//     const animationDuration = 10000; // Animation duration in milliseconds
//     const initialY = 938; // Initial vertical position
//     const finalY = -50; // Final vertical position
//     const velocity = (finalY - initialY) / animationDuration; // Calculate velocity
    
//     // Define the animation function
//     function animateBubbles(timestamp) {
//         bubbles.forEach((bubble) => {
//             if (!bubble.startTime) {
//                 bubble.startTime = timestamp;
//             }
    
//             const elapsed = timestamp - bubble.startTime;
//             const newY = initialY + velocity * elapsed;
    
//             // Reset the circle's position when it reaches the top
//             if (newY < finalY) {
//                 bubble.startTime = timestamp; // Reset the start time for the circle
//             } else {
//                 bubble.setAttribute("cy", newY);
//                 console.log('cy');
//             }
//         });
    
//         requestAnimationFrame(animateBubbles);
//     }
//     // Start the animation loop
//     requestAnimationFrame(animateBubbles);
// });