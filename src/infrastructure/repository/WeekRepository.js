import { IContentInteraction } from '../../domain/interface/IContentInteraction';
import { WeekRequest } from '../DTO/Request/WeekRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * WeekRepository handling direct REST data layer for Weeks.
 */
export class WeekRepository extends IContentInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_WEEKS;
    }

    async create(data) {
        console.log("WeekRepository create",data);
        const request = new WeekRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        // ID could be numeric ID or DocumentId depending on Strapi Version.
        const request = new WeekRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async delete(id) {
        return await this.apiClient.delete(this.endpoint, id);
    }

    // Required by IContentInteraction but unused for weeks right now
    async like(contentId, contentType) { }
    async comment(contentId, contentType, commentData) { }
    async trackEngagement(contentId) { }
}
