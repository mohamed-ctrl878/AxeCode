import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

/**
 * UseCase for rating content (articles, courses, etc.).
 * Follows the same pattern as useLikeContent and useReportContent.
 * Wraps SharedInteractionRepository.rate() — upsert/toggle on backend.
 *
 * @returns {{ rateContent: Function, isRating: boolean, rateError: string|null, rateResponse: any }}
 */
export const useRateContent = () => {
    const rateUseCase = async (docId, contentType, rateValue) => {
        return await repositoryRegistry.sharedInteractionRepository.rate(docId, contentType, rateValue);
    };

    const { execute: rateContent, inProgress: isRating, error: rateError, returnedData: rateResponse } = useAsyncUseCase(rateUseCase);

    return { rateContent, isRating, rateError, rateResponse };
};
