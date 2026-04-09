import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { ForgotPasswordRequest } from '@infrastructure/DTO/Request/ForgotPasswordRequest';

/**
 * useForgotPassword: Domain UseCase for initiating password recovery.
 */
export const useForgotPassword = () => {
    const authRepository = new AuthRepository();

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        useCallback(async (email) => {
            const request = new ForgotPasswordRequest({ email });
            request.validate();
            
            return await authRepository.forgotPassword(request.email);
        }, [authRepository])
    );

    return {
        forgotPassword: execute,
        isSending: inProgress,
        error,
        successData: returnedData
    };
};
