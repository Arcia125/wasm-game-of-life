import { InternalRenderer2d } from './InternalRenderer2d';
import { InternalRendererWebgl } from './InternalRendererWebgl';

class Renderer {
  static INTERNAL_RENDERERS = {
    '2d': InternalRenderer2d,
    webgl: InternalRendererWebgl,
  };

  static getInternalRenderer(canvas, contextId) {
    return new Renderer.INTERNAL_RENDERERS[contextId](canvas, contextId);
  }

  constructor(canvas, contextId) {
    this.internalRenderer = Renderer.getInternalRenderer(canvas, contextId);
  }

  draw(gridHeight, gridWidth) {
    this.internalRenderer.draw(gridHeight, gridWidth);
  }
}

export { Renderer };
