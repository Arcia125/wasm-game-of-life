import { UI } from './ui';
import { State } from './state';
import { CELL_SIZE, INTERNAL_RENDERER } from './settings';
import { Renderer } from './renderer';

class App {
  gridHeight = null;
  gridWidth = null;
  renderer = null;
  constructor() {
    this.renderer = new Renderer(UI.canvas, INTERNAL_RENDERER);
    this.init();
    UI.speedInput.value = State.speed;
    UI.renderSelect.value = INTERNAL_RENDERER;
    this.registerEventHandlers();
  }

  init() {
    State.init();
    this.gridWidth = State.universe.width();
    this.gridHeight = State.universe.height();
    const canvasHeight = (CELL_SIZE + 1) * this.gridHeight + 1;
    const canvasWidth = (CELL_SIZE + 1) * this.gridWidth + 1;
    UI.init(canvasHeight, canvasWidth);
    this.draw();
  }

  handleCanvasClick = event => {
    const coords = {
      x: event.offsetX / (CELL_SIZE + 1),
      y: event.offsetY / (CELL_SIZE + 1),
    };
    if (event.ctrlKey) {
      State.universe.add_glider(coords.y, coords.x);
    } else {
      State.universe.toggle_cell(coords.y, coords.x);
    }
    this.draw();
  };

  handleClickPlayPause = () => {
    State.isPlaying ? this.pause() : this.play();
  };

  handleClickStep = () => {
    State.tick();
    this.draw();
  };

  handleChangeSpeed = event => {
    State.speed = event.target.value;
  };

  handleClickReset = () => {
    this.init();
    this.pause();
  };

  handleClickClear = () => {
    State.clear();
    this.draw();
  };

  handleChangeRenderer = event => {
    UI.newCanvas();
    this.renderer = new Renderer(UI.canvas, event.target.value);
    this.draw();
  };

  registerEventHandlers() {
    UI.onClickCanvas(this.handleCanvasClick);

    UI.onClickPlayPauseButton(this.handleClickPlayPause);

    UI.onClickStepButton(this.handleClickStep);

    UI.onChangeSpeed(this.handleChangeSpeed);

    UI.onClickResetButton(this.handleClickReset);

    UI.onClickClearButton(this.handleClickClear);

    UI.onSelectRenderer(this.handleChangeRenderer);
  }

  renderLoop = () => {
    if (!State.isPlaying) {
      return;
    }

    if (Date.now() - State.lastTick >= 100 - State.speed && State.isPlaying) {
      State.tick();
    }

    this.draw();

    requestAnimationFrame(this.renderLoop);
  };

  play() {
    State.lastTick = Date.now();
    State.isPlaying = true;
    this.draw();
    requestAnimationFrame(this.renderLoop);
    UI.updatePlayPauseBtn(State.isPlaying);
  }

  pause() {
    State.isPlaying = false;
    this.draw();
    UI.updatePlayPauseBtn(State.isPlaying);
  }

  start() {
    UI.updatePlayPauseBtn(State.isPlaying);
    requestAnimationFrame(this.renderLoop);
  }

  draw() {
    this.renderer.draw(this.gridHeight, this.gridWidth);
  }
}

export { App };
