import { useAsyncUseCase } from './useAsyncUseCase';
import { UserEntitlementRepository } from '../../infrastructure/repository/UserEntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for fetching all enroled users via user-entitlements.
 */
export const useFetchUserEntitlements = () => {
    const repository = useMemo(() => new UserEntitlementRepository(), []);

    const fetchLogic = useCallback(async (productId) => {
        return await repository.getByProductId(productId);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchUserEntitlements: execute,
        userEntitlements: returnedData || [],
        loading: inProgress,
        error
    };
};
