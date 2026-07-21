/**
 * Repository contract the domain depends on. Data sources (in-memory today,
 * a CMS or JSON API tomorrow) implement this; use-cases never know which.
 */
export class ProjectRepository {
  /** @returns {Promise<import('../entities/Project.js').ProjectProps[]>} */
  async getAll() {
    throw new Error('ProjectRepository.getAll not implemented');
  }

  /** @returns {Promise<import('../entities/Project.js').ProjectProps | null>} */
  async getById(id) {
    const all = await this.getAll();
    return all.find((p) => p.id === id) ?? null;
  }
}
