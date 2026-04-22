import { useAsyncUseCase } from './useAsyncUseCase';
import { ReportRepository } from '../../infrastructure/repository/ReportRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for fetching and managing reports (Admin/CMS view).
 * Supports server-side pagination & search.
 */
export const useFetchAdminReports = () => {
    const repository = useMemo(() => new ReportRepository(), []);
    const [statusFilter, setStatusFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchReports = useCallback(async () => {
        return await repository.getAll(statusFilter, page, pageSize, search);
    }, [repository, statusFilter, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchReports);

    useEffect(() => {
        execute();
    }, [execute]);

    const updateStatus = useCallback(async (id, status) => {
        await repository.updateStatus(id, status);
        await execute(); // Refresh list
    }, [repository, execute]);

    const deleteReport = useCallback(async (id) => {
        await repository.deleteReport(id);
        await execute(); // Refresh list
    }, [repository, execute]);

    return {
        reports: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute,
        updateStatus,
        deleteReport,
        statusFilter,
        setStatusFilter
    };
};
