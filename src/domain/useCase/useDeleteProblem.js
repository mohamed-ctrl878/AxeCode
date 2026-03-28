import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for deleting an algorithmic problem.
 */
export const useDeleteProblem = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const deleteLogic = useCallback(async (id) => {
        return await repository.delete(id);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(deleteLogic);

    return {
        deleteProblem: execute,
        success: returnedData,
        inProgress,
        error
    };
};
