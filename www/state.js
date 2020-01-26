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
    // Once speed gets over the threshold, extra ticks are added to further increase speed
    const threshold = 100;
    const extraTicks = Math.ceil(Math.max((this.speed - threshold) / 25, 1));
    for (let i = 0; i < extraTicks; i++) {
      State.universe.tick();
      State.lastTick = Date.now();
    }
  }

  static clear() {
    const [gridWidth, gridHeight] = GRID_SIZE;
    State.universe = Universe.empty(gridWidth, gridHeight);
  }
}

export { State };
