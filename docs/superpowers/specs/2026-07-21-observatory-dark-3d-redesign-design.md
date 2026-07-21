# Design: "The Observatory" — dark mode + full-page 3D descent backdrop

Date: 2026-07-21
Status: approved (sections 1–4 approved by user in brainstorming session)

## Goal

Convert the portfolio to a single dark theme and replace the framed hero figure
with a full-page ambient 3D backdrop where **scrolling drives the gradient
descent to convergence**. Priorities (user-selected): first-impression wow,
recruiter efficiency, mobile polish. Explicitly out of scope: playful
interactivity (draggable objects), a light/dark toggle.

## 1. Visual system — Observatory tokens

Replace the light "plotting canvas" tokens in `src/styles/tokens.css` with the
night inversion. Single theme; delete light values, add no toggle machinery.

| Token | Value | Role |
|---|---|---|
| `--void` | `#0B111A` | page background (replaces `--paper`) |
| `--surface` | `#121A26` | cards, panels — opaque, never blurred over canvas |
| `--grid` | `#1F2B3B` | hairlines and graph-paper ruling |
| `--ink` | `#E9EFF6` | body text (≈14:1 contrast on void) |
| `--muted` | `#93A3B5` | captions, secondary (≥4.5:1 on void) |
| `--signal` | `#55A6FF` | links, CTAs, wireframe strokes |
| `--marker` | `#FF6B3D` | descent trail, headline full stop, metric values |

- Graph-paper ruling persists on the body, fainter (night version).
- Type unchanged: Bricolage Grotesque (display) / Instrument Sans (body) /
  JetBrains Mono (all numbers, labels, eyebrows).
- Buttons: primary = white text on signal-blue background; secondary =
  surface background + grid border, ink text. Focus outlines signal blue.
- Rename `--paper` → `--void` at all usage sites (grep for `--paper`).

## 2. Backdrop scene and scroll choreography

One fixed full-viewport `<canvas data-backdrop>` behind all content
(z-index −1) on `index.html` only.

- Surface terrain sits low in frame; `Fog` fades it into the void. Wireframe
  strokes in `--signal`, capped at opacity ≤ 0.35; trail/marker in `--marker`.
- **Scroll scrubs the story.** Normalized page progress `t ∈ [0,1]` drives
  (a) descent-trail draw progress and (b) a camera path: t=0 wide establishing
  shot, marker at the rim; t=1 close shot of the converged marker in the
  global basin. Camera and progress are damped (lerp factor ≈ 0.08 per frame)
  so motion glides rather than tracking scroll 1:1.
- Desktop pointer parallax: ±1.5° camera offset. Disabled on touch devices.
- The hero figure frame is removed; the mono caption remains as a floating
  label in the hero (`fig. 1 — momentum gradient descent…`).
- Readability: vertical scrim behind the content column
  (`linear-gradient` of void at ~92% alpha fading toward edges); cards are
  opaque `--surface`.

## 3. UX and page changes

- **Hero**: full viewport (`100svh`), eyebrow/H1/lede/CTAs overlaid on the
  scene; mono scroll cue `scroll to descend ↓`. Headline keeps the rust
  full stop.
- **Nav**: persistent primary "Email me" button replaces "Download CV" as the
  nav CTA; CV download stays in the menu list and in Contact.
- **Case-study pages (`project.html`)**: no 3D. Dark tokens + ruling only.
- **Mobile**: renderer DPR cap 1.5; reduce surface tessellation (~90→~48
  segments); no pointer parallax; same scroll choreography; dark menu panel;
  tightened type scale.
- **Accessibility/fallbacks**:
  - `prefers-reduced-motion: reduce` → static wide shot, full trail drawn,
    no scroll/camera animation.
  - No WebGL or dynamic-import failure → body class enables a pure-CSS
    fallback (void gradient + ruling); all content fully usable.
  - Canvas is `aria-hidden` decorative; contrast floors as in section 1.

## 4. Architecture

Clean-architecture boundaries preserved:

- `src/three/lossLandscape.js` — **unchanged** (pure math).
- `src/three/DescentScene.js` → refactored to `src/three/ObservatoryBackdrop.js`:
  full-viewport scene; constructor takes `(canvas, colors)`; exposes
  `setProgress(t)`, `setPointer(x, y)`, `start/stop/resize/dispose`.
  No knowledge of scroll or DOM outside its canvas.
- New `src/ui/scrollProgress.js` — rAF-throttled scroll listener emitting
  normalized damped progress; composition root wires it to the backdrop.
- `src/main.js` — wires tokens → backdrop, scrollProgress → `setProgress`,
  pointer events (desktop only) → `setPointer`; owns the failure path
  (body class for CSS fallback).
- `project-main.js` imports no three.js.
- Lazy loading stays: three.js chunk is dynamically imported after content
  renders.

## Error handling

- Backdrop import/WebGL failure: caught in `main.js`, adds
  `backdrop-fallback` class to `<body>`, CSS provides the static dark look.
- Malformed project records still fail loudly at repository construction
  (unchanged).

## Verification

- `pnpm build` clean.
- Browser (Chrome extension): screenshots at scroll top / mid / bottom of
  `index.html` — confirm choreography states, scrim readability, converged
  end state; screenshot `project.html` dark; console-error sweep on both.
- Confirm reduced-motion static frame (emulate via DevTools if practical).
- Confirm initial JS payload unchanged (three.js still a lazy chunk).

## Out of scope

- Light theme / toggle.
- 3D on case-study pages.
- New content or copy changes beyond the scroll cue and nav CTA swap.
