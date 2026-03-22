import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for updating a course metadata.
 */
export const useUpdateCourse = () => {
    const repository = useMemo(() => new CourseRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        async ({ id, data }) => await repository.update(id, data)
    );

    return {
        updateCourse: execute,
        course: returnedData,
        inProgress,
        error
    };
};
