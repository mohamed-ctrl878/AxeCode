import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo, useEffect, useCallback } from 'react';
import { EntityMapper } from '../mapper/EntityMapper';

/**
 * Hook for managing Users in Admin CMS.
 */
export const useFetchAdminUsers = () => {
    const repository = useMemo(() => new UserRepository(), []);

    const fetchUsers = useCallback(async () => {
        const rawUsers = await repository.getAllUsers();
        return rawUsers.map(user => EntityMapper.toUser(user));
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchUsers);

    useEffect(() => {
        execute();
    }, [execute]);

    const deleteUser = useCallback(async (id) => {
        await repository.deleteUser(id);
        await execute(); // Refresh list
    }, [repository, execute]);

    return {
        users: returnedData || [],
        isLoading: inProgress,
        error,
        reloadUsers: execute,
        deleteUser
    };
};
