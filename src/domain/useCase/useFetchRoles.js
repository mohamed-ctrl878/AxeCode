import { useAsyncUseCase } from './useAsyncUseCase';
import { RoleRepository } from '../../infrastructure/repository/RoleRepository';
import { useMemo, useEffect, useCallback } from 'react';

/**
 * Hook for managing roles.
 */
export const useFetchRoles = () => {
    const repository = useMemo(() => new RoleRepository(), []);

    const fetchRoles = useCallback(async () => {
        const rawRoles = await repository.getAllRoles();
        // Return structured roles for selection
        return rawRoles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            type: role.type
        }));
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchRoles);

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        roles: returnedData || [],
        isLoading: inProgress,
        error,
        reloadRoles: execute
    };
};
