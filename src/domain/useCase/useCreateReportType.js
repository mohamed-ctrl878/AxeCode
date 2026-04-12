import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';
import { ReportTypeRequest } from '../../infrastructure/DTO/Request/ReportTypeRequest';

/**
 * Hook to create a new report reason.
 */
export const useCreateReportType = () => {
    const createUseCase = useCallback(async (data) => {
        const requestDto = new ReportTypeRequest(data);
        return await repositoryRegistry.reportTypeRepository.create(requestDto);
    }, []);

    const { execute: createReportType, inProgress, error } = useAsyncUseCase(createUseCase);

    return { createReportType, inProgress, error };
};
