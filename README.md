# Portfolio — Sebastian Ramirez

Data science portfolio built with **Vite + Three.js** and vanilla JS in a clean-architecture layout. A full-page 3D backdrop renders momentum gradient descent finding the minimum of a non-convex loss surface, with scroll driving the descent toward convergence.

![Portfolio Preview](public/assets/portfolio-preview.webp)

## Stack

- [Vite](https://vitejs.dev) — dev server and build (multi-page: `index.html` + `project.html`)
- [Three.js](https://threejs.org) — full-page scroll-driven backdrop, lazy-loaded so content paints first
- Vanilla JS (ES modules), no framework
- pnpm as the package manager

## Development

```bash
corepack enable pnpm   # if pnpm is not installed
pnpm install
pnpm dev               # dev server
pnpm build             # production build → dist/
pnpm preview           # serve the build locally
```

Deploy the `dist/` folder to any static host (GitHub Pages, Netlify, Vercel).

## Architecture

```
src/
├── domain/                  # pure logic — no DOM, no libraries
│   ├── entities/Project.js        # validated, frozen Project entity
│   ├── repositories/              # repository contract
│   └── usecases/                  # getAllProjects, getProjectById
├── data/                    # data sources
│   ├── projects.data.js           # single source of truth for all project content
│   └── InMemoryProjectRepository.js
├── ui/                      # DOM rendering
│   ├── components/                # project card
│   ├── pages/                     # HomePage, ProjectPage renderers
│   ├── nav.js                     # shared chrome (menu, footer year)
│   └── scrollProgress.js          # scroll → normalized progress for the backdrop
├── three/                   # visualization, isolated from the rest
│   ├── lossLandscape.js           # surface math + real gradient-descent path
│   └── ObservatoryBackdrop.js     # scene, lifecycle (visibility/reduced-motion aware)
├── styles/                  # tokens.css + global/home/project styles
├── main.js                  # composition root — home page
└── project-main.js          # composition root — case-study page
```

Dependencies point inward: `ui` and `data` depend on `domain`; `domain` depends on nothing. The composition roots (`main.js`, `project-main.js`) are the only modules that know every layer.

## Adding a project

Add **one** record to `src/data/projects.data.js` (card copy, detail paragraphs, features, metrics, links) and drop a `.webp` image in `public/assets/`. Both the home grid and the detail page render from that single record — there is nothing to keep in sync.

## Design

“The observatory”: a single dark theme where the site is one scientific
figure at night — graph-paper ruling over a full-page Three.js loss surface,
and **scrolling drives the gradient descent to convergence**. Ink/signal-blue
palette with a rust marker reserved for data. JetBrains Mono carries every
number and label; Bricolage Grotesque is the display face. Respects
`prefers-reduced-motion` (static converged wide shot), pauses rendering on
hidden tabs, caps device-pixel-ratio (2 desktop / 1.5 touch), and falls back
to a plain dark canvas when WebGL is unavailable. Case-study pages are
3D-free by design.

## License

MIT — designed & developed by [Sebastian Ramirez](https://github.com/sebasr0).
