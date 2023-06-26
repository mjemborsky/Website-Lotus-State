// Helper function to generate a random number within a given range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Helper function to generate a random color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to create a random triangle element
function createRandomTriangle() {
  var triangle = document.createElement('div');
  triangle.className = 'triangle';
  triangle.style.borderBottom = getRandomNumber(10, 20) + 'px solid ' + getRandomColor();
  triangle.style.borderLeft = getRandomNumber(10, 20) + 'px solid transparent';
  triangle.style.borderRight = getRandomNumber(10, 20) + 'px solid transparent';
  triangle.style.transform = 'rotate(' + getRandomNumber(0, 360) + 'deg)';
  return triangle;
}

// Function to add random triangles to the container
function addRandomTriangles() {
  var container = document.querySelector('.container');
  var numTriangles = 50; // Adjust the number of triangles as desired

  for (var i = 0; i < numTriangles; i++) {
    var triangle = createRandomTriangle();
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var posX = getRandomNumber(0, containerWidth);
    var posY = getRandomNumber(0, containerHeight);
    triangle.style.top = posY + 'px';
    triangle.style.left = posX + 'px';
    container.appendChild(triangle);
  }
}

// Call the function to add random triangles when the page loads
window.addEventListener('load', addRandomTriangles);