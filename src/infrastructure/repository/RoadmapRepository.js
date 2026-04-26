import { IRoadmapInteraction } from '../../domain/interface/IRoadmapInteraction';
import { RoadmapRequest } from '../DTO/Request/RoadmapRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * RoadmapRepository implementing IRoadmapInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class RoadmapRepository extends IRoadmapInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_ROADMAP;
    }

    async create(data) {
        const request = new RoadmapRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new RoadmapRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async delete(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Fetches all roadmaps.
     * @param {object} [params] - Optional query params (filters, pagination, etc.)
     * @returns {Promise<object[]>} Raw roadmap data array.
     */
    async getAll(page = 1, pageSize = 10, search = '') {
        const filters = search ? `&filters[title][$containsi]=${encodeURIComponent(search)}` : '';
        const response = await this.apiClient.get(`${this.endpoint}?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc${filters}`);
        const dataArray = response?.data || response || [];
        return {
            items: Array.isArray(dataArray) ? dataArray : [],
            meta: response?.meta || { pagination: { total: Array.isArray(dataArray) ? dataArray.length : 0 } }
        };
    }
}
