import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';

/**
 * useUserAvailability: Use case hook to check if user identifiers are taken.
 * Follows the pattern of decoupled domain logic.
 */
export const useUserAvailability = () => {
    const userRepository = new UserRepository();

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        useCallback((field, value) => userRepository.checkAvailability(field, value), [])
    );

    return {
        check: execute,
        isAvailable: returnedData,
        isChecking: inProgress,
        error
    };
};
