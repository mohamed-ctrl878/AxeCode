import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserAvailability } from '../../src/domain/useCase/useUserAvailability';

// Mock UserRepository
const mockCheckAvailability = vi.fn();
vi.mock('../../src/infrastructure/repository/UserRepository', () => ({
    UserRepository: vi.fn().mockImplementation(() => ({
        checkAvailability: mockCheckAvailability
    }))
}));

describe('useUserAvailability Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return true if field is available', async () => {
        mockCheckAvailability.mockResolvedValue(true);

        const { result } = renderHook(() => useUserAvailability());

        await act(async () => {
            const available = await result.current.check('email', 'new@test.com');
            expect(available).toBe(true);
        });

        expect(result.current.isAvailable).toBe(true);
        expect(result.current.isChecking).toBe(false);
    });

    it('should return false if field is taken', async () => {
        mockCheckAvailability.mockResolvedValue(false);

        const { result } = renderHook(() => useUserAvailability());

        await act(async () => {
            const available = await result.current.check('username', 'takenName');
            expect(available).toBe(false);
        });

        expect(result.current.isAvailable).toBe(false);
    });
});
