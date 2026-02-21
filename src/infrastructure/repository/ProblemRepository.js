import { IProblemInteraction } from '../../domain/interface/IProblemInteraction';
import { ProblemRequest } from '../DTO/Request/ProblemRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * ProblemRepository implementing IProblemInteraction + IProblemAccess.
 * Depends on IApiClient (abstracted technical layer).
 */
export class ProblemRepository extends IProblemInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_PROBLEMS;
        this.createEndpoint = import.meta.env.VITE_API_PROBLEM_ADD;
    }

    /**
     * Fetch all problems with optional filters and pagination.
     * @param {object} params - { filters, page, pageSize }
     * @returns {Promise<{data: Array, meta: object}>}
     */
    async getAll(params = {}) {
        const queryParams = {};
        if (params.filters) {
            queryParams.filters = params.filters;
        }
        if (params.page) {
            queryParams.pagination = { page: params.page, pageSize: params.pageSize || 25 };
        }
        queryParams.populate = ['problem_types'];
        return await this.apiClient.get(this.endpoint, { params: queryParams });
    }

    /**
     * Fetch a single problem by documentId with full relations.
     * @param {string} id - documentId
     * @returns {Promise<{data: object}>}
     */
    async getById(id) {
        return await this.apiClient.get(`${this.endpoint}/${id}`, {
            params: { populate: ['problem_types', 'test_cases', 'code_templates'] }
        });
    }

    async create(data) {
        const request = new ProblemRequest(data);
        return await this.apiClient.post(this.createEndpoint, request);
    }

    async update(id, data) {
        const request = new ProblemRequest(data);
        return await this.apiClient.put(this.createEndpoint, id, request);
    }

    async submitSolution(problemId, solution) { }
}
