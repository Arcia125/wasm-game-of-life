import { Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

import { GRID_COLOR, CELL_SIZE, DEAD_COLOR, ALIVE_COLOR } from './settings';
import { State } from './state';

const getIndex = (row, column, gridWidth) => row * gridWidth + column;

class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
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

  drawCells(gridHeight, gridWidth) {
    const cellsPtr = State.universe.cells();
    const cells = new Uint8Array(
      memory.buffer,
      cellsPtr,
      gridWidth * gridHeight
    );

    this.ctx.beginPath();

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const index = getIndex(row, col, gridWidth);
        this.ctx.fillStyle =
          cells[index] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

        this.ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    this.ctx.stroke();
  }

  draw(gridHeight, gridWidth) {
    this.drawGrid(gridHeight, gridWidth);
    this.drawCells(gridHeight, gridWidth);
  }
}

export { Renderer };
