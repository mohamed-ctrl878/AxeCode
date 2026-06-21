import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useSprints = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.taskRepository, []);

    const fetchLogic = useCallback(async () => {
        if (!projectId) return [];
        const result = await repository.getSprints(projectId);
        return result.map(dto => EntityMapper.toSprint(dto));
    }, [repository, projectId]);

    const { execute: fetchSprints, returnedData: sprints, inProgress: loadingSprints } = useAsyncUseCase(fetchLogic);

    const startLogic = useCallback(async (sprintId) => {
        const result = await repository.startSprint(projectId, sprintId);
        return EntityMapper.toSprint(result);
    }, [repository, projectId]);

    const { execute: startSprint, inProgress: isStarting } = useAsyncUseCase(startLogic);

    const updateLogic = useCallback(async (sprintId, data) => {
        const result = await repository.updateSprint(projectId, sprintId, data);
        return EntityMapper.toSprint(result);
    }, [repository, projectId]);

    const { execute: updateSprint, inProgress: isUpdating } = useAsyncUseCase(updateLogic);

    const createLogic = useCallback(async (sprintData) => {
        const result = await repository.createSprint(projectId, sprintData);
        return EntityMapper.toSprint(result);
    }, [repository, projectId]);

    const { execute: createSprint, inProgress: isCreating } = useAsyncUseCase(createLogic);

    return {
        fetchSprints,
        sprints,
        loadingSprints,
        startSprint,
        isStarting,
        updateSprint,
        isUpdating,
        createSprint,
        isCreating
    };
};

