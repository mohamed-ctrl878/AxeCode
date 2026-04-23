import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo } from 'react';

/**
 * UseCase for deleting a course.
 */
export const useDeleteCourse = () => {
    const repository = useMemo(() => new CourseRepository(), []);

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        (id) => repository.delete(id)
    );

    return {
        deleteCourse: execute,
        inProgress,
        error,
        success: !!returnedData
    };
};
