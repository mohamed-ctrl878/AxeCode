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

    /**
     * Fetches all blogs for admin/CMS view.
     * @returns {Promise<Array>}
     */
    async getAll() {
        const response = await this.apiClient.get(`${this.endpoint}?populate[0]=publisher.avatar&populate[1]=image&sort=createdAt:desc`);
        return response?.data || response || [];
    }

    /**
     * Deletes a blog by its documentId.
     * @param {string} id
     */
    async delete(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Lists blogs authored by a specific user with pagination support.
     * @param {string} username 
     * @param {number} start - Offset start
     * @param {number} limit - Items per page
     * @returns {Promise<{items: Array, total: number}>}
     */
    async listByAuthor(username, start = 0, limit = 10) {
        const query = `filters[publisher][username][$eq]=${username}&populate[0]=publisher.avatar&populate[1]=image&sort=createdAt:desc&pagination[start]=${start}&pagination[limit]=${limit}`;
        const response = await this.apiClient.get(`${this.endpoint}?${query}`);
        
        return {
            items: response?.data || response || [],
            total: response?.meta?.pagination?.total || 0
        };
    }

    /**
     * Fetches a single blog post by its document ID/UID.
     * @param {string} id 
     * @returns {Promise<any>}
     */
    async getById(id) {
        // Standard Strapi document fetch with basic population
        const query = `populate[0]=publisher.avatar&populate[1]=image`;
        const response = await this.apiClient.get(`${this.endpoint}/${id}?${query}`);
        return response?.data || response;
    }
}
