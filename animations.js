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

// Function to check if two triangles overlap
function doTrianglesOverlap(triangle1, triangle2) {
  var rect1 = triangle1.getBoundingClientRect();
  var rect2 = triangle2.getBoundingClientRect();

  return !(
    rect1.right + 5 < rect2.left ||
    rect1.left - 5 > rect2.right ||
    rect1.bottom + 5 < rect2.top ||
    rect1.top - 5 > rect2.bottom
  );
}

// Function to add random triangles with a specific spacing
function addRandomTriangles() {
  var container = document.querySelector('.container');
  var numTriangles = 50; // Adjust the number of triangles as desired
  var triangles = [];

  for (var i = 0; i < numTriangles; i++) {
    var triangle = createRandomTriangle();
    triangles.push(triangle);

    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var posX, posY;

    do {
      posX = getRandomNumber(0, containerWidth);
      posY = getRandomNumber(0, containerHeight);
      triangle.style.top = posY + 'px';
      triangle.style.left = posX + 'px';
    } while (
      triangles.some(function (otherTriangle) {
        return doTrianglesOverlap(triangle, otherTriangle);
      })
    );

    container.appendChild(triangle);
  }
}


// Call the function to add random triangles when the page loads
window.addEventListener('load', addRandomTriangles);