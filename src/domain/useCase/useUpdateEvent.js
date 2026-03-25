import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo } from 'react';

/**
 * UseCase for updating an existing event.
 */
export const useUpdateEvent = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        (id, data) => repository.update(id, data)
    );

    return {
        updateEvent: execute,
        inProgress,
        error,
        success: !!returnedData
    };
};
