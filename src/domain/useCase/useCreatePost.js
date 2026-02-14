import { useAsyncUseCase } from './useAsyncUseCase';
import { PostRepository } from '../../infrastructure/repository/PostRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a post.
 */
export const useCreatePost = () => {
    const repository = useMemo(() => new PostRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createPost: execute,
        post: returnedData,
        inProgress,
        error
    };
};
