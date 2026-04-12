import { IEventInteraction } from '../../domain/interface/IEventInteraction';
import { EventRequest } from '../DTO/Request/EventRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * EventRepository implementing IEventInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class EventRepository extends IEventInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_EVENTS;
        this.endpointBase = import.meta.env.VITE_API_EVENTS_BASE;
    }

    async create(data) {
        const request = new EventRequest(data);
        return await this.apiClient.post(this.endpointBase, request, false);
    }

    async getById(id) {
        console.log(`${this.endpointBase}/${id}?populate=*`)
        return await this.apiClient.get(`${this.endpointBase}/${id}?populate=*`);
    }
    async getAll() {
        return await this.apiClient.get(`${this.endpointBase}?populate=*`);
    }

    async update(id, data) {
        const request = new EventRequest(data);
        return await this.apiClient.put(this.endpointBase, id, request, false);
    }

    async delete(id) {
        return await this.apiClient.delete(this.endpointBase, id);
    }

    async registerForEvent(eventId) { }

    /**
     * Generically searches for events by title (partial match).
     * @param {string} query
     * @returns {Promise<Array>}
     */
    async search(query) {
        if (!query) return [];
        try {
            const params = `filters[title][$containsi]=${query}&populate=*&pagination[limit]=10`;
            const response = await this.apiClient.get(`${this.endpointBase}?${params}`);
            return response?.data || response || [];
        } catch (error) {
            console.error('[EventRepository] Search failed:', error);
            throw error;
        }
    }
}
