import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo, useCallback } from 'react';

/**
 * Hook to update a user's role.
 */
export const useUpdateUserRole = () => {
    const repository = useMemo(() => new UserRepository(), []);

    const updateRole = useCallback(async ({ userId, roleId }) => {
        // We pass the new role ID to the user update endpoint
        const updatedUser = await repository.updateUser(userId, { role: roleId });
        return updatedUser;
    }, [repository]);

    const { execute, inProgress, error } = useAsyncUseCase(updateRole);

    return {
        updateUserRole: execute,
        isUpdating: inProgress,
        error
    };
};
