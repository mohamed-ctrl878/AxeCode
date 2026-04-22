import { BaseRepository } from './BaseRepository';

/**
 * AdminNotificationRepository: Handles admin notification consumption.
 */
export class AdminNotificationRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/admin-notifications';
    }

    /**
     * Fetches all admin notifications.
     * @param {string} status - Optional filter: 'PENDING', 'RESOLVED'
     * @returns {Promise<Array>}
     */
    async getAll(status = null) {
        let query = `populate[0]=actor.avatar&sort=createdAt:desc`;
        if (status) {
            query += `&filters[status][$eq]=${status}`;
        }
        const response = await this.get(`${this.endpoint}?${query}`);
        return response?.data || response || [];
    }

    /**
     * Marks an admin notification as read.
     * @param {string} id
     */
    async markRead(id) {
        return await this.put(this.endpoint, id, { read: true });
    }

    /**
     * Updates the status of an admin notification.
     * @param {string} id
     * @param {string} status - 'PENDING' or 'RESOLVED'
     */
    async updateStatus(id, status) {
        return await this.put(this.endpoint, id, { status });
    }
}
