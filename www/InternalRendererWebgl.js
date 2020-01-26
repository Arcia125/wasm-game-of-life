import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

import { State } from './state';
import { getIndex } from './getIndex';
import { CELL_SIZE, ALIVE_COLOR_AS_RGB_FLOAT } from './settings';
import { Cell } from 'wasm-game-of-life';

export class InternalRendererWebgl {
  static createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;
    const errorMessage = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(errorMessage);
  }

  static createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;
    const errorMessage = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(errorMessage);
  }

  gl = null;
  program = null;
  vertexShader = null;
  fragmentShader = null;
  positionAttributeLocation = null;
  positionBuffer = null;

  constructor(canvas, contextId) {
    const gl = (this.gl = canvas.getContext(contextId));
    const vertexShader = (this.vertexShader = this.createShader(
      gl.VERTEX_SHADER,
      `
      attribute vec2 a_position;

      uniform vec2 u_resolution;

      void main() {
        vec2 zeroToOne = a_position / u_resolution;

        vec2 zeroToTwo = zeroToOne * 2.0;
        
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
    `
    ));

    const fragmentShader = (this.fragmentShader = this.createShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;


      void main() {
        gl_FragColor = vec4(${ALIVE_COLOR_AS_RGB_FLOAT.r}, ${ALIVE_COLOR_AS_RGB_FLOAT.g}, ${ALIVE_COLOR_AS_RGB_FLOAT.b}, 1);
      }
    `
    ));

    const program = (this.program = InternalRendererWebgl.createProgram(
      gl,
      vertexShader,
      fragmentShader
    ));
    this.positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position'
    );
    this.resolutionUniformLocation = gl.getUniformLocation(
      program,
      'u_resolution'
    );
    const positionBuffer = (this.positionBuffer = gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  }

  createShader(type, source) {
    return InternalRendererWebgl.createShader(this.gl, type, source);
  }

  setRectanglePosition(x, y, width, height) {
    const { gl } = this;
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      gl.STATIC_DRAW
    );
  }

  drawRectangle(x, y, width, height) {
    const { gl } = this;
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    this.setRectanglePosition(x, y, width, height);
    gl.drawArrays(primitiveType, offset, count);
  }

  drawCell(row, column) {
    this.drawRectangle(
      column * (CELL_SIZE + 1) + 1,
      row * (CELL_SIZE + 1) + 1,
      CELL_SIZE,
      CELL_SIZE
    );
  }

  drawCells(gridWidth, gridHeight) {
    const cellsPtr = State.universe.cells();
    const cells = new Uint8Array(
      memory.buffer,
      cellsPtr,
      gridWidth * gridHeight
    );

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const index = getIndex(row, col, gridWidth);
        if (cells[index] === Cell.Alive) this.drawCell(row, col);
      }
    }
  }

  draw(gridWidth, gridHeight) {
    const {
      gl,
      program,
      positionAttributeLocation,
      positionBuffer,
      resolutionUniformLocation,
    } = this;

    if (!this.drawn) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      this.drawn = true;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this.drawCells(gridHeight, gridWidth);
  }
}
