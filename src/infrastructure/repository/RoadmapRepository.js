import { BaseRepository } from './BaseRepository';
import { RoadmapRequest } from '../DTO/Request/RoadmapRequest';

/**
 * Repository for Roadmap entities.
 */
export class RoadmapRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_ROADMAP;
    }

    /**
     * Creates a new roadmap.
     * @param {object} rawData 
     * @returns {Promise<object>}
     */
    async create(rawData) {
        const url = this.buildUrl(this.endpoint);
        const request = new RoadmapRequest(rawData);
        return await this.upload(url, request);
    }
}
