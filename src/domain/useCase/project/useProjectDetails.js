import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useProjectDetails = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    const fetchLogic = useCallback(async () => {
        if (!projectId) return null;
        const result = await repository.getById(projectId);
        return EntityMapper.toProject(result);
    }, [repository, projectId]);

    const { execute: fetchDetails, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchDetails,
        project: returnedData,
        loading: inProgress,
        error
    };
};
