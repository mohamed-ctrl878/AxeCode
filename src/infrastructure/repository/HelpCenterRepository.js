import { BaseRepository } from './BaseRepository';

/**
 * HelpCenterRepository: Handles Help Center content management.
 */
export class HelpCenterRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/help-centers';
    }

    async getAll(page = 1, pageSize = 10, search = '') {
        const filters = search ? `&filters[title][$containsi]=${encodeURIComponent(search)}` : '';
        const response = await this.get(`${this.endpoint}?sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${filters}`);
        const dataArray = response?.data || response || [];
        return {
            items: Array.isArray(dataArray) ? dataArray : [],
            meta: response?.meta || { pagination: { total: Array.isArray(dataArray) ? dataArray.length : 0 } }
        };
    }

    async create(data) {
        return await this.post(this.endpoint, { data });
    }

    async update(id, data) {
        return await this.put(this.endpoint, id, { data });
    }

    async deleteHelpCenter(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }
}
