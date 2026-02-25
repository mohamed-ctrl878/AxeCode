import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { ArticleDTO } from '@infrastructure/DTO/ArticleDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching recommended articles.
 * Pipeline: API → ArticleDTO → EntityMapper.toArticle → ArticleEntity[]
 * @returns {{ fetchArticles: Function, articles: ArticleEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchArticles = () => {
    const repository = new RecommendationRepository();

    const fetchLogic = useCallback(async (limit = 20) => {
        const rawData = await repository.getArticles(limit);
        const items = Array.isArray(rawData) ? rawData : [];
        return items
            .map(item => new ArticleDTO(item))
            .map(dto => EntityMapper.toArticle(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchArticles: execute,
        articles: returnedData,
        loading: inProgress,
        error
    };
};
