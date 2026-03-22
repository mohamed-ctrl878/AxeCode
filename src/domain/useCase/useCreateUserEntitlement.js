import { useAsyncUseCase } from './useAsyncUseCase';
import { UserEntitlementRepository } from '../../infrastructure/repository/UserEntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for creating a user enrollment.
 */
export const useCreateUserEntitlement = () => {
    const repository = useMemo(() => new UserEntitlementRepository(), []);

    const createLogic = useCallback(async (data) => {
        return await repository.create(data);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(createLogic);

    return {
        createUserEntitlement: execute,
        userEntitlement: returnedData,
        inProgress,
        error
    };
};
