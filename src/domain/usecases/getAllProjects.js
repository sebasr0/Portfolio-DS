/**
 * Use-case: list every project, in the order the repository defines.
 * @param {import('../repositories/ProjectRepository.js').ProjectRepository} repository
 */
export function makeGetAllProjects(repository) {
  return async function getAllProjects() {
    return repository.getAll();
  };
}
