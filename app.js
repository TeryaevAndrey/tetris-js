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
  el: figures[Math.round(Math.random() * (figures.length - 1 - 0) + 0)],
};

let direction = undefined;
let isFalling = true;
let lastFrameTime = 0;
const fps = 10;
const frameInterval = 1000 / fps;

const getDirection = (e) => {
  if (isFalling) {
    if (e.key === "ArrowLeft") {
      direction = "left";
    } else if (e.key === "ArrowRight") {
      direction = "right";
    } else if (e.key === "ArrowUp") {
      direction = "up";
    } else if (e.key === "ArrowDown") {
      direction = "down";
    }
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

const draw = (timestamp) => {
  const elapsed = timestamp - lastFrameTime;

  if (elapsed > frameInterval) {
    lastFrameTime = timestamp;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    drawGrid();

    fallingFigures.forEach((figure) => {
      figure.el.forEach((row, rowIndex) => {
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
    const figureWidth = fallingFigures[0].el[0].length * cellSize;
    const figureHeight = fallingFigures[0].el.length * cellSize;

    const cellX = Math.floor(figure.x / cellSize);
    const cellY = Math.floor(figure.y / cellSize);

    const rightStop = figure.el.some((row, rowIdx) => {
      return row.some((col, colIdx) => {
        const cellRow = cellY + rowIdx;
        const cellCol = cellX + colIdx;

        return cells[cellRow][cellCol + 1] === 1;
      });
    });

    const leftStop = figure.el.some((row, rowIdx) => {
      return row.some((col, colIdx) => {
        const cellRow = cellY + rowIdx;
        const cellCol = cellX + colIdx;

        return cells[cellRow][cellCol - 1] === 1;
      });
    });

    if (direction === "left" && figure.x >= cellSize && !leftStop) {
      figure.x -= cellSize;
      direction = undefined;
    } else if (
      direction === "right" &&
      figure.x + figureWidth < gridWidth &&
      !rightStop
    ) {
      figure.x += cellSize;
      direction = undefined;
    }

    if (
      cellY + fallingFigures[0].el.length >= cells.length ||
      fallingFigures[0].el.some((row, rowIndex) =>
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
      for (
        let rowIndex = 0;
        rowIndex < fallingFigures[0].el.length;
        rowIndex++
      ) {
        for (
          let colIndex = 0;
          colIndex < fallingFigures[0].el[rowIndex].length;
          colIndex++
        ) {
          if (fallingFigures[0].el[rowIndex][colIndex] === 1) {
            const cellRow = Math.floor(figure.y / cellSize) + rowIndex;
            const cellCol = Math.floor(figure.x / cellSize) + colIndex;
            cells[cellRow][cellCol] = 1;
          }
        }
      }

      isFalling = false;
      direction = undefined;

      fallingFigures.unshift({
        x: Math.round(Math.random() * (4 - 0) + 0) * cellSize,
        y: 0,
        el: figures[Math.round(Math.random() * (figures.length - 1 - 0) + 0)],
      });

      isFalling = true;
    } else {
      figure.y += cellSize;
    }
  }

  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);

document.addEventListener("keydown", getDirection);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    fallingFigures[0].el = fallingFigures[0].el[0].map((val, index) =>
      fallingFigures[0].el.map((row) => row[index]).reverse()
    );
  }
});
