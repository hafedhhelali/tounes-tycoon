import test from 'node:test';
import assert from 'node:assert/strict';
import { PixiGpuEngine } from './pixi_renderer.js';

test('PixiGpuEngine: graceful fallback in headless environment', () => {
  const engine = new PixiGpuEngine(null);
  assert.equal(engine.isSupported, false);
  // Doit s'exécuter sans lever d'erreur
  assert.doesNotThrow(() => {
    engine.renderLightingFx({}, 'boite_de_nuit', 800, 400, 0.016);
    engine.renderLightingFx({}, 'bar_cha3bi', 800, 400, 0.016);
    engine.destroy();
  });
});

test('PixiGpuEngine: mock canvas texture and lighting execution', () => {
  const mockCtx = {
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    roundRect: () => {},
    drawImage: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    globalCompositeOperation: 'source-over',
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1
  };

  const mockCanvas = {
    getContext: (type) => (type === '2d' ? mockCtx : null),
    width: 800,
    height: 400
  };

  const engine = new PixiGpuEngine(mockCanvas);
  assert.doesNotThrow(() => {
    engine.renderLightingFx(mockCtx, 'boite_de_nuit', 800, 400, 0.016);
    engine.renderLightingFx(mockCtx, 'bar_cha3bi', 800, 400, 0.016);
    engine.destroy();
  });
});
