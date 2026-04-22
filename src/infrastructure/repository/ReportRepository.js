import { BaseRepository } from './BaseRepository';

/**
 * ReportRepository: Handles admin review of user reports.
 */
export class ReportRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/reports';
    }

    /**
     * Fetches all reports for admin review.
     * @param {string} status - Optional filter: 'pending', 'resolved', 'dismissed'
     * @returns {Promise<Array>}
     */
    async getAll(status = null, page = 1, pageSize = 10, search = '') {
        let query = `populate[0]=reporter_user.avatar&populate[1]=reported_user.avatar&populate[2]=report_types&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        if (status) {
            query += `&filters[review_status][$eq]=${status}`;
        }
        if (search) {
            query += `&filters[content_type][$containsi]=${encodeURIComponent(search)}`;
        }
        const response = await this.get(`${this.endpoint}?${query}`);
        const dataArray = response?.data || response || [];
        return {
            items: Array.isArray(dataArray) ? dataArray : [],
            meta: response?.meta || { pagination: { total: Array.isArray(dataArray) ? dataArray.length : 0 } }
        };
    }

    /**
     * Updates the review status of a report.
     * @param {string} id
     * @param {string} status - 'pending', 'resolved', 'dismissed'
     */
    async updateStatus(id, status) {
        return await this.put(this.endpoint, id, { review_status: status });
    }

    /**
     * Deletes a report entry.
     * @param {string} id
     */
    async deleteReport(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }
}
