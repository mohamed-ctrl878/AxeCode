import { IRoadmapInteraction } from '../../domain/interface/IRoadmapInteraction';
import { RoadmapRequest } from '../DTO/Request/RoadmapRequest';
import { repositoryRegistry } from './RepositoryRegistry';

/**
 * RoadmapRepository implementing IRoadmapInteraction.
 * Depends on IApiClient (abstracted technical layer).
 */
export class RoadmapRepository extends IRoadmapInteraction {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_ROADMAP;
    }

    async create(data) {
        const request = new RoadmapRequest(data);
        return await this.apiClient.post(this.endpoint, request);
    }

    async update(id, data) {
        const request = new RoadmapRequest(data);
        return await this.apiClient.put(this.endpoint, id, request);
    }
}
