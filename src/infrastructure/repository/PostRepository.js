import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { PostRequest } from '../DTO/Request/PostRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * PostRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class PostRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_POSTS;
    }

    async create(data) {
        const request = new PostRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new PostRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    // Domain interface methods
    async like(contentId, contentType) {}
    async comment(contentId, contentType, commentData) {}
    async trackEngagement(contentId) {}
}
