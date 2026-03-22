import { useAsyncUseCase } from './useAsyncUseCase';
import { EntitlementRepository } from '../../infrastructure/repository/EntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for creating an entitlement (granting access).
 */
export const useCreateEntitlement = () => {
    const repository = useMemo(() => new EntitlementRepository(), []);

    const createLogic = useCallback(async (data) => {
        return await repository.create(data);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(createLogic);

    return {
        createEntitlement: execute,
        entitlement: returnedData,
        inProgress,
        error
    };
};
