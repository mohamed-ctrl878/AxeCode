import { useAsyncUseCase } from './useAsyncUseCase';
import { UserEntitlementRepository } from '../../infrastructure/repository/UserEntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for deleting/revoking a user enrollment.
 */
export const useDeleteUserEntitlement = () => {
    const repository = useMemo(() => new UserEntitlementRepository(), []);

    const deleteLogic = useCallback(async (id) => {
        return await repository.delete(id);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(deleteLogic);

    return {
        deleteUserEntitlement: execute,
        isDeleted: returnedData,
        inProgress,
        error
    };
};
