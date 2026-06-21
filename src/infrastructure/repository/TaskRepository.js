import { ITaskAccess } from '../../domain/interface/ITaskAccess';
import { repositoryRegistry } from './RepositoryRegistry';
import { TaskDTO, SprintDTO } from '../DTO/TaskDTO';

export class TaskRepository extends ITaskAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.projectsEndpoint = import.meta.env.VITE_API_PROJECTS || 'api/projects';
    }

    // --- Sprints ---
    async getSprints(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/sprints`);
        const data = response?.data || response || [];
        return data.map(item => new SprintDTO(item));
    }

    async createSprint(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/sprints`, data);
        return new SprintDTO(response?.data || response);
    }

    async updateSprint(projectId, sprintId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/sprints/${sprintId}`, data);
        return new SprintDTO(response?.data || response);
    }

    async startSprint(projectId, sprintId) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/sprints/${sprintId}/start`);
        return new SprintDTO(response?.data || response);
    }

    // --- Tasks ---
    async getTasks(projectId, params = {}) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/tasks`, params);
        const data = response?.data || response || [];
        return data.map(item => new TaskDTO(item));
    }

    async createTask(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/tasks`, data);
        return new TaskDTO(response?.data || response);
    }

    async updateTask(projectId, taskId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/tasks/${taskId}`, data);
        return new TaskDTO(response?.data || response);
    }

    async transitionTask(projectId, taskId, status) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/tasks/${taskId}/transition`, { status });
        return new TaskDTO(response?.data || response);
    }

    async reorderTasks(projectId, tasks) {
        // tasks is an array of { documentId, order }
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/tasks/reorder`, { tasks });
        return response?.data || response;
    }

    async deleteTask(projectId, taskId) {
        return await this.apiClient.delete(`${this.projectsEndpoint}/${projectId}/tasks/${taskId}`);
    }

    // Base interface methods
    async getAll(params = {}) {
        throw new Error('Use getTasks(projectId, params) instead.');
    }
    async getById(id, params = {}) {
        throw new Error('Not implemented.');
    }
}
