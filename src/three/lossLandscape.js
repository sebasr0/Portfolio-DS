/**
 * The non-convex "loss surface" the hero visualizes, plus its analytic
 * gradient and a momentum gradient-descent path. Pure math — no three.js —
 * so the descent is honest (a real optimizer trace, not a keyframed tween)
 * and unit-testable.
 */

const BASINS = [
  { cx: 1.15, cz: 0.6, depth: 1.15, sigma: 0.85 }, // global minimum
  { cx: -1.2, cz: -0.9, depth: 0.75, sigma: 0.7 }, // local minimum
  { cx: -0.4, cz: 1.4, depth: 0.55, sigma: 0.55 }, // shallow local minimum
];
const BOWL = 0.08; // gentle convex term so the surface rises at the edges

export function loss(x, z) {
  let y = BOWL * (x * x + z * z);
  for (const { cx, cz, depth, sigma } of BASINS) {
    const dx = x - cx;
    const dz = z - cz;
    y -= depth * Math.exp(-(dx * dx + dz * dz) / (2 * sigma * sigma));
  }
  return y;
}

export function gradient(x, z) {
  let gx = 2 * BOWL * x;
  let gz = 2 * BOWL * z;
  for (const { cx, cz, depth, sigma } of BASINS) {
    const dx = x - cx;
    const dz = z - cz;
    const g = (depth / (sigma * sigma)) * Math.exp(-(dx * dx + dz * dz) / (2 * sigma * sigma));
    gx += dx * g;
    gz += dz * g;
  }
  return [gx, gz];
}

/**
 * Momentum gradient descent from a fixed start on the rim, ending in the
 * global basin. Returns the visited [x, y, z] points.
 */
export function descentPath({ start = [-2.3, 2.2], lr = 0.09, momentum = 0.86, steps = 260 } = {}) {
  const points = [];
  let [x, z] = start;
  let vx = 0;
  let vz = 0;
  for (let i = 0; i < steps; i++) {
    points.push([x, loss(x, z), z]);
    const [gx, gz] = gradient(x, z);
    vx = momentum * vx - lr * gx;
    vz = momentum * vz - lr * gz;
    x += vx;
    z += vz;
  }
  points.push([x, loss(x, z), z]);
  return points;
}
