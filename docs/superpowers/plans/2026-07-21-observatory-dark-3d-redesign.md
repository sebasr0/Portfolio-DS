# Observatory Dark Mode + Scroll-Driven 3D Backdrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio to a single dark "Observatory" theme where a full-page Three.js loss-surface backdrop plays the gradient descent as the visitor scrolls.

**Architecture:** The existing framed hero scene (`DescentScene`) is refactored into a full-viewport `ObservatoryBackdrop` that exposes `setProgress(t)`/`setPointer(x,y)` and knows nothing about scroll; a new pure `scrollProgress` module maps page scroll to damped normalized progress; the composition root (`src/main.js`) wires them. Light design tokens are replaced by dark ones (no toggle). Case-study pages get dark tokens only, no 3D.

**Tech Stack:** Vite 7 (multi-page), Three.js ^0.178, vanilla ES modules, Vitest (added for pure-logic tests only), pnpm (via corepack).

## Global Constraints

- Package manager is **pnpm** (`corepack enable pnpm` if missing). Never npm.
- Working branch: `react_rewrite`. Commit per task; never push.
- Spec: `docs/superpowers/specs/2026-07-21-observatory-dark-3d-redesign-design.md`.
- Dark theme is the ONLY theme — no toggle, no `prefers-color-scheme` handling.
- Tokens (exact values): `--void #0B111A`, `--surface #121A26`, `--grid #1F2B3B`, `--ink #E9EFF6`, `--muted #93A3B5`, `--signal #55A6FF`, `--marker #FF6B3D`.
- Fonts unchanged: Bricolage Grotesque / Instrument Sans / JetBrains Mono.
- `src/three/lossLandscape.js` must NOT be modified.
- `project.html` / `src/project-main.js` must NOT import three.js.
- Three.js stays a lazy dynamic import on the home page.
- Wireframe opacity ≤ 0.35; DPR cap 2 desktop, 1.5 touch; `prefers-reduced-motion` gets a static wide shot with the full trail drawn.
- Copy changes limited to: nav CTA swap ("Email me" primary in nav; CV link stays in menu) and hero scroll cue `scroll to descend ↓`.
- Verification for visual tasks = `pnpm build` + Chrome-extension screenshots + console-error sweep (no DOM test framework).

---

### Task 1: Commit baseline and add Vitest for pure-logic tests

**Files:**
- Modify: `package.json` (add vitest devDependency + test script)
- Create: `src/three/lossLandscape.test.js`

**Interfaces:**
- Consumes: existing `loss(x,z)`, `gradient(x,z)`, `descentPath(opts)` from `src/three/lossLandscape.js`.
- Produces: `pnpm test` runs Vitest; later tasks add test files beside sources as `*.test.js`.

- [ ] **Step 1: Commit the uncommitted rebuild as baseline**

```bash
git add -A
git commit -m "feat: rebuild portfolio as Vite + Three.js clean architecture

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

Expected: one commit containing the whole rebuild (deleted legacy css/js, new src/, package.json, etc.).

- [ ] **Step 2: Add Vitest**

```bash
pnpm add -D vitest
```

Then add to `package.json` `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 3: Write characterization tests for the landscape math**

Create `src/three/lossLandscape.test.js`:

```js
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
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test`
Expected: 3 passed. (Characterization of existing code — passes immediately; if any fail, the math changed and must be investigated, not the test.)

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/three/lossLandscape.test.js
git commit -m "test: add vitest and loss-landscape characterization tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Dark Observatory tokens

**Files:**
- Modify: `src/styles/tokens.css` (replace color block)
- Modify: `src/styles/global.css` (body background, nav, buttons reference check)
- Modify: `src/styles/home.css` (one `var(--paper)` usage)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--void`, `--surface`, `--grid`, `--ink`, `--muted`, `--signal`, `--marker` (the name `--paper` ceases to exist; `grep -rn 'paper' src/` must return nothing after this task). `src/main.js` (Task 5) reads `--surface`, `--grid`, `--ink`, `--signal`, `--marker`, `--void` via `getComputedStyle`.

- [ ] **Step 1: Replace the color block in `src/styles/tokens.css`**

Replace the `/* Color */` section with:

```css
  /* Color — "the observatory": the plotting canvas at night */
  --void: #0b111a;      /* page background */
  --surface: #121a26;   /* cards, panels — always opaque */
  --grid: #1f2b3b;      /* hairlines, graph-paper ruling */
  --ink: #e9eff6;       /* text */
  --muted: #93a3b5;     /* captions, secondary text */
  --signal: #55a6ff;    /* links, CTAs, wireframe strokes */
  --marker: #ff6b3d;    /* data marks only (descent trail, metric accents) */
