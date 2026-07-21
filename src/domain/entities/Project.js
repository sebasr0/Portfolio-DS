/**
 * Project entity. Pure domain object — no DOM, no framework, no data-source detail.
 * Both pages consume projects only through this shape, so card and detail views
 * can never drift out of sync again.
 */

/**
 * @typedef {Object} Metric
 * @property {string} value  e.g. "79.9%"
 * @property {string} label  e.g. "F1 score"
 */

/**
 * @typedef {Object} ProjectProps
 * @property {string} id
 * @property {string} title
 * @property {string} category      machine-learning | nlp | llm | ...
 * @property {string} summary       one-liner for cards
 * @property {string[]} paragraphs  long-form overview for the detail page
 * @property {string} image
 * @property {string} imageAlt
 * @property {string[]} technologies
 * @property {string[]} features
 * @property {Metric[]} metrics
 * @property {string} [status]      e.g. "Paper in progress"
 * @property {string} [sourceUrl]
 * @property {string} [demoUrl]
 */

const REQUIRED = ['id', 'title', 'category', 'summary', 'image'];

/** @param {ProjectProps} props */
export function createProject(props) {
  for (const key of REQUIRED) {
    if (!props[key]) throw new Error(`Project is missing required field "${key}"`);
  }
  return Object.freeze({
    paragraphs: [],
    technologies: [],
    features: [],
    metrics: [],
    imageAlt: props.title,
    status: null,
    sourceUrl: null,
    demoUrl: null,
    ...props,
  });
}

/** Headline metric shown on cards; null when a project has none. */
export function headlineMetric(project) {
  return project.metrics[0] ?? null;
}
