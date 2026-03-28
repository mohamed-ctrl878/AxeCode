import { BaseRepository } from './BaseRepository';
import qs from 'qs';

/**
 * CodeTemplateRepository: Handles language-specific starter/wrapper code for problems.
 */
export class CodeTemplateRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/code-templates';
    }

    /**
     * Fetches all code templates for a specific problem.
     * @param {string} problemId - The documentId of the problem.
     */
    async getByProblem(problemId) {
        try {
            const query = qs.stringify({
                filters: {
                    problem: { documentId: { $eq: problemId } }
                }
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${query}`);
            return response.data || [];
        } catch (error) {
            console.error('[CodeTemplateRepository] Fetch by problem failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new code template.
     */
    async create(data) {
        try {
            const response = await this.post(this.endpoint, data);
            return response.data;
        } catch (error) {
            console.error('[CodeTemplateRepository] Create failed:', error);
            throw error;
        }
    }

    /**
     * Updates an existing code template.
     */
    async update(id, data) {
        try {
            const response = await this.put(this.endpoint, id, data);
            return response.data;
        } catch (error) {
            console.error('[CodeTemplateRepository] Update failed:', error);
            throw error;
        }
    }

    /**
     * Deletes a code template.
     */
    async delete(id) {
        try {
            await super.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (error) {
            console.error('[CodeTemplateRepository] Delete failed:', error);
            throw error;
        }
    }
}
