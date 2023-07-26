const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
const cellSize = 50;
const gridWidth = cellSize * 9;
const gridHeight = cellSize * 15;

const figures = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [0, 1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

let fallingFigures = [];

fallingFigures[0] = {
  x: Math.round(Math.random() * (4 - 0) + 0) * cellSize,
  y: 0,
  el: Math.round(Math.random() * (figures.length - 1 - 0) + 0),
};

let direction = undefined;

console.log(figures[fallingFigures[0].el]);

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
    figure.y += cellSize;
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
};

setInterval(draw, 200);

document.addEventListener("keydown", getDirection);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    figures[fallingFigures[0].el] = figures[fallingFigures[0].el][0].map(
      (val, index) =>
        figures[fallingFigures[0].el].map((row) => row[index]).reverse()
    );
  }
});
