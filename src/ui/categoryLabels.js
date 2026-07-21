/** Presentation labels for category slugs. Unknown slugs fall back to the slug itself. */
const LABELS = {
  'machine-learning': 'Machine Learning',
  'deep-learning': 'Deep Learning',
  nlp: 'NLP',
  'big-data': 'Big Data',
  llm: 'LLM',
};

export function categoryLabel(slug) {
  return LABELS[slug] ?? slug;
}
