document.addEventListener('DOMContentLoaded', function() {
  // Get the link and expanded links container
  const linkLeft = document.querySelector('.link-left');
  const expandedLinks = document.querySelector('.expanded-links');

  // Add a click event listener to the link
  linkLeft.addEventListener('click', () => {
    // Toggle the visibility of the expanded links
    expandedLinks.classList.toggle('show');
  });
});