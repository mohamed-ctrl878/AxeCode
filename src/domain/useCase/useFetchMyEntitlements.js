import { useAsyncUseCase } from './useAsyncUseCase';
import { UserEntitlementRepository } from '../../infrastructure/repository/UserEntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for fetching the current user's enrolled content.
 */
export const useFetchMyEntitlements = () => {
    const repository = useMemo(() => new UserEntitlementRepository(), []);

    const fetchLogic = useCallback(async () => {
        return await repository.getMyEntitlements();
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchMyEntitlements: execute,
        entitlements: returnedData || [],
        loading: inProgress,
        error
    };
};
