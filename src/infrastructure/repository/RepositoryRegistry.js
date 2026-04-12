import { BaseRepository } from './BaseRepository';
import { SharedInteractionRepository } from './SharedInteractionRepository';
import { ReportTypeRepository } from './ReportTypeRepository';

/**
 * Simple dependency registry to manage IApiClient implementations.
 */
class RepositoryRegistry {
    constructor() {
        this._apiClient = new BaseRepository();
        this._sharedInteractionRepository = new SharedInteractionRepository(this._apiClient);
        this._reportTypeRepository = new ReportTypeRepository();
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

    get reportTypeRepository() {
        return this._reportTypeRepository;
    }
}

export const repositoryRegistry = new RepositoryRegistry();


