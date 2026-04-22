import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { RoadmapRepository } from '@infrastructure/repository/RoadmapRepository';
import { RoadmapDTO } from '@infrastructure/DTO/RoadmapDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching all roadmaps.
 * Pipeline: API → RoadmapDTO → EntityMapper.toRoadmap → RoadmapEntity[]
 * @returns {{ fetchRoadmaps: Function, roadmaps: RoadmapEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchRoadmaps = () => {
    const repository = new RoadmapRepository();

    const fetchLogic = useCallback(async () => {
        const result = await repository.getAll(1, 100); // Fetch all for public view
        const items = Array.isArray(result?.items) ? result.items : [];
        return items
            .map(item => new RoadmapDTO(item))
            .map(dto => EntityMapper.toRoadmap(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchRoadmaps: execute,
        roadmaps: returnedData,
        loading: inProgress,
        error
    };
};
