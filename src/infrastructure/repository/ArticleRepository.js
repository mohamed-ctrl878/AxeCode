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
        this.endpoint = import.meta.env.VITE_API_ARTICLE_BASE;
    }

    async getById(id) {
        return await this.apiClient.get(`${this.endpoint}/${id}?populate[0]=author.avatar`);
    }

    async create(data) {
        const request = new ArticleRequest(data);
        request.validate(); // Ensure security validation passes before sending
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new ArticleRequest(data);
        request.validate();
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async like(contentId, contentType) { }
    async comment(contentId, contentType, commentData) { }
    async trackEngagement(contentId) { }

    /**
     * Fetches all articles for admin/CMS view.
     * @returns {Promise<Array>}
     */
    async getAll() {
        const response = await this.apiClient.get(`${this.endpoint}?populate[0]=author.avatar&sort=createdAt:desc`);
        return response?.data || response || [];
    }

    /**
     * Deletes an article by its documentId.
     * @param {string} id
     */
    async delete(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Lists articles authored by a specific user with pagination support.
     * @param {string} username 
     * @param {number} start - Offset start
     * @param {number} limit - Items per page
     * @returns {Promise<{items: Array, total: number}>}
     */
    async listByAuthor(username, start = 0, limit = 10) {
        const query = `filters[author][username][$eq]=${username}&populate[0]=author.avatar&sort=createdAt:desc&pagination[start]=${start}&pagination[limit]=${limit}`;
        const response = await this.apiClient.get(`${this.endpoint}?${query}`);
        
        return {
            items: response?.data || response || [],
            total: response?.meta?.pagination?.total || 0
        };
    }
}
