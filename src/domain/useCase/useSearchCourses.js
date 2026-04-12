import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo, useCallback } from 'react';

/**
 * useSearchCourses: UseCase hook for global course search by title query.
 */
export const useSearchCourses = () => {
    const repository = useMemo(() => new CourseRepository(), []);

    const searchLogic = useCallback(async (query) => {
        if (!query || query.trim().length < 2) return [];
        // CourseRepository.search already flattens and maps to CardCourseEntity
        return await repository.search(query);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(searchLogic);

    return {
        searchCourses: execute,
        courses: returnedData || [],
        loading: inProgress,
        error
    };
};
