const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const cellSize = 50;
const gridWidth = cellSize * 9;
const gridHeight = cellSize * 15;

const figures = [
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

let fallingFigures = [];
let cells = [];

for (let i = 0; i < 15; i++) {
  cells.push([]);
}

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < cells.length; j++) {
    cells[j].push(0);
  }
}

fallingFigures[0] = {
  x: Math.round(Math.random() * (4 - 0) + 0) * cellSize,
  y: 0,
  el: Math.round(Math.random() * (figures.length - 1 - 0) + 0),
};

let direction = undefined;

const getDirection = (e) => {
  if (e.key === "ArrowLeft") {
    direction = "left";
  }

  if (e.key === "ArrowRight") {
    direction = "right";
  }

  if (e.key === "ArrowUp") {
    direction = "up";
  }

  if (e.key === "ArrowDown") {
    direction = "down";
  }
};

const drawGrid = () => {
  for (let x = 0; x <= gridHeight; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gridHeight);
  }

  for (let y = 0; y <= gridHeight; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(gridHeight, y);
  }

  ctx.strokeStyle = "#888";
  ctx.stroke();
};

const draw = () => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  drawGrid();

  fallingFigures.forEach((figure) => {
    figures[figure.el].forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (column === 1) {
          ctx.beginPath();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 4;
          ctx.fillStyle = "green";
          ctx.rect(
            cellSize * columnIndex + figure.x,
            cellSize * rowIndex + figure.y,
            cellSize,
            cellSize
          );
          ctx.fill();
          ctx.stroke();
        }
      });
    });
  });

  const figure = fallingFigures[0];
  const figureWidth = figures[figure.el][0].length * cellSize;
  const figureHeight = figures[figure.el].length * cellSize;

  if (direction === "left" && figure.x > figureWidth) {
    figure.x -= figureWidth;
    direction = undefined;
  } else if (direction === "left") {
    figure.x = 0;
    direction = undefined;
  }
  if (
    direction === "right" &&
    figure.x !== gridWidth - figureWidth &&
    figure.x + figureWidth * 2 < gridWidth
  ) {
    figure.x += figureWidth;
    direction = undefined;
  } else if (direction === "right") {
    figure.x = gridWidth - figureWidth;
    direction = undefined;
  }

  const cellX = Math.floor(figure.x / cellSize);
  const cellY = Math.floor(figure.y / cellSize);

  if (
    cellY + figures[figure.el].length >= cells.length ||
    figures[figure.el].some((row, rowIndex) =>
      row.some((column, colIndex) => {
        const cellRow = cellY + rowIndex + 1;
        const cellCol = cellX + colIndex;
        return (
          column === 1 &&
          (cellRow >= cells.length || cells[cellRow][cellCol] === 1)
        );
      })
    )
  ) {
    for (let rowIndex = 0; rowIndex < figures[figure.el].length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < figures[figure.el][rowIndex].length;
        colIndex++
      ) {
        if (figures[figure.el][rowIndex][colIndex] === 1) {
          const cellRow = Math.floor(figure.y / cellSize) + rowIndex;
          const cellCol = Math.floor(figure.x / cellSize) + colIndex;
          cells[cellRow][cellCol] = 1;
        }
      }
    }

    fallingFigures.unshift({
      x: Math.round(Math.random() * (4 - 0) + 0) * cellSize,
      y: 0,
      el: Math.round(Math.random() * (figures.length - 1 - 0) + 0),
    });
  } else {
    figure.y += cellSize;
  }
};

setInterval(draw, 170);

document.addEventListener("keydown", getDirection);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    figures[fallingFigures[0].el] = figures[fallingFigures[0].el][0].map(
      (val, index) =>
        figures[fallingFigures[0].el].map((row) => row[index]).reverse()
    );
  }
});
