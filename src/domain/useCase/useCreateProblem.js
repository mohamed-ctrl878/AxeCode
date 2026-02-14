import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '../../infrastructure/repository/ProblemRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a problem.
 */
export const useCreateProblem = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createProblem: execute,
        problem: returnedData,
        inProgress,
        error
    };
};
