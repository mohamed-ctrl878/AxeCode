import { BaseRepository } from './BaseRepository';
import { repositoryRegistry } from './RepositoryRegistry';

export class CategorizationRepository extends BaseRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
    }

    async getCourseTypes() {
        const endpoint = import.meta.env.VITE_API_COURSE_TYPES;
        const response = await this.apiClient.get(endpoint);
        return response?.data || response;
    }

    async getProblemTypes() {
        const endpoint = import.meta.env.VITE_API_PROBLEM_TYPES;
        const response = await this.apiClient.get(endpoint);
        return response?.data || response;
    }
}
