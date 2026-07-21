/**
 * Composition root — home page. The only module that knows about every
 * layer: it constructs the repository, injects it into use-cases, hands
 * those to the UI, and mounts the three.js hero with the design tokens.
 */
import './styles/tokens.css';
import './styles/global.css';
import './styles/home.css';

import { InMemoryProjectRepository } from './data/InMemoryProjectRepository.js';
import { makeGetAllProjects } from './domain/usecases/getAllProjects.js';
import { makeHomePage } from './ui/pages/HomePage.js';
import { initChrome } from './ui/nav.js';

const repository = new InMemoryProjectRepository();
const homePage = makeHomePage({ getAllProjects: makeGetAllProjects(repository) });

initChrome();
homePage.render();

// The hero scene is heavy (three.js) and non-critical: load it lazily so
// content renders first, and skip it entirely if WebGL is unavailable.
const canvas = document.querySelector('[data-descent-canvas]');
if (canvas) {
  import('./three/DescentScene.js')
    .then(({ mountDescentScene }) => {
      const tokens = getComputedStyle(document.documentElement);
      const color = (name) => tokens.getPropertyValue(name).trim();
      mountDescentScene(canvas, {
        paper: color('--surface'),
        grid: color('--grid'),
        ink: color('--ink'),
        accent: color('--signal'),
        marker: color('--marker'),
      });
    })
    .catch(() => {
      // No WebGL / load failure: the figure frame stays, showing only the caption.
      canvas.closest('.hero__figure')?.classList.add('hero__figure--static');
    });
}
