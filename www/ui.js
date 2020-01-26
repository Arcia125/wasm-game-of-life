class UI {
  static canvas = document.getElementById('life-canvas');
  static resetBtn = document.getElementById('reset');
  static clearBtn = document.getElementById('clear');
  static playPauseBtn = document.getElementById('play-pause');
  static stepBtn = document.getElementById('step');
  static speedInput = document.getElementById('speed');
  static renderSelect = document.getElementById('render-select');
  static height;

  static canvasListeners = [];

  static onClickCanvas(func) {
    UI.canvas.addEventListener('click', func);
    this.canvasListeners.push(['click', func]);
  }

  static onClickResetButton(func) {
    UI.resetBtn.addEventListener('click', func);
  }

  static onClickClearButton(func) {
    UI.clearBtn.addEventListener('click', func);
  }

  static onClickPlayPauseButton(func) {
    UI.playPauseBtn.addEventListener('click', func);
  }

  static onClickStepButton(func) {
    UI.stepBtn.addEventListener('click', func);
  }

  static onChangeSpeed(func) {
    UI.speedInput.addEventListener('change', func);
  }

  static onSelectRenderer(func) {
    UI.renderSelect.addEventListener('change', func);
  }

  static updatePlayPauseBtn(isPlaying) {
    if (isPlaying) {
      UI.playPauseBtn.innerText = 'pause';
      UI.stepBtn.disabled = true;
      return;
    }
    UI.stepBtn.disabled = false;
    UI.playPauseBtn.innerText = 'play';
  }

  static init(canvasHeight, canvasWidth) {
    UI.canvas.height = canvasHeight;
    UI.canvas.width = canvasWidth;
  }

  static newCanvas() {
    let newCanvas = UI.canvas.cloneNode(false);
    UI.canvas.parentNode.replaceChild(newCanvas, UI.canvas);
    UI.canvas = newCanvas;

    // carry over event listeners
    this.canvasListeners.forEach(([eventType, handler]) => {
      this.canvas.addEventListener(eventType, handler);
    });
  }
}

export { UI };
