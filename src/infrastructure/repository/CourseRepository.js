import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { CourseRequest } from '../DTO/Request/CourseRequest';
import { repositoryRegistry } from './RepositoryRegistry';
import { CourseDTO } from '../DTO/CourseDTO';
import { EntityMapper } from '../../domain/mapper/EntityMapper';
import { flattenStrapi } from '../../core/utils/strapiFlatten';

/**
 * CourseRepository implementing IContentInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class CourseRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_COURSE_BASE;
    }

    async create(data) {
        const request = new CourseRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new CourseRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    // Domain interface methods
    async like(contentId, contentType) { }
    async comment(contentId, contentType, commentData) { }
    async trackEngagement(contentId) { }

    /**
     * Fetches all courses for the CMS view.
     */
    async getAll(userId = null, page = 1, pageSize = 10, search = '') {
        const filters = [];
        if (userId) {
            filters.push(`filters[users_permissions_user][id][$eq]=${userId}`);
        }
        if (search) {
            filters.push(`filters[title][$containsi]=${encodeURIComponent(search)}`);
        }
        
        const filterStr = filters.length > 0 ? `&${filters.join('&')}` : '';
        const endpoint = `${this.endpoint}?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}${filterStr}&sort=createdAt:desc`;
        
        try {
            const response = await this.apiClient.get(endpoint);
            
            const dataArray = response?.data || response || [];
            
            if (!Array.isArray(dataArray)) {
                return { items: [], meta: { pagination: { total: 0 } } };
            }

            const items = dataArray.map(item => {
                const dto = new CourseDTO(item);
                return EntityMapper.toCardCourse(dto);
            });
            
            return { items, meta: response?.meta || { pagination: { total: items.length } } };
        } catch (error) {
            console.error('[CourseRepository] getAll failed:', error);
            return { items: [], meta: { pagination: { total: 0 } } };
        }
    }

    /**
     * Fetches a single course preview by documentId.
     * @param {string} documentId
     * @returns {Promise<object>} Raw course data from API.
     */
    async getPreview(documentId) {
        const previewEndpoint = import.meta.env.VITE_API_COURSE_BASE;
        const response = await this.apiClient.get(`${previewEndpoint}/${documentId}`);
        // Ensure data is flattened for DTO mapping
        return flattenStrapi(response);
    }

    /**
     * Fetches multiple courses by their documentIds.
     * @param {string[]} ids 
     * @returns {Promise<CourseDTO[]>}
     */
    async getByIds(ids) {
        if (!ids || ids.length === 0) return [];

        const filters = ids.map((id, index) => `filters[documentId][$in][${index}]=${id}`).join('&');
        const endpoint = `${this.endpoint}?${filters}&populate=*`;
        
        const response = await this.apiClient.get(endpoint);
        const dataArray = flattenStrapi(response) || [];
        if (!Array.isArray(dataArray)) return [];

        return dataArray.map(item => {
            const dto = new CourseDTO(item);
            return EntityMapper.toCardCourse(dto);
        });
    }

    /**
     * Lists courses authored by a specific user with pagination support.
     * @param {string} username 
     * @param {number} start - Offset start
     * @param {number} limit - Items per page
     * @returns {Promise<{items: Array, total: number}>}
     */
    async listByAuthor(username, start = 0, limit = 10) {
        const query = `filters[users_permissions_user][username][$eq]=${username}&populate=*&sort=createdAt:desc&pagination[start]=${start}&pagination[limit]=${limit}`;
        const response = await this.apiClient.get(`${this.endpoint}?${query}`);
        
        const dataArray = response?.data || response || [];
        const items = Array.isArray(dataArray) ? dataArray.map(item => {
            const dto = new CourseDTO(item);
            return EntityMapper.toCardCourse(dto);
        }) : [];

        return {
            items,
            total: response?.meta?.pagination?.total || 0
        };
    }

    /**
     * Generically searches for courses by title (partial match).
     * @param {string} query
     * @returns {Promise<Array>}
     */
    /**
     * Deletes a course by its documentId.
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    async search(query) {
        if (!query) return [];
        try {
            const qsQuery = `filters[title][$containsi]=${query}&populate=*&pagination[limit]=10`;
            const response = await this.apiClient.get(`${this.endpoint}?${qsQuery}`);
            const dataArray = flattenStrapi(response) || [];
            if (!Array.isArray(dataArray)) return [];
            return dataArray.map(item => {
                const dto = new CourseDTO(item);
                return EntityMapper.toCardCourse(dto);
            });
        } catch (error) {
            console.error('[CourseRepository] Search failed:', error);
            throw error;
        }
    }
}
