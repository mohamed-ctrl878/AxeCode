import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useJobTitleTags = () => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    // Get static taxonomy
    const fetchLogic = useCallback(async () => {
        const result = await repository.getJobTitleTags();
        return result.map(dto => EntityMapper.toJobTitleTag(dto));
    }, [repository]);

    const { execute: fetchTags, returnedData: tags, inProgress: loadingTags } = useAsyncUseCase(fetchLogic);

    // Get my chosen titles
    const fetchMyTitlesLogic = useCallback(async () => {
        // Returns the junction objects directly for the UI
        return await repository.getMyJobTitles();
    }, [repository]);

    const { execute: fetchMyTitles, returnedData: myTitles, inProgress: loadingMyTitles } = useAsyncUseCase(fetchMyTitlesLogic);

    // Add my title
    const addLogic = useCallback(async (tagId, experienceLevel) => {
        return await repository.addMyJobTitle(tagId, experienceLevel);
    }, [repository]);

    const { execute: addMyTitle, inProgress: isAdding } = useAsyncUseCase(addLogic);

    // Remove my title
    const removeLogic = useCallback(async (tagId) => {
        return await repository.removeMyJobTitle(tagId);
    }, [repository]);

    const { execute: removeMyTitle, inProgress: isRemoving } = useAsyncUseCase(removeLogic);

    return {
        fetchTags,
        tags,
        loadingTags,
        fetchMyTitles,
        myTitles,
        loadingMyTitles,
        addMyTitle,
        isAdding,
        removeMyTitle,
        isRemoving
    };
};
