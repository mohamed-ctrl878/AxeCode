import { useAsyncUseCase } from './useAsyncUseCase';
import { EntitlementRepository } from '../../infrastructure/repository/EntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for deleting an entitlement (revoking access).
 */
export const useDeleteEntitlement = () => {
    const repository = useMemo(() => new EntitlementRepository(), []);

    const deleteLogic = useCallback(async (id) => {
        return await repository.delete(id);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(deleteLogic);

    return {
        deleteEntitlement: execute,
        isDeleted: returnedData,
        inProgress,
        error
    };
};
