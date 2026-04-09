import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { AuthRepository } from '@infrastructure/repository/AuthRepository';
import { ResetPasswordRequest } from '@infrastructure/DTO/Request/ResetPasswordRequest';

/**
 * useResetPassword: Domain UseCase for final password update protocol.
 */
export const useResetPassword = () => {
    const authRepository = new AuthRepository();

    const { execute, inProgress, error, returnedData } = useAsyncUseCase(
        useCallback(async (formData) => {
            const request = new ResetPasswordRequest(formData);
            request.validate();
            
            return await authRepository.resetPassword(request.email, request.code, request.password);
        }, [authRepository])
    );

    return {
        resetPassword: execute,
        isResetting: inProgress,
        error,
        successData: returnedData
    };
};
