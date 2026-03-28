import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { useMemo, useEffect, useCallback } from 'react';

/**
 * UseCase hook for fetching all problems (Admin/CMS view).
 * Automatically executes on mount.
 */
export const useFetchAdminProblems = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const fetchLogic = useCallback(async () => {
        // Fetch all problems for the CMS table
        console.log(repository)
        const data = await repository.getAll();
        return Array.isArray(data) ? data : [];
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        problems: returnedData || [],
        isLoading: inProgress,
        error,
        fetch: execute
    };
};
