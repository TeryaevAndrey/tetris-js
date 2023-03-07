const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const cellSize = 70;

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

const drawGrid = () => {
  for (let x = 0; x <= 420; x += 70) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 770);
  }

  for (let y = 0; y <= 770; y += 70) {
    ctx.moveTo(0, y);
    ctx.lineTo(770, y);
  }

  ctx.strokeStyle = "#888";
  ctx.stroke();
};

const fallingFigures = [];
fallingFigures[0] = {
  y: 0,
  elIndex: Math.round(Math.random() * (3 - 0) + 0),
};

const draw = () => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  drawGrid();

  fallingFigures.forEach((figure) => {
    figures[figure.elIndex].forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (column === 1) {
          ctx.beginPath();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 4;
          ctx.fillStyle = "green";
          ctx.rect(
            cellSize * columnIndex,
            cellSize * rowIndex + figure.y,
            cellSize,
            cellSize
          );
          ctx.fill();
          ctx.stroke();
        }
      });
    });
    figure.y += 70;
  });
};

setInterval(draw, 200);

cvs.addEventListener("click", () => {
  figures[fallingFigures[0].elIndex] = figures[
    fallingFigures[0].elIndex
  ][0].map((val, index) =>
    figures[fallingFigures[0].elIndex].map((row) => row[index]).reverse()
  );
});
