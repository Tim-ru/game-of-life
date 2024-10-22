const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const generationCount = document.getElementById("generationCount");
const intervalInput = document.getElementById("intervalInput");
const setIntervalBtn = document.getElementById("setIntervalBtn");

let width = 100;
let height = 100;
let cellSize = 10;
let cells = [];
let previousCells = [];
let isRunning = false;
let generation = 0;
let interval = 100;
let intervalId = null;

function generateBoard() {
  width = parseInt(document.getElementById("widthInput").value);
  height = parseInt(document.getElementById("heightInput").value);
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;

  cells = new Array(height).fill(null).map(() => new Array(width).fill(false));
  previousCells = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));

  generation = 0;
  generationCount.textContent = generation;
  drawBoard();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cells[y][x]) {
        drawCell(x, y, "black");
      }
    }
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function randomizeBoard() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells[y][x] = Math.random() > 0.5;
    }
  }
  drawBoard();
}

function countAliveNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nx = (x + i + width) % width;
      const ny = (y + j + height) % height;
      if (cells[ny][nx]) count++;
    }
  }
  return count;
}

function nextGeneration() {
  const newCells = cells.map((row, y) =>
    row.map((cell, x) => {
      const aliveNeighbors = countAliveNeighbors(x, y);
      return cell
        ? aliveNeighbors === 2 || aliveNeighbors === 3
        : aliveNeighbors === 3;
    })
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (newCells[y][x] !== cells[y][x]) {
        drawCell(x, y, newCells[y][x] ? "black" : "white");
      } else if (newCells[y][x] && previousCells[y][x]) {
        drawCell(x, y, "green");
      }
    }
  }

  previousCells = cells.map((row) => [...row]); 
  cells = newCells;
  generation++;
  generationCount.textContent = generation;
}

function startGame() {
  if (!intervalId) {
    const step = () => {
      nextGeneration();
      intervalId = setTimeout(step, interval);
    };
    step();
  }
}

function stopGame() {
  clearTimeout(intervalId);
  intervalId = null;
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);

  cells[y][x] = !cells[y][x];
  drawCell(x, y, cells[y][x] ? "black" : "white");
});

document.getElementById("generateBtn").addEventListener("click", generateBoard);
document.getElementById("randomBtn").addEventListener("click", randomizeBoard);
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("stopBtn").addEventListener("click", stopGame);

setIntervalBtn.addEventListener("click", () => {
  interval = parseInt(intervalInput.value);
});

generateBoard();
