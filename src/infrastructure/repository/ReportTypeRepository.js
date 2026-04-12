import { BaseRepository } from './BaseRepository';

/**
 * ReportTypeRepository
 * Handles administration of Report Reasons (Report Types).
 */
export class ReportTypeRepository extends BaseRepository {
    constructor() {
        super();
    }

    /**
     * Fetches all report reasons.
     * @returns {Promise<any[]>}
     */
    async fetchAll() {
        const response = await this.get('/api/report-types');
        return response?.data || response || [];
    }

    /**
     * Creates a new report reason.
     * @param {ReportTypeRequest} requestDto 
     */
    async create(requestDto) {
        return await this.post('/api/report-types', requestDto);
    }

    /**
     * Updates an existing report reason.
     * @param {string|number} id 
     * @param {ReportTypeRequest} requestDto 
     */
    async update(id, requestDto) {
        return await this.put('/api/report-types', id, requestDto);
    }

    /**
     * Deletes a report reason.
     * @param {string|number} id 
     */
    async deleteType(id) {
        return await this.delete(`/api/report-types/${id}`);
    }
}
