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
    async getAll(userId = null) {
        let endpoint = `${this.endpoint}?populate=*`;
        if (userId) {
            endpoint += `&filters[users_permissions_user][id][$eq]=${userId}`;
        }
        const response = await this.apiClient.get(endpoint);
        
        // Strapi v4/v5 data extraction
        const dataArray = response?.data || response || [];
        if (!Array.isArray(dataArray)) return [];

        // Enforce strict Domain Mapping to prevent React DevTools prototype crashes
        return dataArray.map(item => {
            const dto = new CourseDTO(item);
            return EntityMapper.toCardCourse(dto);
        });
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
}
