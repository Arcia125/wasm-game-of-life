import { hexToRgbFloat } from './color';

const gridWidth = 128;
const CELL_SIZE =
  Math.min(window.innerHeight, window.innerWidth) / (gridWidth * 2); // px
const GRID_SIZE = [gridWidth, gridWidth];
const GRID_COLOR = '#2f78aa';
const DEAD_COLOR = '#0f588a';
const ALIVE_COLOR = '#50d890';
const ALIVE_COLOR_AS_RGB_FLOAT = hexToRgbFloat(ALIVE_COLOR);
const INITIAL_SPEED = 100;
const INTERNAL_RENDERER = 'webgl';

export {
  CELL_SIZE,
  GRID_SIZE,
  GRID_COLOR,
  DEAD_COLOR,
  ALIVE_COLOR,
  ALIVE_COLOR_AS_RGB_FLOAT,
  INITIAL_SPEED,
  INTERNAL_RENDERER,
};
