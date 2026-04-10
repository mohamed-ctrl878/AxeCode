import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for fetching multiple courses by their document IDs.
 */
export const useFetchCoursesByIds = () => {
    const repository = useMemo(() => new CourseRepository(), []);

    const fetchLogic = useCallback(async (ids) => {
        return await repository.getByIds(ids);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchCoursesByIds: execute,
        courses: returnedData || [],
        loading: inProgress,
        error
    };
};
