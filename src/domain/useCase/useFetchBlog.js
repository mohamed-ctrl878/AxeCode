import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { BlogRepository } from '@infrastructure/repository/BlogRepository';
import { BlogDTO } from '@infrastructure/DTO/BlogDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single blog post by ID.
 * Pipeline: API -> BlogDTO -> EntityMapper.toBlog -> BlogEntity
 * 
 * @returns {{ fetchBlog: Function, blog: import('../../entity/BlogEntity').BlogEntity|null, loading: boolean, error: string|null }}
 */
export const useFetchBlog = () => {
    const repository = new BlogRepository();

    const fetchLogic = useCallback(async (id) => {
        if (!id) throw new Error("Blog ID is required");

        const rawData = await repository.getById(id);

        // Ensure data exists
        if (!rawData) {
            throw new Error("Blog not found");
        }

        // 1. Convert raw API response to structured DTO
        const dto = new BlogDTO(rawData);

        // 2. Map DTO to pure Domain Entity (BlogEntity)
        const entity = EntityMapper.toBlog(dto);

        return entity;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchBlog: execute,
        blog: returnedData,
        loading: inProgress,
        error
    };
};
