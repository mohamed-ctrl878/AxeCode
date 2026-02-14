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
    }

    async create(data) {
        const request = new EventRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new EventRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }

    async registerForEvent(eventId) {}
}
