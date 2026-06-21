import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useCheckpoints = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.checkpointRepository, []);

    // Fetch Checkpoints
    const fetchLogic = useCallback(async (params = {}) => {
        if (!projectId) return [];
        const result = await repository.getCheckpoints(projectId, params);
        return result.map(dto => EntityMapper.toCheckpoint(dto)).filter(Boolean);
    }, [repository, projectId]);

    const { execute: fetchCheckpoints, returnedData: checkpoints, inProgress: loadingCheckpoints, error: checkpointsError } = useAsyncUseCase(fetchLogic);

    // Create Checkpoint
    const createLogic = useCallback(async (checkpointData) => {
        const result = await repository.createCheckpoint(projectId, checkpointData);
        return EntityMapper.toCheckpoint(result);
    }, [repository, projectId]);

    const { execute: createCheckpoint, inProgress: isCreating } = useAsyncUseCase(createLogic);

    // Update Checkpoint
    const updateLogic = useCallback(async (checkpointId, checkpointData) => {
        const result = await repository.updateCheckpoint(projectId, checkpointId, checkpointData);
        return EntityMapper.toCheckpoint(result);
    }, [repository, projectId]);

    const { execute: updateCheckpoint, inProgress: isUpdating } = useAsyncUseCase(updateLogic);

    // Delete Checkpoint
    const deleteLogic = useCallback(async (checkpointId) => {
        return await repository.deleteCheckpoint(projectId, checkpointId);
    }, [repository, projectId]);

    const { execute: deleteCheckpoint, inProgress: isDeleting } = useAsyncUseCase(deleteLogic);

    return {
        fetchCheckpoints,
        checkpoints,
        loadingCheckpoints,
        checkpointsError,
        createCheckpoint,
        isCreating,
        updateCheckpoint,
        isUpdating,
        deleteCheckpoint,
        isDeleting
    };
};
