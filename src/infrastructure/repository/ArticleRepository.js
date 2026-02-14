import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { ArticleRequest } from '../DTO/Request/ArticleRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * ArticleRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class ArticleRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_ARTICLE;
    }

    async create(data) {
        const request = new ArticleRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new ArticleRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async like(contentId, contentType) {}
    async comment(contentId, contentType, commentData) {}
    async trackEngagement(contentId) {}
}
