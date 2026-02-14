import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { LessonRequest } from '../DTO/Request/LessonRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * LessonRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class LessonRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_LESSONS;
    }

    async create(data) {
        const request = new LessonRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new LessonRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async like(contentId, contentType) {}
    async comment(contentId, contentType, commentData) {}
    async trackEngagement(contentId) {}
}
