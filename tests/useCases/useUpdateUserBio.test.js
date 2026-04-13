import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateUserBio } from '../../src/domain/useCase/useUpdateUserBio';
import { MOCK_USER_DATA } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock UserRepository
const mockUpdateBio = vi.fn();
vi.mock('../../src/infrastructure/repository/UserRepository', () => ({
    UserRepository: vi.fn().mockImplementation(() => ({
        updateBio: mockUpdateBio
    }))
}));

describe('useUpdateUserBio Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update user biography', async () => {
        const updatedUser = { ...MOCK_USER_DATA, bio: 'New Bio' };
        mockUpdateBio.mockResolvedValue(updatedUser);

        const { result } = renderHook(() => useUpdateUserBio());

        await act(async () => {
            const data = await result.current.updateBio('New Bio');
            expect(data.bio).toBe('New Bio');
        });

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setUserData' }));
        expect(result.current.inProgress).toBe(false);
    });

    it('should handle update errors', async () => {
        mockUpdateBio.mockRejectedValue(new Error('Update failed'));

        const { result } = renderHook(() => useUpdateUserBio());

        await act(async () => {
            try {
                await result.current.updateBio('New Bio');
            } catch (e) {
                // Expected
            }
        });

        expect(result.current.error).toBe('Update failed');
    });
});
