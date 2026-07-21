# Portfolio — Sebastian Ramirez

Data science portfolio built with **Vite + Three.js** and vanilla JS in a clean-architecture layout. The hero is a live 3D figure: momentum gradient descent finding the minimum of a non-convex loss surface.

![Portfolio Preview](public/assets/portfolio-preview.webp)

## Stack

- [Vite](https://vitejs.dev) — dev server and build (multi-page: `index.html` + `project.html`)
- [Three.js](https://threejs.org) — hero visualization, lazy-loaded so content paints first
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
│   └── nav.js                     # shared chrome (menu, footer year)
├── three/                   # visualization, isolated from the rest
│   ├── lossLandscape.js           # surface math + real gradient-descent path
│   └── DescentScene.js            # scene, lifecycle (visibility/reduced-motion aware)
├── styles/                  # tokens.css + global/home/project styles
├── main.js                  # composition root — home page
└── project-main.js          # composition root — case-study page
```

Dependencies point inward: `ui` and `data` depend on `domain`; `domain` depends on nothing. The composition roots (`main.js`, `project-main.js`) are the only modules that know every layer.

## Adding a project

Add **one** record to `src/data/projects.data.js` (card copy, detail paragraphs, features, metrics, links) and drop a `.webp` image in `public/assets/`. Both the home grid and the detail page render from that single record — there is nothing to keep in sync.

## Design

“The plotting canvas”: the site reads like a well-set scientific figure — graph-paper background, ink/signal-blue palette, JetBrains Mono for every number and label, Bricolage Grotesque display type. Sections are captioned like figures (`fig. 02 — selected projects`). Respects `prefers-reduced-motion` (the hero renders as a static converged figure) and pauses rendering when off-screen or the tab is hidden.

## License

MIT — designed & developed by [Sebastian Ramirez](https://github.com/sebasr0).
