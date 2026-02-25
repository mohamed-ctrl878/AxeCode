import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';

export const useLikeContent = () => {
    const likeUseCase = async (docId, contentType) => {
        return await repositoryRegistry.sharedInteractionRepository.like(docId, contentType);
    };

    const { execute: toggleLike, inProgress: isLiking, error: likeError, returnedData: likeResponse } = useAsyncUseCase(likeUseCase);

    return { toggleLike, isLiking, likeError, likeResponse };
};
