import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo, useEffect, useCallback } from 'react';

/**
 * UseCase hook for fetching all events (Admin/CMS view).
 */
export const useFetchAdminEvents = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const fetchEvents = useCallback(async () => {
        const response = await repository.apiClient.get(repository.endpointBase);
        return response.data || [];
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchEvents);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        events: returnedData || [],
        isLoading: inProgress,
        error,
        fetch: fetchEvents
    };
};
