/**
 * Use-case: fetch a single project for the detail page.
 * Resolves to null (never throws) when the id is unknown — the UI decides
 * how to present a missing project.
 * @param {import('../repositories/ProjectRepository.js').ProjectRepository} repository
 */
export function makeGetProjectById(repository) {
  return async function getProjectById(id) {
    if (!id) return null;
    return repository.getById(id);
  };
}
