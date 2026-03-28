import { BaseRepository } from './BaseRepository';
import qs from 'qs';

/**
 * TestCaseRepository: Handles algorithmic problem validation data.
 */
export class TestCaseRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/test-cases';
    }

    /**
     * Fetches all test cases for a specific problem.
     * @param {string} problemId - The documentId of the problem.
     */
    async getByProblem(problemId) {
        try {
            const query = qs.stringify({
                filters: {
                    problem: { documentId: { $eq: problemId } }
                },
                sort: ['order:asc']
            }, { encodeValuesOnly: true });

            const response = await this.get(`${this.endpoint}?${query}`);
            return response.data || [];
        } catch (error) {
            console.error('[TestCaseRepository] Fetch by problem failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new test case linked to a problem.
     */
    async create(data) {
        try {
            const response = await this.post(this.endpoint, data);
            return response.data;
        } catch (error) {
            console.error('[TestCaseRepository] Create failed:', error);
            throw error;
        }
    }

    /**
     * Updates an existing test case.
     */
    async update(id, data) {
        try {
            const response = await this.put(this.endpoint, id, data);
            return response.data;
        } catch (error) {
            console.error('[TestCaseRepository] Update failed:', error);
            throw error;
        }
    }

    /**
     * Deletes a test case.
     */
    async delete(id) {
        try {
            await super.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (error) {
            console.error('[TestCaseRepository] Delete failed:', error);
            throw error;
        }
    }
}
