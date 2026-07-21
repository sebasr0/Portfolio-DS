# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Data science portfolio for Sebastian Ramirez. Vite multi-page app (no framework): `index.html` (home) and `project.html` (case study, driven by `?id=` query param). Three.js renders a full-page scroll-driven backdrop on the home page; case-study pages are 3D-free. Vitest covers pure logic; no linter.

## Commands

Use **pnpm** (not npm — user preference; activate via `corepack enable pnpm` if missing).

- `pnpm dev` — dev server
- `pnpm build` — production build to `dist/`
- `pnpm preview` — serve the built site
- `pnpm test` — runs Vitest unit tests for pure logic (loss-landscape math, scroll-progress math)

`pnpm-workspace.yaml` allowlists esbuild's install script (`allowBuilds`) — required for the build to work under pnpm's script sandboxing.

## Architecture

Clean architecture with dependencies pointing inward (domain ← data/ui/three ← composition roots):

- `src/domain/` — pure logic: `Project` entity (validated + frozen in `createProject`), `ProjectRepository` contract, use-cases (`getAllProjects`, `getProjectById`). No DOM or library imports allowed here.
- `src/data/projects.data.js` — **single source of truth for all project content** (card copy, detail paragraphs, metrics, links). Adding a project = one record here + a `.webp` in `public/assets/`. Both pages render from the same record.
- `src/ui/` — DOM renderers (`pages/HomePage.js`, `pages/ProjectPage.js`, `components/projectCard.js`). All interpolated content goes through `esc()` from `ui/html.js`. Empty sections (no metrics, no links) are omitted, never rendered empty. `ui/scrollProgress.js` is the pure scroll → normalized-progress math plus the rAF-throttled scroll/resize DOM wiring (`watchScrollProgress`), unit-tested independently of Three.js.
- `src/three/` — `lossLandscape.js` is pure math (surface + analytic gradient + real momentum-descent path); `ObservatoryBackdrop.js` is the Three.js presentation, mounted lazily as a full-page backdrop from `src/main.js`. It exposes `setProgress(t)` (scrubs the descent trail and camera to scroll position, driven by `src/ui/scrollProgress.js`) and `setPointer(nx, ny)` (subtle camera drift on pointer-fine devices). Colors are injected from CSS custom properties by the composition root, never hard-coded. The scene pauses off-screen/hidden-tab and renders a static converged frame under `prefers-reduced-motion`.
- `src/main.js` / `src/project-main.js` — composition roots (the only files that wire layers together). Three.js and the scroll-progress wiring are loaded via dynamic import so the initial page stays small; case-study pages never load Three.js at all.

## Design system

Tokens live in `src/styles/tokens.css` ("the observatory" aesthetic — the plotting canvas at night): `--void` page background, `--surface` cards/panels, `--grid` hairlines/graph-paper ruling, `--ink` text, `--muted` secondary text, `--signal` blue for links/CTAs/wireframe strokes, `--marker` rust reserved for data marks (descent trail, metric accents). Type: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (all numbers/labels/eyebrows, class `mono`). Sections are captioned like scientific figures (`fig. 0N — …`); keep that convention when adding sections. One committed dark theme — no light mode, no toggle.
