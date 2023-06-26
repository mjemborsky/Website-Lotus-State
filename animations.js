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

// Function to check if two triangles are within the specified distance
function areTrianglesClose(triangle1, triangle2, distance) {
  var rect1 = triangle1.getBoundingClientRect();
  var rect2 = triangle2.getBoundingClientRect();

  return (
    Math.abs(rect1.right - rect2.left) <= distance &&
    Math.abs(rect1.left - rect2.right) <= distance &&
    Math.abs(rect1.bottom - rect2.top) <= distance &&
    Math.abs(rect1.top - rect2.bottom) <= distance
  );
}

// Function to add random triangles in a grid formation
function addRandomTriangles() {
  var container = document.querySelector('.container');
  var numTriangles = 50; // Adjust the number of triangles as desired
  var triangles = [];

  var triangleWidth = 10; // Adjust the width of the triangles
  var triangleHeight = Math.sqrt(3) * (triangleWidth / 2); // Calculate the height based on the width

  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;

  var cols = Math.floor(containerWidth / (triangleWidth + 5)); // Calculate the number of columns
  var rows = Math.floor(containerHeight / (triangleHeight + 5)); // Calculate the number of rows

  for (var i = 0; i < numTriangles; i++) {
    var triangle = createRandomTriangle();
    triangles.push(triangle);

    var posX, posY;

    do {
      var col = i % cols;
      var row = Math.floor(i / cols);

      posX = col * (triangleWidth + 5);
      posY = row * (triangleHeight + 5);
      triangle.style.top = posY + 'px';
      triangle.style.left = posX + 'px';
    } while (
      triangles.some(function (otherTriangle) {
        return areTrianglesClose(triangle, otherTriangle, 5);
      })
    );

    container.appendChild(triangle);
  }
}

// Call the function to add random triangles when the page loads
window.addEventListener('load', addRandomTriangles);