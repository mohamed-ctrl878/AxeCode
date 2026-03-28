import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for updating an algorithmic problem.
 */
export const useUpdateProblem = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const updateLogic = useCallback(async ({ id, data }) => {
        return await repository.update(id, data);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(updateLogic);

    return {
        updateProblem: execute,
        problem: returnedData,
        inProgress,
        error
    };
};
