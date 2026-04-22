import { useAsyncUseCase } from './useAsyncUseCase';
import { BlogRepository } from '../../infrastructure/repository/BlogRepository';
import { useMemo } from 'react';

/**
 * UseCase for deleting a blog post.
 */
export const useDeleteBlog = () => {
    const repository = useMemo(() => new BlogRepository(), []);

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        (id) => repository.delete(id)
    );

    return {
        deleteBlog: execute,
        inProgress,
        error,
        success: !!returnedData
    };
};
