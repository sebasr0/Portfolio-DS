import { describe, expect, it } from 'vitest';
import { descentPath, gradient, loss } from './lossLandscape.js';

describe('loss surface', () => {
  it('has its global minimum near (1.15, 0.6)', () => {
    const atGlobal = loss(1.15, 0.6);
    for (const [x, z] of [[-1.2, -0.9], [-0.4, 1.4], [0, 0], [2, -2]]) {
      expect(atGlobal).toBeLessThan(loss(x, z));
    }
  });

  it('gradient matches numerical differentiation', () => {
    const h = 1e-5;
    for (const [x, z] of [[0.3, -0.7], [-1.5, 1.2], [2.0, 0.1]]) {
      const [gx, gz] = gradient(x, z);
      expect(gx).toBeCloseTo((loss(x + h, z) - loss(x - h, z)) / (2 * h), 4);
      expect(gz).toBeCloseTo((loss(x, z + h) - loss(x, z - h)) / (2 * h), 4);
    }
  });

  it('descent converges into the global basin', () => {
    const path = descentPath();
    const [x, , z] = path.at(-1);
    expect(Math.hypot(x - 1.15, z - 0.6)).toBeLessThan(0.35);
  });
});
