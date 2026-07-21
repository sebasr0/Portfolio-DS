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
