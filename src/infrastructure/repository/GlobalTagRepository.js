import { BaseRepository } from './BaseRepository';

/**
 * GlobalTagRepository: Handles admin management of global tags.
 */
export class GlobalTagRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = '/api/global-tags';
    }

    /**
     * Fetches all global tags.
     * @returns {Promise<Array>}
     */
    async getAll(page = 1, pageSize = 10, search = '') {
        const filters = search ? `&filters[name][$containsi]=${encodeURIComponent(search)}` : '';
        const response = await this.get(`${this.endpoint}?sort=count:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}${filters}`);
        const dataArray = response?.data || response || [];
        return {
            items: Array.isArray(dataArray) ? dataArray : [],
            meta: response?.meta || { pagination: { total: Array.isArray(dataArray) ? dataArray.length : 0 } }
        };
    }

    /**
     * Deletes a global tag.
     * @param {string} id
     */
    async deleteTag(id) {
        return await this.delete(`${this.endpoint}/${id}`);
    }
}
