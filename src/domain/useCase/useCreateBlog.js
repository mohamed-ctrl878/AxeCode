import { useAsyncUseCase } from './useAsyncUseCase';
import { BlogRepository } from '../../infrastructure/repository/BlogRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a blog.
 */
export const useCreateBlog = () => {
    const repository = useMemo(() => new BlogRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createBlog: execute,
        blog: returnedData,
        inProgress,
        error
    };
};
