import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  WireframeGeometry,
  LineSegments,
  PlaneGeometry,
} from 'three';
import { loss, descentPath } from './lossLandscape.js';

const EXTENT = 3; // surface spans [-EXTENT, EXTENT] in x and z
const VERT = 1.6; // vertical exaggeration so the basins read from the hero camera

/**
 * Hero visualization: a wireframe loss surface with a marker descending it
 * by momentum gradient descent, leaving a trail. Presentation-only — all the
 * math lives in lossLandscape.js; all colors are injected by the caller so
 * the scene stays in sync with the design tokens.
 */
export class DescentScene {
  #renderer;
  #scene;
  #camera;
  #marker;
  #trail;
  #trailPositions;
  #path;
  #frame = null;
  #step = 0;
  #elapsed = 0;
  #running = false;
  #reduced;
  #canvas;

  constructor(canvas, { paper, grid, ink, accent, marker } = {}) {
    this.#canvas = canvas;
    this.#reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.#renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.#scene = new Scene();
    this.#scene.fog = new Fog(new Color(paper), 6.5, 12.5);

    this.#camera = new PerspectiveCamera(38, 1, 0.1, 40);

    // Surface: displaced plane rendered as a wireframe, plus a fainter,
    // coarser grid underneath for depth.
    this.#scene.add(this.#surfaceWireframe(90, accent, 0.4));
    this.#scene.add(this.#surfaceWireframe(22, grid ?? ink, 0.55));

    // Optimizer trace.
    this.#path = descentPath();
    this.#trailPositions = new Float32Array(this.#path.length * 3);
    const trailGeometry = new BufferGeometry();
    trailGeometry.setAttribute('position', new BufferAttribute(this.#trailPositions, 3));
    trailGeometry.setDrawRange(0, 0);
    this.#trail = new Line(trailGeometry, new LineBasicMaterial({ color: new Color(marker) }));
    this.#scene.add(this.#trail);

    this.#marker = new Mesh(
      new SphereGeometry(0.11, 24, 24),
      new MeshBasicMaterial({ color: new Color(marker) }),
    );
    this.#scene.add(this.#marker);

    this.resize();
    if (this.#reduced) {
      // Motion-averse users get the finished figure: full trail, converged marker.
      this.#drawUpTo(this.#path.length);
      this.#positionCamera(0);
      this.#renderer.render(this.#scene, this.#camera);
    }
  }

  #surfaceWireframe(segments, color, opacity) {
    const plane = new PlaneGeometry(EXTENT * 2, EXTENT * 2, segments, segments);
    plane.rotateX(-Math.PI / 2);
    const pos = plane.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, VERT * loss(pos.getX(i), pos.getZ(i)));
    }
    plane.computeVertexNormals();
    return new LineSegments(
      new WireframeGeometry(plane),
      new LineBasicMaterial({ color: new Color(color), transparent: true, opacity }),
    );
  }

  #drawUpTo(step) {
    const clamped = Math.min(step, this.#path.length);
    for (let i = 0; i < clamped; i++) {
      const [px, py, pz] = this.#path[i];
      // Lift the trail a hair above the surface to avoid z-fighting.
      this.#trailPositions.set([px, VERT * py + 0.02, pz], i * 3);
    }
    this.#trail.geometry.setDrawRange(0, clamped);
    this.#trail.geometry.attributes.position.needsUpdate = true;
    const [x, y, z] = this.#path[Math.max(clamped - 1, 0)];
    this.#marker.position.set(x, VERT * y + 0.08, z);
  }

  #positionCamera(t) {
    const angle = -0.9 + Math.sin(t * 0.00009) * 0.16; // slow drift, not a spin
    this.#camera.position.set(Math.sin(angle) * 6.4, 2.7, Math.cos(angle) * 6.4);
    this.#camera.lookAt(0.15, -0.5, 0.15);
  }

  #tick = (now) => {
    if (!this.#running) return;
    this.#elapsed = now;
    // Advance the optimizer ~3 steps per frame; hold, then restart.
    this.#step += 3;
    const cycle = this.#path.length + 150; // pause on convergence before looping
    this.#drawUpTo(this.#step % cycle);
    this.#positionCamera(now);
    this.#renderer.render(this.#scene, this.#camera);
    this.#frame = requestAnimationFrame(this.#tick);
  };

  start() {
    if (this.#reduced || this.#running) return;
    this.#running = true;
    this.#frame = requestAnimationFrame(this.#tick);
  }

  stop() {
    this.#running = false;
    if (this.#frame) cancelAnimationFrame(this.#frame);
    this.#frame = null;
  }

  resize() {
    const { clientWidth, clientHeight } = this.#canvas.parentElement;
    if (!clientWidth || !clientHeight) return;
    this.#renderer.setSize(clientWidth, clientHeight, false);
    this.#camera.aspect = clientWidth / clientHeight;
    this.#camera.updateProjectionMatrix();
    if (this.#reduced) this.#renderer.render(this.#scene, this.#camera);
  }

  dispose() {
    this.stop();
    this.#renderer.dispose();
  }
}

/**
 * Wire a DescentScene to the page lifecycle: run only while visible on
 * screen and while the tab is foregrounded; track container resizes.
 */
export function mountDescentScene(canvas, colors) {
  const scene = new DescentScene(canvas, colors);
  let onScreen = false;

  const visibility = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen && !document.hidden ? scene.start() : scene.stop();
    },
    { threshold: 0.05 },
  );
  visibility.observe(canvas);

  document.addEventListener('visibilitychange', () =>
    document.hidden || !onScreen ? scene.stop() : scene.start(),
  );

  new ResizeObserver(() => scene.resize()).observe(canvas.parentElement);

  return scene;
}
