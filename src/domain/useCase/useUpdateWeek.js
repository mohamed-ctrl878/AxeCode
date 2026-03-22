import { useAsyncUseCase } from './useAsyncUseCase';
import { WeekRepository } from '../../infrastructure/repository/WeekRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for updating a Week's metadata.
 */
export const useUpdateWeek = () => {
    const repository = useMemo(() => new WeekRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        async ({ id, data }) => await repository.update(id, data)
    );

    return {
        updateWeek: execute,
        updatedWeek: returnedData,
        inProgress,
        error
    };
};
