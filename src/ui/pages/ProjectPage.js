import { categoryLabel } from '../categoryLabels.js';
import { esc } from '../html.js';

/**
 * Case-study page renderer: fills the article from a Project entity, or
 * renders an honest not-found state. Sections with no content are omitted
 * entirely rather than rendered empty.
 */
export function makeProjectPage({ getProjectById }) {
  return {
    async render(id) {
      const root = document.querySelector('[data-project-root]');
      if (!root) return;

      const project = await getProjectById(id);
      if (!project) {
        document.title = 'Project not found — Sebastian Ramirez';
        root.innerHTML = notFound();
        return;
      }

      document.title = `${project.title} — Sebastian Ramirez`;
      root.innerHTML = article(project);
    },
  };
}

function article(p) {
  return `
    <article class="study">
      <header class="study__header">
        <p class="eyebrow mono">case study — ${esc(categoryLabel(p.category))}${
          p.status ? ` · ${esc(p.status.toLowerCase())}` : ''
        }</p>
        <h1 class="study__title">${esc(p.title)}</h1>
      </header>

      <figure class="study__figure">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="1280" height="720">
        <figcaption class="mono">fig. 1 — ${esc(p.imageAlt.toLowerCase())}</figcaption>
      </figure>

      <section class="study__section">
        <h2>Overview</h2>
        ${p.paragraphs.map((par) => `<p>${esc(par)}</p>`).join('')}
      </section>

      ${
        p.metrics.length
          ? `<section class="study__section">
               <h2>Results</h2>
               <dl class="metrics">
                 ${p.metrics
                   .map(
                     (m) => `<div class="metrics__item">
                       <dt class="mono">${esc(m.label)}</dt>
                       <dd class="mono">${esc(m.value)}</dd>
                     </div>`,
                   )
                   .join('')}
               </dl>
             </section>`
          : ''
      }

      ${
        p.features.length
          ? `<section class="study__section">
               <h2>Key features</h2>
               <ul class="features">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
             </section>`
          : ''
      }

      ${
        p.technologies.length
          ? `<section class="study__section">
               <h2>Stack</h2>
               <ul class="card__tags mono" aria-label="Technologies">
                 ${p.technologies.map((t) => `<li>${esc(t)}</li>`).join('')}
               </ul>
             </section>`
          : ''
      }

      ${
        p.sourceUrl || p.demoUrl
          ? `<div class="study__actions">
               ${p.demoUrl ? `<a class="btn btn--primary" href="${esc(p.demoUrl)}" target="_blank" rel="noopener noreferrer">Open live demo</a>` : ''}
               ${p.sourceUrl ? `<a class="btn ${p.demoUrl ? 'btn--secondary' : 'btn--primary'}" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source on GitHub</a>` : ''}
             </div>`
          : ''
      }
    </article>`;
}

function notFound() {
  return `
    <div class="study study--missing">
      <p class="eyebrow mono">error — 404</p>
      <h1 class="study__title">Project not found</h1>
      <p>This case study doesn't exist or has moved. Everything current is on the home page.</p>
      <a class="btn btn--primary" href="index.html#projects">Back to projects</a>
    </div>`;
}
