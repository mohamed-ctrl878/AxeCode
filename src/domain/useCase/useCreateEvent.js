import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo } from 'react';

/**
 * UseCase hook for creating an event.
 */
export const useCreateEvent = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (data) => repository.create(data)
    );

    return {
        createEvent: execute,
        event: returnedData,
        inProgress,
        error
    };
};
