import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const CELL_SIZE = Math.min(window.innerHeight, window.innerWidth) / 128; // px
const GRID_SIZE = [64, 64];
const GRID_COLOR = '#2f78aa';
const DEAD_COLOR = '#0f588a';
const ALIVE_COLOR = '#50d890';

let universe, height, width;

const canvas = document.getElementById('life-canvas');
const playPauseBtn = document.getElementById('play-pause');
const stepBtn = document.getElementById('step');
const resetBtn = document.getElementById('reset');
const speedInput = document.getElementById('speed');

let speed = 100;
speedInput.value = speed;

const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => row * width + column;

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const index = getIndex(row, col);
      ctx.fillStyle = cells[index] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const draw = () => {
  drawGrid();
  drawCells();
};

const init = () => {
  universe = Universe.new(GRID_SIZE[0], GRID_SIZE[1]);
  width = universe.width();
  height = universe.height();
  canvas.height = (CELL_SIZE + 1) * height + 1;
  canvas.width = (CELL_SIZE + 1) * width + 1;
  draw();
};

init();

let lastTick = Date.now();
let isPlaying = true;

const tick = () => {
  universe.tick();
  lastTick = Date.now();
};

const renderLoop = () => {
  if (!isPlaying) {
    return;
  }

  // universe.tick();
  if (Date.now() - lastTick >= 100 - speed && isPlaying) {
    tick();
  }

  draw();

  requestAnimationFrame(renderLoop);
};

canvas.addEventListener('click', function(event) {
  const coords = {
    x: event.offsetX / (CELL_SIZE + 1),
    y: event.offsetY / (CELL_SIZE + 1),
  };
  universe.toggle_cell(coords.y, coords.x);
  draw();
});

playPauseBtn.addEventListener('click', function() {
  isPlaying ? pause() : play();
});

stepBtn.addEventListener('click', function() {
  tick();
  draw();
});

speedInput.addEventListener('change', function(event) {
  speed = event.target.value;
});

resetBtn.addEventListener('click', function() {
  init();
  pause();
});

const updatePlayPauseBtn = () => {
  if (isPlaying) {
    playPauseBtn.innerText = 'pause';
    stepBtn.disabled = true;
    return;
  }
  stepBtn.disabled = false;
  playPauseBtn.innerText = 'play';
};

const play = () => {
  lastTick = Date.now();
  isPlaying = true;
  draw();
  requestAnimationFrame(renderLoop);
  updatePlayPauseBtn();
};

const pause = () => {
  isPlaying = false;
  draw();
  updatePlayPauseBtn();
};

updatePlayPauseBtn();
requestAnimationFrame(renderLoop);
