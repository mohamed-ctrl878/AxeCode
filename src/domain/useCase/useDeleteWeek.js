import { useAsyncUseCase } from './useAsyncUseCase';
import { WeekRepository } from '../../infrastructure/repository/WeekRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for deleting a Week from a Course schedule.
 */
export const useDeleteWeek = () => {
    const repository = useMemo(() => new WeekRepository(), []);

    const { execute, inProgress, error } = useAsyncUseCase(
        async (id) => await repository.delete(id)
    );

    return {
        deleteWeek: execute,
        inProgress,
        error
    };
};
