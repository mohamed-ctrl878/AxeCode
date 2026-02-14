import { useAsyncUseCase } from './useAsyncUseCase';
import { MediaRepository } from '../../infrastructure/repository/MediaRepository';
import { useMemo } from 'react';

/**

 * UseCase hook for uploading media files.
 */
export const useUploadMedia = () => {
    const mediaRepo = useMemo(() => new MediaRepository(), []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        (files) => mediaRepo.uploadFiles(files)
    );

    return {
        upload: execute,
        uploadedIds: returnedData,
        inProgress,
        error
    };
};
