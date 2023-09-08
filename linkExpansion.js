// linkExpansion.js
// Created by: Michael Emborsky
// Purpose: Main source of animations for Lotus State website, including 
// the expansion of the project sub-links in the header and the background page 
// transition animation and idle animation.


// IDEA: Maybe when index.html first loads, FOR THE FIRST TIME, loads from black and all elements fade in


document.addEventListener('DOMContentLoaded', function() {
  // PROJECT LINK EXPANSION //
  // Initializing Properties
  var leftLink = document.querySelector('.left-link');
  var expandedLinks = document.querySelector('.expanded-links');
  expandedLinks.style.display = 'none';
  var isExpanded = false; // Flag to track the state of expanded links
  // Expand or Collapse Links
  leftLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (isExpanded) {
      // Collapse the links
      expandedLinks.style.display = 'none';
      isExpanded = false;
    } else {
      // Expand the links
      expandedLinks.style.display = 'flex';
      expandedLinks.style.alignItems = 'center';
      expandedLinks.style.flexDirection = 'column';
      expandedLinks.style.left = '25px';
      expandedLinks.style.top = '75px';
      isExpanded = true;
    }
  });
});
