import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

export const useReportContent = () => {
    const reportUseCase = useCallback(async (docId, contentType, reportData) => {
        return await repositoryRegistry.sharedInteractionRepository.report(docId, contentType, reportData);
    }, []);

    const { execute: reportContent, inProgress: isReporting, error: reportError } = useAsyncUseCase(reportUseCase);

    return { reportContent, isReporting, reportError };
};
