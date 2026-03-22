import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '../../infrastructure/repository/LessonRepository';
import { useCallback, useMemo } from 'react';

/**
 * UseCase hook for creating a lesson.
 */
export const useCreateLesson = () => {
    const repository = useMemo(() => new LessonRepository(), []);

    const createLogic = useCallback((data) => repository.create(data), [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(createLogic);

    return {
        createLesson: execute,
        lesson: returnedData,
        inProgress,
        error
    };
};
