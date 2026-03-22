import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '@infrastructure/repository/LessonRepository';

/**
 * useUpdateLesson: Domain Use Case for updating an existing lesson.
 * Encapsulates the LessonRepository update logic.
 */
export const useUpdateLesson = () => {
    const repository = new LessonRepository();

    const updateLogic = useCallback(({ id, data }) => repository.update(id, data), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(updateLogic);

    return {
        updateLesson: execute,
        updatedLesson: returnedData,
        inProgress,
        error
    };
};
