import { useAsyncUseCase } from './useAsyncUseCase';
import { WeekRepository } from '../../infrastructure/repository/WeekRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating a Week within a Course schedule.
 */
export const useCreateWeek = () => {
    const repository = useMemo(() => new WeekRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        async (data) => await repository.create(data)
    );

    return {
        createWeek: execute,
        createdWeek: returnedData,
        inProgress,
        error
    };
};
