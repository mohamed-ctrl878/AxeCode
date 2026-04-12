import { useEffect, useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

/**
 * Hook to fetch all report reasons (report types) for CMS.
 */
export const useFetchReportTypes = () => {
    const fetchFunc = useCallback(() => repositoryRegistry.reportTypeRepository.fetchAll(), []);

    const { execute, returnedData: reportTypes, inProgress: isLoading, error } = useAsyncUseCase(fetchFunc);

    useEffect(() => {
        execute();
    }, [execute]);

    return { 
        reportTypes: reportTypes || [], 
        isLoading, 
        error,
        fetch: execute
    };
};
