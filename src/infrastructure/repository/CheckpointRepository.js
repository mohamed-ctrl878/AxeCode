import { repositoryRegistry } from './RepositoryRegistry';
import { CheckpointDTO } from '../DTO/CheckpointDTO';

export class CheckpointRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
        this.projectsEndpoint = import.meta.env.VITE_API_PROJECTS || 'api/projects';
    }

    async getCheckpoints(projectId, params = {}) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/checkpoints`, params);
        const data = response?.data || response || [];
        return data.map(item => new CheckpointDTO(item));
    }

    async createCheckpoint(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/checkpoints`, data);
        return new CheckpointDTO(response?.data || response);
    }

    async updateCheckpoint(projectId, checkpointId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/checkpoints/${checkpointId}`, data);
        return new CheckpointDTO(response?.data || response);
    }

    async deleteCheckpoint(projectId, checkpointId) {
        return await this.apiClient.delete(`${this.projectsEndpoint}/${projectId}/checkpoints/${checkpointId}`);
    }
}
