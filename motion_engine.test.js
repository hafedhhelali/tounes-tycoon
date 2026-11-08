import test from 'node:test';
import assert from 'node:assert';
import { Easing, exponentialDecay, SpringSimulator, DomCoinPool, triggerTactileSquash } from './motion_engine.js';

test('Motion Engine: Easing functions boundaries', () => {
  assert.ok(Math.abs(Easing.easeOutBack(0)) < 1e-10);
  assert.strictEqual(Math.round(Easing.easeOutBack(1)), 1);

  assert.strictEqual(Easing.easeOutElastic(0), 0);
  assert.strictEqual(Math.round(Easing.easeOutElastic(1)), 1);
});

test('Motion Engine: Exponential decay frame-rate independent interpolation', () => {
  const start = 0;
  const target = 100;
  const decayRate = 12.0;

  const afterSmallStep = exponentialDecay(start, target, decayRate, 0.016);
  assert.ok(afterSmallStep > 0 && afterSmallStep < 100);

  // Large dt approaches target asymptotically
  const afterLargeStep = exponentialDecay(start, target, decayRate, 1.0);
  assert.ok(target - afterLargeStep < 0.01);
});

test('Motion Engine: SpringSimulator steps and settles to target', () => {
  const spring = new SpringSimulator({ tension: 180, friction: 22 });
  const state = { x: 0, v: 0 };
  const target = 50;

  for (let i = 0; i < 90; i++) {
    spring.step(state, target, 0.016);
  }

  assert.ok(Math.abs(state.x - target) < 0.05);
  assert.ok(Math.abs(state.v) < 0.05);
});

test('Motion Engine: DomCoinPool & triggerTactileSquash graceful handling without DOM', () => {
  const pool = new DomCoinPool();
  assert.strictEqual(pool.pool.length, 0); // No document in Node.js environment
  assert.doesNotThrow(() => pool.spawnBurst(100, 100, null, 5));
  assert.doesNotThrow(() => triggerTactileSquash(null));
});