```

Also update the header comment of the file from “plotting canvas” to:
`/* Design tokens — "the observatory". One committed dark look: the plotting canvas at night. */`

- [ ] **Step 2: Rename all `--paper` usages**

```bash
grep -rln -- '--paper' src/
```

Expected hits: `src/styles/global.css` (body `background-color`, body ruling `color-mix`, nav background, reduced-motion none), `src/styles/home.css` (`.card__tags li` background), `src/main.js` (`paper: color('--surface')` — already reads `--surface`, leave). In `global.css` and `home.css` replace every `var(--paper)` with `var(--void)`.

- [ ] **Step 3: Verify no light remnants**

Run: `grep -rn -- '--paper' src/ index.html project.html`
Expected: no output.

Run: `pnpm build`
Expected: builds clean.

- [ ] **Step 4: Visual sanity screenshot**

Start `pnpm preview --port 4174` (if not running), screenshot `http://localhost:4174/`. Expected: dark page, light text, blue links, cards on `#121A26`. (Hero canvas may still look wrong — its injected colors are fixed in Task 4/5. That is acceptable here.)

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css src/styles/home.css
git commit -m "feat: swap design tokens to dark Observatory palette

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: scrollProgress module (pure logic + thin DOM wiring)

**Files:**
- Create: `src/ui/scrollProgress.js`
- Create: `src/ui/scrollProgress.test.js`

