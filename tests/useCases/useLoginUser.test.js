import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginUser } from '../../src/domain/useCase/useLoginUser';
import { AuthRepository } from '../../src/infrastructure/repository/AuthRepository';
import { MOCK_AUTH_RESPONSE, MOCK_LOGIN_CREDENTIALS } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock AuthRepository
const mockLogin = vi.fn();
vi.mock('../../src/infrastructure/repository/AuthRepository', () => {
    return {
        AuthRepository: vi.fn().mockImplementation(() => ({
            login: mockLogin
        }))
    };
});

// Mock DTOs to avoid validation errors in tests if needed
vi.mock('../../src/infrastructure/DTO/Request/LoginRequest', () => ({
    LoginRequest: vi.fn().mockImplementation(() => ({
        validate: vi.fn()
    }))
}));

describe('useLoginUser Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle successful login', async () => {
        mockLogin.mockResolvedValue(MOCK_AUTH_RESPONSE);

        const { result } = renderHook(() => useLoginUser());

        await act(async () => {
            await result.current.login(MOCK_LOGIN_CREDENTIALS);
        });

        expect(mockLogin).toHaveBeenCalledWith(expect.anything());
        expect(mockDispatch).toHaveBeenCalled();
        expect(result.current.isLoggingIn).toBe(false);
        expect(result.current.loginData).toEqual(MOCK_AUTH_RESPONSE);
    });

    it('should handle login failure', async () => {
        const error = new Error('Invalid credentials');
        mockLogin.mockRejectedValue(error);

        const { result } = renderHook(() => useLoginUser());

        await act(async () => {
            try {
                await result.current.login(MOCK_LOGIN_CREDENTIALS);
            } catch (e) {
                // Expected
            }
        });

        expect(result.current.loginError).toBe('Invalid credentials');
        expect(result.current.isLoggingIn).toBe(false);
    });
});
