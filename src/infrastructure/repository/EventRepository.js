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
        return await this.apiClient.post(this.endpointBase, request);
    }

    async getById(id) {
        return await this.apiClient.get(`${this.endpointBase}/${id}?populate=*`);
    }

    async update(id, data) {
        const request = new EventRequest(data);
        return await this.apiClient.put(this.endpointBase, id, request);
    }

    async registerForEvent(eventId) { }
}
