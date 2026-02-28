import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { BlogRequest } from '../DTO/Request/BlogRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * BlogRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class BlogRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_BLOG_BASE;
    }

    async create(data) {
        const request = new BlogRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new BlogRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async like(contentId, contentType) {}
    async comment(contentId, contentType, commentData) {}
    async trackEngagement(contentId) {}
}
