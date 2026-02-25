import { BaseRepository } from './BaseRepository';
import { IContentInteraction } from '../../domain/interface/IContentInteraction';

/**
 * SharedInteractionRepository
 * Implements IContentInteraction to provide specific API calls for Likes, Comments, and Reports across all content types.
 */
export class SharedInteractionRepository extends IContentInteraction {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient || new BaseRepository();
    }

    /**
     * Create is required by base IInteraction, but typically we use the specific methods below.
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async create(data) {
        throw new Error("Use specific methods (like, comment, report) instead.");
    }

    /**
     * Update is required by base IInteraction.
     * @param {string|number} id 
     * @param {object} data 
     * @returns {Promise<any>}
     */
    async update(id, data) {
        throw new Error("Update not currently supported generically here.");
    }

    async trackEngagement(contentId) {
        // Optional tracking method implementation
        return Promise.resolve();
    }

    /**
     * Toggles a like for the user on specific content.
     * Endpoint: POST /api/likes/toggle
     * @param {string|number} docId 
     * @param {string} contentType 
     */
    async like(docId, contentType) {
        const body = {
            content_types: contentType,
            docId: docId.toString()
        };
        // Overridden to use BaseRepository's post which builds standard request structures
        return await this.apiClient.post('/api/likes/toggle', body);
    }

    /**
     * Adds a comment to a content
     * Endpoint: POST /api/comments
     * @param {string|number} docId 
     * @param {string} contentType 
     * @param {object} commentData 
     */
    async comment(docId, contentType, commentData) {
        const payload = {
            docId: docId.toString(),
            content_types: contentType,
            ...commentData
        };
        return await this.apiClient.post('/api/comments', payload);
    }

    /**
     * Gets comments for content
     * Endpoint: GET /api/comments
     * @param {string|number} docId
     * @param {string} contentType
     * @param {object} params Pagination or filter params
     */
    async getComments(docId, contentType, params = {}) {
        const queryParams = {
            ...params,
            filters: {
                ...(params.filters || {}),
                docId: { $eq: docId.toString() },
                content_types: { $eq: contentType } // ensure enum match
            }
            // Removed populate: params.populate || 'users_permissions_user'
            // because BaseRepository automatically appends &populate=* at the end
        };
        return await this.apiClient.get('/api/comments', queryParams);
    }

    /**
     * Submits a report
     * Endpoint: POST /api/reports
     * @param {string|number} docId
     * @param {string} contentType
     * @param {object} reportData Details and reasons
     */
    async report(docId, contentType, reportData) {
        const payload = {
            docId: docId.toString(),
            content_type: contentType,
            ...reportData
        };
        return await this.apiClient.post('/api/reports', payload);
    }
}
