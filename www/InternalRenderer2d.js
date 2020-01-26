import { Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

import { GRID_COLOR, CELL_SIZE, DEAD_COLOR, ALIVE_COLOR } from './settings';
import { State } from './state';
import { getIndex } from './getIndex';

export class InternalRenderer2d {
  ctx = null;
  constructor(canvas, contextId) {
    this.ctx = canvas.getContext(contextId);
  }
  drawGrid(gridWidth, gridHeight) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = GRID_COLOR;
    for (let i = 0; i <= gridWidth; i++) {
      this.ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      this.ctx.lineTo(
        i * (CELL_SIZE + 1) + 1,
        (CELL_SIZE + 1) * gridHeight + 1
      );
    }
    for (let j = 0; j <= gridHeight; j++) {
      this.ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      this.ctx.lineTo((CELL_SIZE + 1) * gridWidth + 1, j * (CELL_SIZE + 1) + 1);
    }
    this.ctx.stroke();
  }
  drawCell(row, col) {
    this.ctx.fillRect(
      col * (CELL_SIZE + 1) + 1,
      row * (CELL_SIZE + 1) + 1,
      CELL_SIZE,
      CELL_SIZE
    );
  }
  drawCells(gridHeight, gridWidth) {
    const cellsPtr = State.universe.cells();
    const cells = new Uint8Array(
      memory.buffer,
      cellsPtr,
      gridWidth * gridHeight
    );
    this.ctx.beginPath();
    let livingCells = [];
    /**
     * Setting fillStyle is an expensive operation,
     * this first set of loops draws all of the dead cells
     * first while tracking the coords of living cells.
     */
    this.ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const index = getIndex(row, col, gridWidth);
        if (cells[index] === Cell.Dead) {
          this.drawCell(row, col);
        } else {
          livingCells.push([row, col]);
        }
      }
    }
    // Loop over living cell coordinates and draw them.
    this.ctx.fillStyle = ALIVE_COLOR;
    for (let [row, col] of livingCells) {
      this.drawCell(row, col);
    }
    this.ctx.stroke();
  }
  draw(gridHeight, gridWidth) {
    this.drawGrid(gridHeight, gridWidth);
    this.drawCells(gridHeight, gridWidth);
  }
}
