import { useAsyncUseCase } from './useAsyncUseCase';
import { MediaRepository } from '../../infrastructure/repository/MediaRepository';
import { useMemo, useEffect, useCallback } from 'react';
import { EntityMapper } from '../mapper/EntityMapper';

/**
 * Hook for managing the Media Library in Admin CMS.
 */
export const useFetchAdminMedia = () => {
    const repository = useMemo(() => new MediaRepository(), []);

    const fetchMediaFiles = useCallback(async () => {
        const response = await repository.getMediaFiles();
        const rawItems = Array.isArray(response) ? response : response?.results || [];
        return rawItems.map(item => EntityMapper.toMedia(item));
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchMediaFiles);

    useEffect(() => {
        execute();
    }, [execute]);

    const deleteMediaFile = useCallback(async (id) => {
        await repository.deleteMediaFile(id);
        await execute(); // Refresh list
    }, [repository, execute]);

    return {
        mediaFiles: returnedData || [],
        isLoading: inProgress,
        error,
        reloadMedia: execute,
        deleteMediaFile
    };
};
