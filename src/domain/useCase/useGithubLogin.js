import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { UserDTO } from '@infrastructure/DTO/UserDTO';
import { setUser, setUserData } from '@infrastructure/store/authSlice';

/**
 * useGithubLogin: Domain UseCase for GitHub OAuth authentication.
 */
export const useGithubLogin = () => {
    const dispatch = useDispatch();
    const authRepository = new AuthRepository();

    const { execute, inProgress, error } = useAsyncUseCase(
        useCallback(async (jwt) => {
            if (!jwt) throw new Error("No identity token received from protocol.");
            
            // 1. Exchange the transient JWT for a secure HttpOnly cookie
            const response = await authRepository.githubExchange(jwt);
            
            if (response && response.user) {
                // 2. Standardize user data with Domain DTO
                const userDto = new UserDTO(response.user);

                // 3. Update the local state/store (Login success logic)
                dispatch(setUser(userDto)); // Triggers Persistence
                dispatch(setUserData(userDto)); // Sets Memory-Only State
                
                return response;
            }
            
            throw new Error("Identity verification failed during exchange.");
        }, [authRepository, dispatch])
    );

    return {
        loginWithGithub: execute,
        isExchanging: inProgress,
        exchangeError: error,
        getGithubUrl: () => authRepository.getGithubLoginUrl()
    };
};
