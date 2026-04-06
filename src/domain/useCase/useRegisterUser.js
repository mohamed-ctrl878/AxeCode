import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { UserRepository } from '@infrastructure/repository/UserRepository';
import { RegisterRequest } from '@infrastructure/DTO/Request/RegisterRequest';
import { UserDTO } from '@infrastructure/DTO/UserDTO';
import { setUser, setUserData } from '@infrastructure/store/authSlice';

/**
 * useRegisterUser: Orchestrates the registration and OTP confirmation flow.
 */
export const useRegisterUser = () => {
    const dispatch = useDispatch();
    const authRepository = new AuthRepository();
    const userRepository = new UserRepository();

    const { execute: register, inProgress: isRegistering, error: registrationError } = useAsyncUseCase(
        useCallback(async (formData) => {
            const request = new RegisterRequest(formData);
            request.validate();

            const isEmailAvailable = await userRepository.checkAvailability('email', request.email);
            if (!isEmailAvailable) throw new Error("Email is already registered.");

            const isUsernameAvailable = await userRepository.checkAvailability('username', request.username);
            if (!isUsernameAvailable) throw new Error("Username is already taken.");

            return await authRepository.register(request);
        }, [userRepository, authRepository])
    );

    const { execute: confirmOtp, inProgress: isConfirming, error: confirmationError } = useAsyncUseCase(
        useCallback(async (email, code) => {
            const result = await authRepository.confirmOtp(email, code);
            
            if (result && result.jwt) {
                // Success: Log the user in
                dispatch(setUser(result.jwt));
                dispatch(setUserData(new UserDTO(result.user)));
                return result;
            }
            throw new Error("Activation failed. Please check the code.");
        }, [authRepository, dispatch])
    );

    const { execute: resendOtp, inProgress: isResending, error: resendError } = useAsyncUseCase(
        useCallback(async (email) => {
            return await authRepository.resendOtp(email);
        }, [authRepository])
    );

    return {
        register,
        isRegistering,
        registrationError,
        confirmOtp,
        isConfirming,
        confirmationError,
        resendOtp,
        isResending,
        resendError
    };
};
