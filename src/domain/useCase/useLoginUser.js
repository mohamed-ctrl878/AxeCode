import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { LoginRequest } from '@infrastructure/DTO/Request/LoginRequest';
import { UserDTO } from '@infrastructure/DTO/UserDTO';
import { setUser, setUserData } from '@infrastructure/store/authSlice';
import { setLoading, setError } from '@infrastructure/store/authUiSlice';

/**
 * useLoginUser: Orchestrates the authentication flow.
 * Follows Clean Architecture: Handles validation, Auth Provider interaction, and State Sync.
 */
export const useLoginUser = () => {
    const dispatch = useDispatch();
    const authRepository = new AuthRepository();

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        useCallback(async (formData) => {
            try {
                dispatch(setLoading(true));
                dispatch(setError(null));

                // 1. Data Modeling & Validation
                const request = new LoginRequest(formData);
                request.validate();

                // 2. Auth Provider Interaction
                const result = await authRepository.login(request);

                // 3. State Management Sync
                if (result && result.user) {
                    // Standardize user data with Domain DTO
                    const userDto = new UserDTO(result.user);

                    dispatch(setUser(userDto)); // Triggers Persistence (Toggle Only)
                    dispatch(setUserData(userDto)); // Sets Memory-Only State
                }

                return result;
            } catch (err) {
                const errorMessage = err.message || "Authentication failed.";
                dispatch(setError(errorMessage));
                throw err;
            } finally {
                dispatch(setLoading(false));
            }
        }, [dispatch])
    );

    return {
        login: execute,
        loginData: returnedData,
        isLoggingIn: inProgress,
        loginError: error
    };
};
