import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '@infrastructure/repository/LessonRepository';

/**
 * useDeleteLesson: Domain Use Case for deleting an existing lesson.
 * Encapsulates the LessonRepository delete logic.
 */
export const useDeleteLesson = () => {
    const repository = new LessonRepository();

    const deleteLogic = useCallback((id) => repository.delete(id), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(deleteLogic);

    return {
        deleteLesson: execute,
        inProgress,
        error
    };
};
