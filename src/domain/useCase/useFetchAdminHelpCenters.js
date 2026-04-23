import { useAsyncUseCase } from './useAsyncUseCase';
import { HelpCenterRepository } from '../../infrastructure/repository/HelpCenterRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

export const useFetchAdminHelpCenters = () => {
    const repository = useMemo(() => new HelpCenterRepository(), []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchHelpCenters = useCallback(async () => {
        return await repository.getAll(page, pageSize, search);
    }, [repository, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchHelpCenters);

    useEffect(() => {
        execute();
    }, [execute]);

    const createHelpCenter = useCallback(async (data) => {
        await repository.create(data);
        await execute();
    }, [repository, execute]);

    const updateHelpCenter = useCallback(async (id, data) => {
        await repository.update(id, data);
        await execute();
    }, [repository, execute]);

    const deleteHelpCenter = useCallback(async (id) => {
        await repository.deleteHelpCenter(id);
        await execute();
    }, [repository, execute]);

    return {
        helpCenters: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute,
        createHelpCenter,
        updateHelpCenter,
        deleteHelpCenter
    };
};
