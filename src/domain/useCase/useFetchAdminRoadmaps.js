import { useAsyncUseCase } from './useAsyncUseCase';
import { RoadmapRepository } from '@infrastructure/repository/RoadmapRepository';
import { RoadmapDTO } from '@infrastructure/DTO/RoadmapDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for fetching roadmaps in Admin CMS view.
 * Supports server-side pagination & search.
 */
export const useFetchAdminRoadmaps = () => {
    const repository = useMemo(() => new RoadmapRepository(), []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchLogic = useCallback(async () => {
        const result = await repository.getAll(page, pageSize, search);
        const items = (result?.items || [])
            .map(item => new RoadmapDTO(item))
            .map(dto => EntityMapper.toRoadmap(dto))
            .filter(Boolean);
        return {
            items,
            meta: result?.meta || { pagination: { total: items.length } }
        };
    }, [repository, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        roadmaps: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute
    };
};
