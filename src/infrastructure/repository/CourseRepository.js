import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { CourseRequest } from '../DTO/Request/CourseRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * CourseRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class CourseRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_COURSES;
    }

    async create(data) {
        const request = new CourseRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new CourseRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    // Domain interface methods
    async like(contentId, contentType) { }
    async comment(contentId, contentType, commentData) { }
    async trackEngagement(contentId) { }

    /**
     * Fetches a single course preview by documentId.
     * @param {string} documentId
     * @returns {Promise<object>} Raw course data from API.
     */
    async getPreview(documentId) {
        const previewEndpoint = import.meta.env.VITE_API_PREVIEW_COURSE;
        const response = await this.apiClient.get(`${previewEndpoint}/${documentId}`);
        return response?.data || response;
    }
}
