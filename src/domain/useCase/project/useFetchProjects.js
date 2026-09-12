import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useFetchProjects = () => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    const fetchLogic = useCallback(async () => {
        const result = await repository.getAll();
        const items = Array.isArray(result) ? result : [];
        return items
            .map(dto => EntityMapper.toProject(dto))
            .filter(Boolean);
    }, [repository]);

    const { execute: fetchProjects, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchProjects,
        projects: returnedData,
        loading: inProgress,
        error
    };
};
