import { useAsyncUseCase } from './useAsyncUseCase';
import { ArticleRepository } from '../../infrastructure/repository/ArticleRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating an article.
 */
export const useCreateArticle = () => {
    const repository = useMemo(() => new ArticleRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createArticle: execute,
        article: returnedData,
        inProgress,
        error
    };
};
