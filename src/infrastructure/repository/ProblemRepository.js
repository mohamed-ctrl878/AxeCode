import { BaseRepository } from './BaseRepository';
import qs from 'qs';

/**
 * ProblemRepository: Handles algorithmic problem data.
 */
export class ProblemRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/problems';
    }

    /**
     * Fetches admin-owned problems or all problems if authorized.
     */
    async getAll() {
        try {
            const query = qs.stringify({
                populate: ['problem_types'],
                sort: ['createdAt:desc']
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${query}`);
            return response.data || [];
        } catch (error) {
            console.error('[ProblemRepository] Fetch admin failed:', error);
            throw error;
        }
    }

    /**
     * Fetches a single problem with full details for management.
     */
    async getById(id) {
        try {
            const query = qs.stringify({
                populate: {
                    problem_types: true,
                    test_cases: {
                        sort: ['order:asc']
                    },
                    code_templates: true
                }
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}/${id}?${query}`);
            return response.data;
        } catch (error) {
            console.error('[ProblemRepository] GetById failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new problem.
     * Note: Backend lifecycles will handle auto-generation of code templates.
     */
    async create(data) {
        try {
            const response = await this.post(this.endpoint, data);
            return response.data;
        } catch (error) {
            console.error('[ProblemRepository] Create failed:', error);
            throw error;
        }
    }

    /**
     * Updates problem metadata or technical signature.
     */
    async update(id, data) {
        try {
            const response = await this.put(this.endpoint, id, data);
            return response.data;
        } catch (error) {
            console.error('[ProblemRepository] Update failed:', error);
            throw error;
        }
    }

    /**
     * Deletes a problem.
     */
    async delete(id) {
        try {
            await super.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (error) {
            console.error('[ProblemRepository] Delete failed:', error);
            throw error;
        }
    }

    /**
     * Generically searches for problems by title (partial match).
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async search(query) {
        if (!query) return [];
        try {
            const q = qs.stringify({
                filters: {
                    title: {
                        $containsi: query
                    }
                },
                populate: ['problem_types'],
                pagination: { limit: 10 }
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${q}`);
            return response.data || [];
        } catch (error) {
            console.error('[ProblemRepository] Search failed:', error);
            throw error;
        }
    }
}
