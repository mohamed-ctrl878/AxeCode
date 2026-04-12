import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { EntityMapper } from '../mapper/EntityMapper';
import { useMemo, useCallback } from 'react';

/**
 * useSearchUsersByQuery: UseCase hook for global user search by username query.
 */
export const useSearchUsersByQuery = () => {
    const repository = useMemo(() => new UserRepository(), []);

    const searchLogic = useCallback(async (query) => {
        if (!query || query.trim().length < 2) return [];
        const results = await repository.search(query);
        return Array.isArray(results) ? results.map(item => EntityMapper.toUser(item)) : [];
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(searchLogic);

    return {
        searchUsers: execute,
        users: returnedData || [],
        loading: inProgress,
        error
    };
};
