import { IRecommendationAccess } from '../../domain/interface/IRecommendationAccess';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * RecommendationRepository implementing IRecommendationAccess.
 * Fetches recommended content from the recommendation API endpoints.
 */
export class RecommendationRepository extends IRecommendationAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.coursesEndpoint = import.meta.env.VITE_API_COURSES;
        this.eventsEndpoint = import.meta.env.VITE_API_EVENTS;
    }

    /**
     * @param {number} [limit=20]
     * @returns {Promise<object[]>} Raw course data from recommendation API.
     */
    async getCourses(limit = 20) {
        const response = await this.apiClient.get(this.coursesEndpoint, { limit });
        return response?.data || response || [];
    }

    /**
     * @param {number} [limit=20]
     * @returns {Promise<object[]>} Raw event data from recommendation API.
     */
    async getEvents(limit = 20) {
        const response = await this.apiClient.get(this.eventsEndpoint, { limit });
        return response?.data || response || [];
    }

    // Base interface methods (not used for recommendations)
    async getAll(params = {}) {
        throw new Error('Use getCourses() or getEvents() instead.');
    }

    async getById(id, params = {}) {
        throw new Error('Use getCourses() or getEvents() instead.');
    }
}
