import { useAsyncUseCase } from './useAsyncUseCase';
import { PayoutAdminRepository } from '../../infrastructure/repository/PayoutAdminRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for fetching and managing payouts (Admin/CMS view).
 * Supports server-side pagination & search.
 */
export const useFetchAdminPayouts = () => {
    const repository = useMemo(() => new PayoutAdminRepository(), []);
    const [statusFilter, setStatusFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchPayouts = useCallback(async () => {
        return await repository.getAll(statusFilter, page, pageSize, search);
    }, [repository, statusFilter, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchPayouts);

    useEffect(() => {
        execute();
    }, [execute]);

    const updateStatus = useCallback(async (id, status, adminNotes = '') => {
        await repository.updateStatus(id, status, adminNotes);
        await execute(); // Refresh list
    }, [repository, execute]);

    return {
        payouts: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute,
        updateStatus,
        statusFilter,
        setStatusFilter
    };
};
