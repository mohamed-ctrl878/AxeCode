import { BaseRepository } from './BaseRepository';
import { ProblemRequest } from '../DTO/Request/ProblemRequest';

/**
 * Repository for Problem entities.
 */
export class ProblemRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_PROBLEM_ADD;
    }

    /**
     * Creates a new problem.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new ProblemRequest(rawData);
        return await this.upload(url, request);
    }
}
