import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Fog,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { damp } from '../ui/scrollProgress.js';
import { descentPath, loss } from './lossLandscape.js';

const EXTENT = 3;
const VERT = 1.6; // vertical exaggeration so basins read on a wide shot
const DAMPING = 0.08;
const GLOBAL_MIN = [1.15, 0.6]; // matches lossLandscape BASINS[0]

// Camera choreography endpoints (wide establishing shot → converged close-up).
const WIDE = { pos: new Vector3(-4.6, 3.2, 7.4), look: new Vector3(0, -0.4, 0) };
const CLOSE = {
  pos: new Vector3(3.1, 1.15, 2.9),
  look: new Vector3(GLOBAL_MIN[0], VERT * loss(...GLOBAL_MIN), GLOBAL_MIN[1]),
};

const smoothstep = (t) => t * t * (3 - 2 * t);

/**
 * Full-viewport backdrop: the loss surface as night terrain. Scroll progress
 * (injected via setProgress) scrubs both the descent trail and the camera
 * glide from WIDE to CLOSE. Knows nothing about scroll or page DOM.
 */
export class ObservatoryBackdrop {
  #renderer; #scene; #camera; #marker; #trail; #trailPositions; #path;
  #frame = null; #running = false; #reduced; #canvas;
  #progress = 0; #progressTarget = 0;
  #pointer = { x: 0, y: 0 }; #pointerTarget = { x: 0, y: 0 };

  constructor(canvas, { void: voidColor, grid, signal, marker }) {
    this.#canvas = canvas;
    this.#reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;

    this.#renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.5 : 2));

    this.#scene = new Scene();
    this.#scene.fog = new Fog(new Color(voidColor), 7, 14);

    this.#camera = new PerspectiveCamera(42, 1, 0.1, 40);

    this.#scene.add(this.#surfaceWireframe(touch ? 48 : 90, signal, 0.3));
    this.#scene.add(this.#surfaceWireframe(22, grid, 0.35));

    this.#path = descentPath();
    this.#trailPositions = new Float32Array(this.#path.length * 3);
    const trailGeometry = new BufferGeometry();
    trailGeometry.setAttribute('position', new BufferAttribute(this.#trailPositions, 3));
    trailGeometry.setDrawRange(0, 0);
    this.#trail = new Line(trailGeometry, new LineBasicMaterial({ color: new Color(marker) }));
    this.#scene.add(this.#trail);

    this.#marker = new Mesh(
      new SphereGeometry(0.09, 24, 24),
      new MeshBasicMaterial({ color: new Color(marker) }),
    );
    this.#scene.add(this.#marker);

    this.resize();
    if (this.#reduced) {
      // Static wide shot, fully converged trail — the finished figure.
      this.#progress = 1;
      this.#drawTrail(1);
      this.#poseCamera(0);
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
    return new LineSegments(
      new WireframeGeometry(plane),
      new LineBasicMaterial({ color: new Color(color), transparent: true, opacity }),
    );
  }

  #drawTrail(progress) {
    const count = Math.max(1, Math.round(progress * this.#path.length));
    const clamped = Math.min(count, this.#path.length);
    for (let i = 0; i < clamped; i++) {
      const [px, py, pz] = this.#path[i];
      this.#trailPositions.set([px, VERT * py + 0.02, pz], i * 3);
    }
    this.#trail.geometry.setDrawRange(0, clamped);
    this.#trail.geometry.attributes.position.needsUpdate = true;
    const [x, y, z] = this.#path[clamped - 1];
    this.#marker.position.set(x, VERT * y + 0.07, z);
  }

  #poseCamera(progress) {
    const t = smoothstep(progress);
    const pos = WIDE.pos.clone().lerp(CLOSE.pos, t);
    const look = WIDE.look.clone().lerp(CLOSE.look, t);
    // Pointer parallax: small orbital offset around the current pose.
    const px = this.#pointer.x * 0.026; // ≈ ±1.5°
    const py = this.#pointer.y * 0.015;
    pos.applyAxisAngle(new Vector3(0, 1, 0), px);
    pos.y += py * pos.length();
    this.#camera.position.copy(pos);
    this.#camera.lookAt(look);
  }

  #tick = () => {
    if (!this.#running) return;
    this.#progress = damp(this.#progress, this.#progressTarget, DAMPING);
    this.#pointer.x = damp(this.#pointer.x, this.#pointerTarget.x, DAMPING);
    this.#pointer.y = damp(this.#pointer.y, this.#pointerTarget.y, DAMPING);
    this.#drawTrail(this.#progress);
    this.#poseCamera(this.#progress);
    this.#renderer.render(this.#scene, this.#camera);
    this.#frame = requestAnimationFrame(this.#tick);
  };

  setProgress(t) {
    this.#progressTarget = Math.min(1, Math.max(0, t));
  }

  setPointer(nx, ny) {
    this.#pointerTarget = { x: nx, y: ny };
  }

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
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.#renderer.setSize(width, height, false);
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    if (this.#reduced) this.#renderer.render(this.#scene, this.#camera);
  }

  dispose() {
    this.stop();
    this.#renderer.dispose();
  }
}

/** Wire a backdrop to page lifecycle: tab visibility + window resize. */
export function mountObservatoryBackdrop(canvas, colors) {
  const backdrop = new ObservatoryBackdrop(canvas, colors);
  const onVisibility = () => (document.hidden ? backdrop.stop() : backdrop.start());
  const onResize = () => backdrop.resize();
  backdrop.start();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize);
  const dispose = backdrop.dispose.bind(backdrop);
  backdrop.dispose = () => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    dispose();
  };
  return backdrop;
}
