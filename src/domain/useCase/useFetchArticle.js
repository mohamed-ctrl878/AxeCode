import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { ArticleRepository } from '@infrastructure/repository/ArticleRepository';
import { ArticleDTO } from '@infrastructure/DTO/ArticleDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single article by ID.
 * Pipeline: API -> ArticleDTO -> EntityMapper.toArticle -> ArticleEntity
 * 
 * @returns {{ fetchArticle: Function, article: import('../../entity/ArticleEntity').ArticleEntity|null, loading: boolean, error: string|null }}
 */
export const useFetchArticle = () => {
    // Rely on ArticleRepository rather than RecommendationRepository since this is a direct fetch
    const repository = new ArticleRepository();

    const fetchLogic = useCallback(async (id) => {
        if (!id) throw new Error("Article ID is required");

        const rawData = await repository.getById(id);

        // Ensure data exists
        if (!rawData || !rawData.data) {
            throw new Error("Article not found");
        }

        // Strapi returns { data: { id, attributes: { ... } } } or flat object depending on BaseRepository config
        // Let's assume BaseRepository + fetchWrapper normalizes it to the object directly, as seen in getBlogs
        const item = rawData.data || rawData;

        // 1. Convert raw API response to structured DTO
        const dto = new ArticleDTO(item);

        // 2. Map DTO to pure Domain Entity (ArticleEntity)
        const entity = EntityMapper.toArticle(dto);

        return entity;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchArticle: execute,
        article: returnedData,
        loading: inProgress,
        error
    };
};
