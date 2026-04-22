import { BaseRepository } from './BaseRepository';
import { repositoryRegistry } from './RepositoryRegistry';
import { CategorizationResponse } from '../DTO/Response/CategorizationResponse';

export class CategorizationRepository extends BaseRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
    }

    async getCourseTypes(page = 1, pageSize = 10, search = '') {
        const endpoint = import.meta.env.VITE_API_COURSE_TYPES;
        const filters = search ? `&filters[title][$containsi]=${encodeURIComponent(search)}` : '';
        const response = await this.apiClient.get(`${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc${filters}`);
        const data = response?.data || [];
        return {
            items: CategorizationResponse.fromArray(data),
            meta: response?.meta || { pagination: { total: data.length } }
        };
    }

    async getProblemTypes(page = 1, pageSize = 10, search = '') {
        const endpoint = import.meta.env.VITE_API_PROBLEM_TYPES;
        const filters = search ? `&filters[title][$containsi]=${encodeURIComponent(search)}` : '';
        const response = await this.apiClient.get(`${endpoint}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc${filters}`);
        const data = response?.data || [];
        return {
            items: CategorizationResponse.fromArray(data),
            meta: response?.meta || { pagination: { total: data.length } }
        };
    }

    async deleteCourseType(id) {
        const endpoint = `${import.meta.env.VITE_API_COURSE_TYPES}/${id}`;
        return await this.delete(endpoint);
    }

    async deleteProblemType(id) {
        const endpoint = `${import.meta.env.VITE_API_PROBLEM_TYPES}/${id}`;
        return await this.delete(endpoint);
    }
}
