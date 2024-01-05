let initialCoordinate = null;
let bestRoute = [];
let shelves = [
  { x: 2, y: 2 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 2, y: 5 },
  { x: 2, y: 6 },
  { x: 2, y: 7 },
  { x: 4, y: 2 },
  { x: 4, y: 3 },
  { x: 4, y: 4 },
  { x: 4, y: 5 },
  { x: 4, y: 6 },
  { x: 4, y: 7 },
  { x: 6, y: 2 },
  { x: 6, y: 3 },
  { x: 6, y: 4 },
  { x: 6, y: 5 },
  { x: 6, y: 6 },
  { x: 6, y: 7 },
  { x: 8, y: 2 },
  { x: 8, y: 3 },
  { x: 8, y: 4 },
  { x: 8, y: 5 },
  { x: 8, y: 6 },
  { x: 8, y: 7 },
];

function createGrid() {
  const gridElement = document.getElementById('grid');

  gridElement.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-item');
      cell.dataset.x = j + 1;
      cell.dataset.y = i + 1;
      cell.textContent = `${cell.dataset.x},${cell.dataset.y}`;

      gridElement.appendChild(cell);
    }
  }
}

function createMinimap() {
  const minimapElement = document.getElementById('minimap');

  minimapElement.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement('div');
      cell.classList.add('minimap');
      cell.dataset.x = j + 1;
      cell.dataset.y = i + 1;
      cell.textContent = `${cell.dataset.x},${cell.dataset.y}`;

      minimapElement.appendChild(cell);
    }
  }
}

function updateCoordinate() {
  const input = document.getElementById('coordinatesInput').value;
  const [x, y] = input.split(',');

  const gridItems = document.querySelectorAll('.grid-item');
  const minimapItems = document.querySelectorAll('.minimap');

  gridItems.forEach((item) => {
    item.classList.remove('highlighted');
    if (item.dataset.x === x && item.dataset.y === y) {
      item.classList.add('highlighted');
      initialCoordinate = { x, y };
    }
  });

  minimapItems.forEach((item) => {
    item.classList.remove(
      'minimap-highlighted',
      'minimap-best-route',
      'platform',
      'other-shelf'
    );
    if (item.dataset.x === x && item.dataset.y === y) {
      item.classList.add('minimap-highlighted');
    }
  });
  highlightBestRoute();
}

function findBestRoute(target) {
  const visited = new Set();
  const queue = [{ x: 1, y: 1, path: [] }];

  while (queue.length > 0) {
    const current = queue.shift();
    const { x, y, path } = current;
    const key = `${x},${y}`;

    if (visited.has(key)) continue;

    visited.add(key);
    path.push({ x, y });

    if (x === target.x && y === target.y) {
      return path;
    }

    if (x + 1 <= 8) queue.push({ x: x + 1, y, path: [...path] });
    if (y + 1 <= 8) queue.push({ x, y: y + 1, path: [...path] });
  }

  return [];
}

function highlightBestRouteToShelf(shelf) {
  if (initialCoordinate) {
    bestRoute = findBestRoute({ x: shelf.x - 1, y: shelf.y });

    const minimapItems = document.querySelectorAll('.minimap');

    minimapItems.forEach((item) => {
      item.classList.remove('minimap-best-route', 'platform', 'other-shelf');
    });

    bestRoute.forEach((coords) => {
      const key = `${coords.x},${coords.y}`;
      const item = document.querySelector(
        `.minimap[data-x="${coords.x}"][data-y="${coords.y}"]`
      );

      if (item && !isShelfCell(coords)) {
        item.classList.add('minimap-best-route');
      }
    });

    // Highlight the selected platform
    const selectedPlatform = document.querySelector(
      `.minimap[data-x="${shelf.x}"][data-y="${shelf.y}"]`
    );
    if (selectedPlatform) {
      selectedPlatform.classList.add('platform');
    }

    // Add 'other-shelf' class to prateleiras que não são a selecionada
    const otherShelves = shelves.filter(
      (shelfItem) => shelfItem.x !== shelf.x || shelfItem.y !== shelf.y
    );
    otherShelves.forEach((otherShelf) => {
      const otherShelfItem = document.querySelector(
        `.minimap[data-x="${otherShelf.x}"][data-y="${otherShelf.y}"]`
      );
      if (otherShelfItem) {
        otherShelfItem.classList.add('other-shelf');
      }
    });
  }
}

function isShelfCell(coords) {
  return shelves.some((shelf) => shelf.x === coords.x && shelf.y === coords.y);
}

function highlightBestRoute() {
  if (initialCoordinate) {
    const input = document.getElementById('coordinatesInput').value;
    const [xInput, yInput] = input.split(',');
    const target = { x: parseInt(xInput), y: parseInt(yInput) };

    const selectedPlatform = shelves.find(
      (shelf) => shelf.x === target.x && shelf.y === target.y
    );
    if (selectedPlatform) {
      highlightBestRouteToShelf(selectedPlatform);
    }
  }
}

window.onload = function () {
  createGrid();
  createMinimap();
  updateCoordinate();
};
