import { useAsyncUseCase } from './useAsyncUseCase';
import { ArticleRepository } from '../../infrastructure/repository/ArticleRepository';
import { useMemo } from 'react';

/**
 * UseCase for deleting an article.
 */
export const useDeleteArticle = () => {
    const repository = useMemo(() => new ArticleRepository(), []);

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        (id) => repository.delete(id)
    );

    return {
        deleteArticle: execute,
        inProgress,
        error,
        success: !!returnedData
    };
};
