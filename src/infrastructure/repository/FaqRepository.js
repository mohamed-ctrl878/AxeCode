import { BaseRepository } from './BaseRepository';

/**
 * FaqRepository: Handles FAQ management.
 */
export class FaqRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/faqs';
    }

    async getAll(page = 1, pageSize = 10, search = '') {
        const filters = search ? `&filters[question][$containsi]=${encodeURIComponent(search)}` : '';
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

    async deleteFaq(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }
}
