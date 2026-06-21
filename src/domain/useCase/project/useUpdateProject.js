import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useUpdateProject = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    const updateLogic = useCallback(async (data) => {
        if (!projectId) throw new Error("Project ID is required to update.");
        const result = await repository.update(projectId, data);
        return EntityMapper.toProject(result);
    }, [repository, projectId]);

    const { execute: updateProject, inProgress: isUpdating, error } = useAsyncUseCase(updateLogic);

    return {
        updateProject,
        isUpdating,
        error
    };
};
