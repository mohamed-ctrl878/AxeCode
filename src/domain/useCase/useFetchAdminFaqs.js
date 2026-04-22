import { useAsyncUseCase } from './useAsyncUseCase';
import { FaqRepository } from '../../infrastructure/repository/FaqRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

export const useFetchAdminFaqs = () => {
    const repository = useMemo(() => new FaqRepository(), []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const fetchFaqs = useCallback(async () => {
        return await repository.getAll(page, pageSize, search);
    }, [repository, page, search]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchFaqs);

    useEffect(() => {
        execute();
    }, [execute]);

    const createFaq = useCallback(async (data) => {
        await repository.create(data);
        await execute();
    }, [repository, execute]);

    const updateFaq = useCallback(async (id, data) => {
        await repository.update(id, data);
        await execute();
    }, [repository, execute]);

    const deleteFaq = useCallback(async (id) => {
        await repository.deleteFaq(id);
        await execute();
    }, [repository, execute]);

    return {
        faqs: returnedData?.items || [],
        totalItems: returnedData?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((returnedData?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        setSearch,
        isLoading: inProgress,
        error,
        fetch: execute,
        createFaq,
        updateFaq,
        deleteFaq
    };
};
