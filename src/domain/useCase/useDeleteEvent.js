import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo } from 'react';

/**
 * UseCase for deleting an event.
 */
export const useDeleteEvent = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        (id) => repository.delete(id)
    );

    return {
        deleteEvent: execute,
        inProgress,
        error,
        success: !!returnedData
    };
};
