import { headlineMetric } from '../../domain/entities/Project.js';
import { categoryLabel } from '../categoryLabels.js';
import { esc } from '../html.js';

const MAX_TAGS = 4;

/** Card leads with the outcome (headline metric or status), not tag soup. */
export function projectCard(project) {
  const metric = headlineMetric(project);
  const shown = project.technologies.slice(0, MAX_TAGS);
  const overflow = project.technologies.length - shown.length;

  return `
    <article class="card">
      <div class="card__media">
        <img src="${esc(project.image)}" alt="${esc(project.imageAlt)}" width="640" height="360" loading="lazy">
      </div>
      <div class="card__body">
        <p class="card__category mono">${esc(categoryLabel(project.category))}</p>
        <h3 class="card__title">
          <a class="card__link" href="project.html?id=${encodeURIComponent(project.id)}">${esc(project.title)}</a>
        </h3>
        <p class="card__summary">${esc(project.summary)}</p>
        ${
          metric
            ? `<p class="card__metric mono"><strong>${esc(metric.value)}</strong> ${esc(metric.label.toLowerCase())}</p>`
            : `<p class="card__metric card__metric--status mono">${esc((project.status ?? 'case study').toLowerCase())} →</p>`
        }
        <ul class="card__tags mono" aria-label="Technologies">
          ${shown.map((t) => `<li>${esc(t)}</li>`).join('')}
          ${overflow > 0 ? `<li>+${overflow}</li>` : ''}
        </ul>
      </div>
    </article>`;
}
