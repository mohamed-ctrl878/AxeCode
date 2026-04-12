import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';
import { ReportTypeRequest } from '../../infrastructure/DTO/Request/ReportTypeRequest';

/**
 * Hook to update an existing report reason.
 */
export const useUpdateReportType = () => {
    const updateUseCase = useCallback(async (id, data) => {
        const requestDto = new ReportTypeRequest(data);
        return await repositoryRegistry.reportTypeRepository.update(id, requestDto);
    }, []);

    const { execute: updateReportType, inProgress, error } = useAsyncUseCase(updateUseCase);

    return { updateReportType, inProgress, error };
};
