import { IProblemInteraction } from '../../domain/interface/IProblemInteraction';
import { ProblemRequest } from '../DTO/Request/ProblemRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * ProblemRepository implementing IProblemInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class ProblemRepository extends IProblemInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_PROBLEM_ADD;
    }

    async create(data) {
        const request = new ProblemRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new ProblemRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async submitSolution(problemId, solution) {}
}
