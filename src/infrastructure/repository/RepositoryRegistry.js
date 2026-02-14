import { BaseRepository } from './BaseRepository';

/**
 * Simple dependency registry to manage IApiClient implementations.
 */
class RepositoryRegistry {
    constructor() {
        this._apiClient = new BaseRepository();
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
}

export const repositoryRegistry = new RepositoryRegistry();