**Interfaces:**
- Consumes: nothing project-internal.
- Produces:
  - `normalizeScroll(scrollY, documentHeight, viewportHeight) -> number` (0..1, clamped; returns 0 when the page cannot scroll).
  - `damp(current, target, factor) -> number` (single lerp step).
  - `watchScrollProgress(onChange) -> () => void` — subscribes to window scroll/resize, calls `onChange(rawProgress)` with **undamped** normalized progress at most once per animation frame, returns an unsubscribe function. (Damping happens inside the backdrop's render loop, which owns time.)

- [ ] **Step 1: Write failing tests**

Create `src/ui/scrollProgress.test.js`:

```js
import { describe, expect, it } from 'vitest';
import { damp, normalizeScroll } from './scrollProgress.js';

describe('normalizeScroll', () => {
  it('maps top to 0 and bottom to 1', () => {
    expect(normalizeScroll(0, 3000, 800)).toBe(0);
    expect(normalizeScroll(2200, 3000, 800)).toBe(1);
  });

  it('clamps overscroll and handles unscrollable pages', () => {
    expect(normalizeScroll(-50, 3000, 800)).toBe(0);
    expect(normalizeScroll(9999, 3000, 800)).toBe(1);
    expect(normalizeScroll(0, 800, 800)).toBe(0);
  });
});

describe('damp', () => {
  it('moves a fraction toward the target', () => {
    expect(damp(0, 1, 0.08)).toBeCloseTo(0.08);
    expect(damp(0.5, 0.5, 0.08)).toBe(0.5);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test`
Expected: FAIL — `scrollProgress.js` does not exist.

- [ ] **Step 3: Implement `src/ui/scrollProgress.js`**

```js
/**
 * Scroll → normalized progress for the backdrop choreography.
 * Pure math is exported for tests; watchScrollProgress adds the thin
 * DOM wiring (rAF-throttled scroll/resize listeners).
 */
export function normalizeScroll(scrollY, documentHeight, viewportHeight) {
  const range = documentHeight - viewportHeight;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / range));
}

/** One damping step: move `current` toward `target` by `factor`. */
export function damp(current, target, factor) {
  return current + (target - current) * factor;
}

/** Calls onChange(progress 0..1) at most once per frame on scroll/resize. */
export function watchScrollProgress(onChange) {
  let queued = false;
  const measure = () => {
    queued = false;
    onChange(
      normalizeScroll(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      ),
    );
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(measure);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  measure();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test`
Expected: all pass (Task 1's tests + these).

- [ ] **Step 5: Commit**

```bash
git add src/ui/scrollProgress.js src/ui/scrollProgress.test.js
git commit -m "feat: add scroll progress module with damping math

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: ObservatoryBackdrop scene

**Files:**
- Create: `src/three/ObservatoryBackdrop.js`
- (Note: the old `src/three/DescentScene.js` is deleted in Task 5 together with its last import site, so the build stays green after every task.)

**Interfaces:**
- Consumes: `loss`, `descentPath` from `src/three/lossLandscape.js`; `damp` from `src/ui/scrollProgress.js`.
- Produces (used by Task 5's `src/main.js`):
  - `mountObservatoryBackdrop(canvas, colors) -> ObservatoryBackdrop` where `colors = { void, grid, ink, signal, marker }` (hex strings). Handles IntersectionObserver/visibility/resize lifecycle internally.
  - Instance methods: `setProgress(t: 0..1)`, `setPointer(nx: -1..1, ny: -1..1)`, `start()`, `stop()`, `resize()`, `dispose()`.

- [ ] **Step 1: Create `src/three/ObservatoryBackdrop.js`**

```js
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
  backdrop.start();
  document.addEventListener('visibilitychange', () =>
    document.hidden ? backdrop.stop() : backdrop.start(),
  );
  window.addEventListener('resize', () => backdrop.resize());
  return backdrop;
}
```

- [ ] **Step 2: Run unit tests and build**

Run: `pnpm test && pnpm build`
Expected: tests pass; build clean (the new file is not imported yet; `DescentScene.js` still serves the old hero until Task 5 swaps it out).

- [ ] **Step 3: Commit**

```bash
git add src/three/ObservatoryBackdrop.js
git commit -m "feat: add full-viewport ObservatoryBackdrop scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Home page restructure — canvas, hero overlay, wiring, scrim

**Files:**
- Modify: `index.html` (backdrop canvas, hero, nav CTA)
- Modify: `src/main.js` (wire backdrop + scrollProgress + pointer + fallback)
- Delete: `src/three/DescentScene.js` (its last import site goes away here)
- Modify: `src/styles/global.css` (canvas/ruling layers, section scrim, nav)
- Modify: `src/styles/home.css` (hero overlay, scroll cue, remove figure frame styles)

**Interfaces:**
- Consumes: `mountObservatoryBackdrop(canvas, colors)` (Task 4), `watchScrollProgress(onChange)` (Task 3), CSS tokens (Task 2).
- Produces: body class `backdrop-fallback` when 3D unavailable (styled here, referenced nowhere else); `[data-backdrop]` canvas element.

- [ ] **Step 1: index.html — replace the hero and add the body-level canvas**

Immediately after `<body>` add:

```html
  <canvas data-backdrop aria-hidden="true"></canvas>
```

Replace the entire `<section class="hero">…</section>` block with:

```html
    <section class="hero">
      <div class="container hero__content">
        <p class="eyebrow mono">data scientist · medellín, colombia</p>
        <h1 class="hero__title">Models that show their work<span class="accent-dot">.</span></h1>
        <p class="hero__lede">
          I'm Sebastian — Master's in Data Science &amp; Analytics (EAFIT). I build
          market-trend models, large-scale NLP pipelines on Spark, and LLM agents
          that run in production — and I publish the metrics.
        </p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#projects">View projects</a>
          <a class="btn btn--secondary" href="mailto:sebastian.ramirezesc@gmail.com">Get in touch</a>
        </div>
        <p class="hero__caption mono">fig. 1 — momentum gradient descent on a non-convex loss surface</p>
      </div>
      <p class="hero__cue mono">scroll to descend ↓</p>
    </section>
```

In the nav menu, swap the CTA: change
`<li><a class="btn btn--secondary" href="assets/cv.pdf" target="_blank" rel="noopener">Download CV</a></li>`
to

```html
        <li><a href="assets/cv.pdf" target="_blank" rel="noopener">Download CV</a></li>
        <li><a class="btn btn--primary" href="mailto:sebastian.ramirezesc@gmail.com">Email me</a></li>
```

- [ ] **Step 2: src/main.js — replace the scene mounting block**

Replace everything from `const canvas = document.querySelector('[data-descent-canvas]');` to the end of the file with:

```js
// The backdrop is heavy (three.js) and decorative: load it lazily, and fall
// back to the plain dark canvas (CSS) when WebGL or the chunk is unavailable.
const canvas = document.querySelector('[data-backdrop]');
if (canvas) {
  Promise.all([
    import('./three/ObservatoryBackdrop.js'),
    import('./ui/scrollProgress.js'),
  ])
    .then(([{ mountObservatoryBackdrop }, { watchScrollProgress }]) => {
      const tokens = getComputedStyle(document.documentElement);
      const color = (name) => tokens.getPropertyValue(name).trim();
      const backdrop = mountObservatoryBackdrop(canvas, {
        void: color('--void'),
        grid: color('--grid'),
        ink: color('--ink'),
        signal: color('--signal'),
        marker: color('--marker'),
      });
      watchScrollProgress((t) => backdrop.setProgress(t));
      if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', (e) => {
          backdrop.setPointer(
            (e.clientX / window.innerWidth) * 2 - 1,
            (e.clientY / window.innerHeight) * 2 - 1,
          );
        });
      }
    })
    .catch(() => document.body.classList.add('backdrop-fallback'));
}
```

- [ ] **Step 3: global.css — layer the canvas and ruling, scrim the sections**

Replace the body ruling rules (`background-image`/`background-size` on `body`) with this layering (html carries the void, canvas sits behind, ruling overlays it):

```css
html {
  background: var(--void);
}

body {
  background: transparent;
}

/* Backdrop canvas: fixed behind everything. */
[data-backdrop] {
  position: fixed;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
}

.backdrop-fallback [data-backdrop] {
  display: none;
}

/* Graph-paper ruling floats over the scene like a reticle. */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--grid) 45%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--grid) 45%, transparent) 1px, transparent 1px);
  background-size: var(--ruling) var(--ruling);
}

/* Content sections sit on a scrim so text never fights the scene. */
main .section {
  background: color-mix(in srgb, var(--void) 86%, transparent);
}
```

Also in `.nav`: change `background` to `color-mix(in srgb, var(--void) 92%, transparent)` and remove `backdrop-filter` (no blur over canvas).

- [ ] **Step 4: home.css — hero overlay styles; delete framed-figure styles**

Delete the `.hero__grid`, `.hero__figure`, `.hero__canvas-wrap` rule blocks. Replace the hero block with:

```css
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
  position: relative;
  padding-block: var(--s5);
}

.hero__content {
  max-width: 40rem;
}

.hero__caption {
  margin-top: var(--s4);
  font-size: var(--text-xs);
  color: var(--muted);
}

.hero__cue {
  position: absolute;
  bottom: var(--s2);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-xs);
  color: var(--muted);
  letter-spacing: 0.08em;
}

@media (prefers-reduced-motion: reduce) {
  .hero__cue {
    display: none;
  }
}
```

Keep `.hero__title`, `.accent-dot`, `.hero__lede`, `.hero__cta` as they are.

Then add the mobile type tightening at the end of the file:

```css
@media (max-width: 480px) {
  .hero__title {
    font-size: clamp(2.1rem, 11vw, 2.6rem);
  }

  .hero__lede {
    font-size: var(--text-md);
  }
}
```

- [ ] **Step 5: Delete the old scene, build and run unit tests**

```bash
git rm src/three/DescentScene.js
```

Run: `pnpm test && pnpm build`
Expected: tests pass; build clean; no references to `DescentScene` remain (`grep -rn DescentScene src/ index.html` → no output).

- [ ] **Step 6: Browser verification (choreography + readability)**

With `pnpm preview --port 4174` running, in the Chrome extension:
1. Screenshot `http://localhost:4174/` at top — expect: dark hero, headline over a wide wireframe terrain, marker near the rim, scroll cue at bottom.
2. Scroll to ~50% and screenshot — expect: camera closer/lower, trail partially drawn, section text legible on scrim.
3. Scroll to bottom and screenshot — expect: close shot of converged marker; contact section legible.
4. `read_console_messages` with `onlyErrors: true` — expect none.

- [ ] **Step 7: Commit**

```bash
git add -A index.html src/main.js src/styles/global.css src/styles/home.css src/three/DescentScene.js
git commit -m "feat: full-page scroll-driven observatory backdrop on home page

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Case-study page dark pass

**Files:**
- Modify: `src/styles/project.css` (only if contrast issues found)
- Modify: `project.html` (only if nav CTA parity wanted — swap same as Task 5 Step 1 nav change is NOT applicable; project nav has only "← All projects", leave as is)

**Interfaces:**
- Consumes: dark tokens (Task 2). No three.js — verify none creeps in.

- [ ] **Step 1: Confirm no three.js on the detail page**

Run: `grep -rn "three" src/project-main.js src/ui/pages/ProjectPage.js`
Expected: no output.

- [ ] **Step 2: Browser verification**

Screenshot `http://localhost:4174/project.html?id=bank-complaints` and `?id=tdg-forex` (rebuild first if the preview serves `dist`). Expect: dark page, ruling visible, metrics readable (`--marker` values on `--surface` cards), features/stack legible. Check `project.css` `color-mix(in srgb, var(--ink) 82%, var(--muted))` paragraphs remain ≥ 4.5:1 on `--surface`/`--void` — visually they are light gray; if muddy, bump ink share to 88%.

- [ ] **Step 3: Console sweep**

`read_console_messages` `onlyErrors: true` on the detail page. Expected: none.

- [ ] **Step 4: Commit (only if files changed)**

```bash
git add src/styles/project.css project.html
git commit -m "feat: dark-theme polish for case-study pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

If nothing needed changing, skip the commit and note it.

---

### Task 7: Docs + final verification sweep

**Files:**
- Modify: `README.md` (Design section)
- Modify: `CLAUDE.md` (Design system + architecture notes)

**Interfaces:** none produced; documentation only.

- [ ] **Step 1: Update README “Design” section**

Replace its body with:

```markdown
“The observatory”: a single dark theme where the site is one scientific
figure at night — graph-paper ruling over a full-page Three.js loss surface,
and **scrolling drives the gradient descent to convergence**. Ink/signal-blue
palette with a rust marker reserved for data. JetBrains Mono carries every
number and label; Bricolage Grotesque is the display face. Respects
`prefers-reduced-motion` (static converged wide shot), pauses rendering on
hidden tabs, caps device-pixel-ratio (2 desktop / 1.5 touch), and falls back
to a plain dark canvas when WebGL is unavailable. Case-study pages are
3D-free by design.
```

Also update the architecture tree: `three/DescentScene.js` → `three/ObservatoryBackdrop.js`, and add `ui/scrollProgress.js`.

- [ ] **Step 2: Update CLAUDE.md**

In the Design system section: replace the light-theme sentence with the dark tokens (`--void`, `--surface`, `--grid`, `--ink`, `--muted`, `--signal`, `--marker`) and note "One committed dark theme — no light mode, no toggle." In Architecture: rename `DescentScene.js` → `ObservatoryBackdrop.js` (exposes `setProgress`/`setPointer`; scroll wiring lives in `src/ui/scrollProgress.js` + `src/main.js`). Add a Commands note: `pnpm test` runs Vitest unit tests for pure logic.

- [ ] **Step 3: Full verification sweep**

Run: `pnpm test && pnpm build`
Expected: tests pass, build clean. Confirm in build output that the three.js chunk is still a separate lazy asset (a `ObservatoryBackdrop-*.js` chunk of ~470 kB, NOT merged into `main-*.js`).

Browser: repeat Task 5 Step 6 screenshots (top/mid/bottom) + one detail page; console sweep both pages.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document observatory dark theme and backdrop architecture

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
