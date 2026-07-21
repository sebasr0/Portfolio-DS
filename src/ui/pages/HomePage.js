import { projectCard } from '../components/projectCard.js';

/**
 * Home page renderer. Depends only on the use-case it is given —
 * no knowledge of where project data comes from.
 */
export function makeHomePage({ getAllProjects }) {
  return {
    async render() {
      const grid = document.querySelector('[data-projects-grid]');
      if (!grid) return;
      const projects = await getAllProjects();
      grid.innerHTML = projects.map(projectCard).join('');
    },
  };
}
