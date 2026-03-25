import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for creating a new Event.
 * Atomic operation including entitlement creation on the backend.
 */
export const useCreateEvent = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const createLogic = useCallback(async (eventData, entitlementData = null) => {
        return await repository.create({ ...eventData, entitlementData });
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(createLogic);

    return {
        createEvent: execute,
        createdEvent: returnedData,
        inProgress,
        error
    };
};
