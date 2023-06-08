

function createGrid() {
  const container = document.getElementById('grid-container');

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      container.appendChild(gridItem);

      gsap.fromTo(
        gridItem,
        {
          x: j * 10,
          y: i * 10,
        },
        {
          x: j * 10 + getRandomOffset(),
          y: i * 10 + getRandomOffset(),
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        }
      );
    }
  }
}

function getRandomOffset() {
  // Generate a random offset for the animation
  return Math.random() * 5 - 2.5;
}

// Call the createGrid function to initialize the animation
createGrid();