import { Universe } from 'wasm-game-of-life';
import { GRID_SIZE, INITIAL_SPEED } from './settings';

class State {
  static universe = null;
  static speed = INITIAL_SPEED;
  static lastTick = Date.now();
  static isPlaying = true;
  static init() {
    const [gridWidth, gridHeight] = GRID_SIZE;
    State.universe = Universe.new(gridWidth, gridHeight);
  }

  static tick() {
    State.universe.tick();
    State.lastTick = Date.now();
  }
}

export { State };
