import { createProject } from '../domain/entities/Project.js';
import { ProjectRepository } from '../domain/repositories/ProjectRepository.js';
import { PROJECT_RECORDS } from './projects.data.js';

/**
 * In-memory implementation of the ProjectRepository contract.
 * Validates raw records into frozen Project entities once, at construction —
 * a malformed record fails loudly at startup, not silently at render time.
 */
export class InMemoryProjectRepository extends ProjectRepository {
  #projects;

  constructor(records = PROJECT_RECORDS) {
    super();
    this.#projects = records.map(createProject);
  }

  async getAll() {
    return this.#projects;
  }
}
