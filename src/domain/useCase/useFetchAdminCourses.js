import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Domain UseCase to retrieve the list of all courses for CMS representation.
 */
export const useFetchAdminCourses = () => {
    const userId = useSelector((state) => state.auth?.user?.id);
    const repository = useMemo(() => new CourseRepository(), []);
    
    // Pass userId up to the filter
    const { execute, returnedData: courses, inProgress: isLoading, error } = useAsyncUseCase(
        () => repository.getAll(userId)
    );

    useEffect(() => {
        if (userId) {
            execute();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return {
        courses: courses || [],
        isLoading,
        error
    };
};
