import { useAsyncUseCase } from './useAsyncUseCase';
import { GlobalTagRepository } from '../../infrastructure/repository/GlobalTagRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * UseCase hook for managing Global Tags in Admin CMS.
 * Supports server-side pagination & search.
 */
export const useFetchAdminTags = () => {
    const repository = useMemo(() => new GlobalTagRepository(), []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchTags = useCallback(async () => {
        return await repository.getAll(page, pageSize, search);
    }, [repository, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchTags);

    useEffect(() => {
        execute();
    }, [execute]);

    const deleteTag = useCallback(async (id) => {
        await repository.deleteTag(id);
        await execute(); // Refresh list
    }, [repository, execute]);

    return {
        tags: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute,
        deleteTag
    };
};
