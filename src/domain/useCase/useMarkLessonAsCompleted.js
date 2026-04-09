import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '@infrastructure/repository/LessonRepository';

/**
 * useMarkLessonAsCompleted: Domain use case for marking a lesson as completed.
 * Calls LessonRepository.trackEngagement with the proper parameters.
 */
export const useMarkLessonAsCompleted = () => {
    const repository = new LessonRepository();

    const markLogic = useCallback(async ({ lessonId, courseId, status = 'completed' }) => {
        if (!lessonId || !courseId) {
            throw new Error('Lesson ID and Course ID are required to mark completion.');
        }

        return await repository.trackEngagement(lessonId, courseId, status);
    }, []);

    const { execute, inProgress, error } = useAsyncUseCase(markLogic);

    return {
        markAsCompleted: execute,
        marking: inProgress,
        markError: error
    };
};
