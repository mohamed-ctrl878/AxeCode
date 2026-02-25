import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

export const useReportContent = () => {
    const reportUseCase = async (docId, contentType, reportData) => {
        return await repositoryRegistry.sharedInteractionRepository.report(docId, contentType, reportData);
    };

    const { execute: reportContent, inProgress: isReporting, error: reportError } = useAsyncUseCase(reportUseCase);

    return { reportContent, isReporting, reportError };
};
