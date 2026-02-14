import { useAsyncUseCase } from './useAsyncUseCase';
import { RoadmapRepository } from '../../infrastructure/repository/RoadmapRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a roadmap.
 */
export const useCreateRoadmap = () => {
    const repository = useMemo(() => new RoadmapRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createRoadmap: execute,
        roadmap: returnedData,
        inProgress,
        error
    };
};
