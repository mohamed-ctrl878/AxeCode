import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { UserRepository } from '@infrastructure/repository/UserRepository';
import { RegisterRequest } from '@infrastructure/DTO/Request/RegisterRequest';

/**
 * useRegisterUser: Orchestrates the registration flow.
 * Follows Domain Layer patterns: Pre-flight checks + Persistence.
 */
export const useRegisterUser = () => {
    const authRepository = new AuthRepository();
    const userRepository = new UserRepository();

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(
        useCallback(async (formData) => {
            // 1. Data Modeling & Structural Validation
            const request = new RegisterRequest(formData);
            request.validate(); // Throws if structural issues exist

            // 2. Business Logic Checks (Pre-flight availability)
            // We do this to ensure we don't send a doomed request to the auth provider
            const isEmailAvailable = await userRepository.checkAvailability('email', request.email);
            if (!isEmailAvailable) throw new Error("Email is already registered.");

            const isUsernameAvailable = await userRepository.checkAvailability('username', request.username);
            if (!isUsernameAvailable) throw new Error("Username is already taken.");

            // 3. Execution
            return await authRepository.register(request);
        }, [])
    );

    return {
        register: execute,
        registrationData: returnedData,
        isRegistering: inProgress,
        registrationError: error
    };
};
