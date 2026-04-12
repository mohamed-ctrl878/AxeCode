import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

/**
 * Hook to delete a report reason.
 */
export const useDeleteReportType = () => {
    const deleteUseCase = useCallback(async (id) => {
        return await repositoryRegistry.reportTypeRepository.deleteType(id);
    }, []);

    const { execute: deleteReportType, inProgress, error } = useAsyncUseCase(deleteUseCase);

    return { deleteReportType, inProgress, error };
};
