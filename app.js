const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const cellSize = 70;

const drawGrid = () => {
  for(let x = 0; x <= 420; x += 70) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 770);
  }

  for(let y = 0; y <= 770; y += 70) {
    ctx.moveTo(0, y);
    ctx.lineTo(770, y);
  }

  ctx.strokeStyle = "#888";
  ctx.stroke();
}

const draw = () => {
  drawGrid();

  
};

setInterval(draw, 150);