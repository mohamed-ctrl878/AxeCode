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

    async getById(id) {
        return await this.apiClient.get(`${this.endpoint}/${id}`);
    }

    async create(data) {
        const request = new LessonRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new LessonRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async delete(id) {
        return await this.apiClient.delete(this.endpoint, id);
    }

    async like(contentId, contentType) {}
    async comment(contentId, contentType, commentData) {}
    async trackEngagement(lessonId, courseId, status = 'completed', lastWatched = 0) {
        const payload = {
            data: {
                lessonId,
                courseId,
                status,
                lastWatched
            }
        };
        // The repository should only wrap once. If apiClient also wraps, we'll see it in logs.
        // But the previous log showed { data: { data: ... } }, so we remove one layer from our code.
        return await this.apiClient.post('/api/user-progress/update', payload.data);
    }
}
