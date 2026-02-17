import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { UserDTO } from '@infrastructure/DTO/UserDTO';
import { setUserData, logout } from '@infrastructure/store/authSlice';
import { setLoading, setError } from '@infrastructure/store/authUiSlice';

/**
 * useFetchMe: Orchestrates fetching the current user profile.
 * Standardizes the profile data via UserDTO.
 * Handles automatic logout on session expiration (401).
 */
export const useFetchMe = () => {
    const dispatch = useDispatch();
    const authRepository = new AuthRepository();

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        useCallback(async () => {
            try {
                dispatch(setLoading(true));
                dispatch(setError(null));

                const result = await authRepository.me();

                if (result) {
                    // Standardize with DTO
                    const userDto = new UserDTO(result);
                    dispatch(setUserData(userDto));
                    return userDto;
                }

                return null;
            } catch (err) {
                // If unauthorized, clear the persistent toggle
                if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
                    dispatch(logout());
                }

                const errorMessage = err.message || "Failed to fetch user profile.";
                dispatch(setError(errorMessage));
                throw err;
            } finally {
                dispatch(setLoading(false));
            }
        }, [dispatch])
    );

    return {
        fetchMe: execute,
        meData: returnedData,
        isFetchingMe: inProgress,
        fetchMeError: error
    };
};
