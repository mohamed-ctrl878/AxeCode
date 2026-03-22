import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo, useCallback } from 'react';

/**
 * UseCase hook for searching users by email.
 */
export const useSearchUsers = () => {
    const repository = useMemo(() => new UserRepository(), []);

    const searchLogic = useCallback(async (email) => {
        if (!email || email.length < 3) return null;
        return await repository.searchByEmail(email);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(searchLogic);

    return {
        searchUsers: execute,
        foundUser: returnedData,
        loading: inProgress,
        error
    };
};
