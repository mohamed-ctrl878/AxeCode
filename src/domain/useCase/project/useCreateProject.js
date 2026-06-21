import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useCreateProject = () => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    const createLogic = useCallback(async (projectData) => {
        const dto = await repository.create(projectData);
        return EntityMapper.toProject(dto);
    }, [repository]);

    const { execute: createProject, inProgress, error } = useAsyncUseCase(createLogic);

    return {
        createProject,
        creating: inProgress,
        error
    };
};
