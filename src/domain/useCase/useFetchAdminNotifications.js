import { useAsyncUseCase } from './useAsyncUseCase';
import { AdminNotificationRepository } from '../../infrastructure/repository/AdminNotificationRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for fetching admin notifications (CMS governance view).
 */
export const useFetchAdminNotifications = () => {
    const repository = useMemo(() => new AdminNotificationRepository(), []);
    const [statusFilter, setStatusFilter] = useState(null);

    const fetchNotifications = useCallback(async () => {
        return await repository.getAll(statusFilter);
    }, [repository, statusFilter]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchNotifications);

    useEffect(() => {
        execute();
    }, [execute]);

    const markRead = useCallback(async (id) => {
        await repository.markRead(id);
        await execute();
    }, [repository, execute]);

    const updateStatus = useCallback(async (id, status) => {
        await repository.updateStatus(id, status);
        await execute();
    }, [repository, execute]);

    return {
        notifications: returnedData || [],
        isLoading: inProgress,
        error,
        fetch: execute,
        markRead,
        updateStatus,
        statusFilter,
        setStatusFilter
    };
};
