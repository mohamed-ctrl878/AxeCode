import { IWorkspaceAccess } from '../../domain/interface/IWorkspaceAccess';
import { repositoryRegistry } from './RepositoryRegistry';
import { WorkspaceItemDTO } from '../DTO/WorkspaceItemDTO';

export class WorkspaceRepository extends IWorkspaceAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.projectsEndpoint = import.meta.env.VITE_API_PROJECTS || 'api/projects';
    }

    async getWorkspace(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/workspace`);
        const data = response?.data || response || [];
        return data.map(item => new WorkspaceItemDTO(item));
    }

    async createWorkspaceItem(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/workspace`, data);
        return new WorkspaceItemDTO(response?.data || response);
    }

    async updateWorkspaceItem(projectId, itemId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/workspace/${itemId}`, data);
        return new WorkspaceItemDTO(response?.data || response);
    }

    async deleteWorkspaceItem(projectId, itemId) {
        const response = await this.apiClient.delete(`${this.projectsEndpoint}/${projectId}/workspace/${itemId}`);
        return response?.data || response;
    }
}
