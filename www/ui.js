class UI {
  static canvas = document.getElementById('life-canvas');
  static playPauseBtn = document.getElementById('play-pause');
  static stepBtn = document.getElementById('step');
  static resetBtn = document.getElementById('reset');
  static speedInput = document.getElementById('speed');
  static ctx = UI.canvas.getContext('2d');
  static height;

  static onClickCanvas(func) {
    UI.canvas.addEventListener('click', func);
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

  static onClickResetButton(func) {
    UI.resetBtn.addEventListener('click', func);
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
}

UI.ctx.imageSmoothingEnabled = true;

export { UI };
