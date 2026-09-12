import { IReviewRequestAccess } from '../../domain/interface/IReviewRequestAccess';
import { repositoryRegistry } from './RepositoryRegistry';
import { ReviewRequestDTO } from '../DTO/ReviewRequestDTO';

export class ReviewRequestRepository extends IReviewRequestAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.projectsEndpoint = import.meta.env.VITE_API_PROJECTS || 'api/projects';
    }

    async getReviewRequests(projectId) {
        const response = await this.apiClient.get(`${this.projectsEndpoint}/${projectId}/review-requests`);
        const data = response?.data || response || [];
        return data.map(item => new ReviewRequestDTO(item));
    }

    async createReviewRequest(projectId, data) {
        const response = await this.apiClient.post(`${this.projectsEndpoint}/${projectId}/review-requests`, data);
        return new ReviewRequestDTO(response?.data || response);
    }

    async resolveReviewRequest(projectId, requestId, data) {
        const response = await this.apiClient.patch(`${this.projectsEndpoint}/${projectId}/review-requests/${requestId}/resolve`, data);
        return new ReviewRequestDTO(response?.data || response);
    }
}
