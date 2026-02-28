import { BaseRepository } from './BaseRepository';
import { SharedInteractionRepository } from './SharedInteractionRepository';

/**
 * Simple dependency registry to manage IApiClient implementations.
 */
class RepositoryRegistry {
    constructor() {
        this._apiClient = new BaseRepository();
        this._sharedInteractionRepository = new SharedInteractionRepository(this._apiClient);
    }

    get apiClient() {   
        return this._apiClient;
    }

    /**
     * Allows swapping the implementation (e.g., for testing).
     */
    set apiClient(client) {
        this._apiClient = client;
    }

    get sharedInteractionRepository() {
        return this._sharedInteractionRepository;
    }
}

export const repositoryRegistry = new RepositoryRegistry();


