import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegisterUser } from '../../src/domain/useCase/useRegisterUser';
import { MOCK_AUTH_RESPONSE, MOCK_REGISTER_DATA } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock Repositories
const mockRegister = vi.fn();
const mockConfirmOtp = vi.fn();
const mockResendOtp = vi.fn();
const mockCheckAvailability = vi.fn();

vi.mock('@infrastructure/repository/AuthRepository', () => {
    return {
        AuthRepository: class {
            constructor() {
                this.register = mockRegister;
                this.confirmOtp = mockConfirmOtp;
                this.resendOtp = mockResendOtp;
            }
        }
    };
});

vi.mock('@infrastructure/repository/UserRepository', () => {
    return {
        UserRepository: class {
            constructor() {
                this.checkAvailability = mockCheckAvailability;
            }
        }
    };
});

// Mock RegisterRequest
vi.mock('@infrastructure/DTO/Request/RegisterRequest', () => {
    return {
        RegisterRequest: class {
            constructor(data) {
                Object.assign(this, data);
                this.validate = vi.fn();
            }
        }
    };
});

describe('useRegisterUser Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle registration flow safely', async () => {
        mockCheckAvailability.mockResolvedValue(true); // Email/Username available
        mockRegister.mockResolvedValue({ message: "OTP Sent" });

        const { result } = renderHook(() => useRegisterUser());

        await act(async () => {
            const res = await result.current.register(MOCK_REGISTER_DATA);
            expect(res.message).toBe("OTP Sent");
        });

        expect(mockCheckAvailability).toHaveBeenCalledTimes(2);
        expect(mockRegister).toHaveBeenCalled();
        expect(result.current.isRegistering).toBe(false);
    });

    it('should throw error if email is taken', async () => {
        mockCheckAvailability.mockResolvedValueOnce(false); // Email taken

        const { result } = renderHook(() => useRegisterUser());

        await act(async () => {
            try {
                await result.current.register(MOCK_REGISTER_DATA);
            } catch (e) {
                expect(e.message).toBe("Email is already registered.");
            }
        });

        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should handle OTP confirmation success', async () => {
        mockConfirmOtp.mockResolvedValue(MOCK_AUTH_RESPONSE);

        const { result } = renderHook(() => useRegisterUser());

        await act(async () => {
            await result.current.confirmOtp("test@test.com", "123456");
        });

        expect(mockDispatch).toHaveBeenCalled();
        expect(result.current.isConfirming).toBe(false);
    });
});
