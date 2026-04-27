import { useAsyncUseCase } from './useAsyncUseCase';
import { CategorizationRepository } from '../../infrastructure/repository/CategorizationRepository';
import { useMemo, useCallback } from 'react';

/**
 * Use case hook for creating categorization tracks (Course or Problem types).
 */
export const useCreateCategorization = () => {
    const repository = useMemo(() => new CategorizationRepository(), []);

    const createCourseTypeLogic = useCallback(async (data) => {
        return await repository.createCourseType(data);
    }, [repository]);

    const createProblemTypeLogic = useCallback(async (data) => {
        return await repository.createProblemType(data);
    }, [repository]);

    const { execute: createCourseType, inProgress: isCreatingCourse, error: courseError } = useAsyncUseCase(createCourseTypeLogic);
    const { execute: createProblemType, inProgress: isCreatingProblem, error: problemError } = useAsyncUseCase(createProblemTypeLogic);

    return {
        createCourseType,
        createProblemType,
        inProgress: isCreatingCourse || isCreatingProblem,
        error: courseError || problemError
    };
};
