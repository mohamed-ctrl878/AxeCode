import { useAsyncUseCase } from './useAsyncUseCase';
import { EntitlementRepository } from '../../infrastructure/repository/EntitlementRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for fetching all entitlements for a specific course.
 */
export const useFetchCourseEntitlements = () => {
    const repository = useMemo(() => new EntitlementRepository(), []);

    const fetchLogic = useCallback(async (courseId) => {
        return await repository.getForItem(courseId);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchEntitlements: execute,
        entitlements: returnedData || [],
        loading: inProgress,
        error
    };
};
