import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for fetching all events (Admin/CMS view).
 * Supports server-side pagination & search.
 */
export const useFetchAdminEvents = () => {
    const repository = useMemo(() => new EventRepository(), []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchEvents = useCallback(async () => {
        return await repository.getAll(page, pageSize, search);
    }, [repository, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchEvents);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        events: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute
    };
};
