import { BaseRepository } from './BaseRepository';
import { SharedInteractionRepository } from './SharedInteractionRepository';
import { ReportTypeRepository } from './ReportTypeRepository';
import { ProjectRepository } from './ProjectRepository';
import { TaskRepository } from './TaskRepository';
import { CheckpointRepository } from './CheckpointRepository';
import { WorkspaceRepository } from './WorkspaceRepository';
import { ReviewRequestRepository } from './ReviewRequestRepository';

/**
 * Simple dependency registry to manage IApiClient implementations.
 */
class RepositoryRegistry {
    constructor() {
        this._apiClient = new BaseRepository();
        this._sharedInteractionRepository = new SharedInteractionRepository(this._apiClient);
        this._reportTypeRepository = new ReportTypeRepository();
        this._projectRepository = new ProjectRepository(this._apiClient);
        this._taskRepository = new TaskRepository(this._apiClient);
        this._checkpointRepository = new CheckpointRepository(this._apiClient);
        this._workspaceRepository = new WorkspaceRepository(this._apiClient);
        this._reviewRequestRepository = new ReviewRequestRepository(this._apiClient);
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

    get projectRepository() {
        return this._projectRepository;
    }

    get taskRepository() {
        return this._taskRepository;
    }

    get checkpointRepository() {
        return this._checkpointRepository;
    }

    get workspaceRepository() {
        return this._workspaceRepository;
    }

    get reviewRequestRepository() {
        return this._reviewRequestRepository;
    }
}

export const repositoryRegistry = new RepositoryRegistry();



