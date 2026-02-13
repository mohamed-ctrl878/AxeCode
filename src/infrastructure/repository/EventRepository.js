import { BaseRepository } from './BaseRepository';
import { EventRequest } from '../DTO/Request/EventRequest';

/**
 * Repository for Event entities.
 */
export class EventRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_EVENTS;
    }

    /**
     * Creates a new event.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new EventRequest(rawData);
        return await this.upload(url, request);
    }
}
