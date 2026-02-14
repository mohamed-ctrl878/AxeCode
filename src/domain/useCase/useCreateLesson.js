import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '../../infrastructure/repository/LessonRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a lesson.
 */
export const useCreateLesson = () => {
    const repository = useMemo(() => new LessonRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createLesson: execute,
        lesson: returnedData,
        inProgress,
        error
    };
};
