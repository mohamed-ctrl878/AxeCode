import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a course.
 */
export const useCreateCourse = () => {
    const repository = useMemo(() => new CourseRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createCourse: execute,
        course: returnedData,
        inProgress,
        error
    };
};
