import { BaseRepository } from './BaseRepository';

/**
 * CommentAdminRepository: Handles admin moderation of comments.
 */
export class CommentAdminRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/comments';
    }

    /**
     * Fetches all comments for admin moderation.
     * @returns {Promise<Array>}
     */
    async getAll() {
        const query = `populate[0]=users_permissions_user.avatar&sort=createdAt:desc`;
        const response = await this.get(`${this.endpoint}?${query}`);
        return response?.data || response || [];
    }

    /**
     * Deletes a comment (moderation action).
     * @param {string} id
     */
    async deleteComment(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }
}
