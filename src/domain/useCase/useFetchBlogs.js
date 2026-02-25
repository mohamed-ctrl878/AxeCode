import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { BlogDTO } from '@infrastructure/DTO/BlogDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching recommended blogs for the feed.
 * Pipeline: API → BlogDTO → EntityMapper.toBlog → BlogEntity[]
 * @returns {{ fetchBlogs: Function, blogs: BlogEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchBlogs = () => {
    const repository = new RecommendationRepository();

    const fetchLogic = useCallback(async (limit = 20) => {
        const rawData = await repository.getBlogs(limit);
        const items = Array.isArray(rawData) ? rawData : [];
        return items
            .map(item => new BlogDTO(item))
            .map(dto => EntityMapper.toBlog(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchBlogs: execute,
        blogs: returnedData,
        loading: inProgress,
        error
    };
};
