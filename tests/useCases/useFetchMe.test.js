import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchMe } from '../../src/domain/useCase/useFetchMe';
import { MOCK_USER_DATA } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock AuthRepository
const mockMe = vi.fn();
vi.mock('../../src/infrastructure/repository/AuthRepository', () => ({
    AuthRepository: vi.fn().mockImplementation(() => ({
        me: mockMe
    }))
}));

describe('useFetchMe Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch personal profile', async () => {
        mockMe.mockResolvedValue(MOCK_USER_DATA);

        const { result } = renderHook(() => useFetchMe());

        await act(async () => {
            const data = await result.current.fetchMe();
            expect(data.username).toBe(MOCK_USER_DATA.username);
        });

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setUserData' }));
        expect(result.current.isFetchingMe).toBe(false);
    });

    it('should handle session expiration (401)', async () => {
        mockMe.mockRejectedValue(new Error('Unauthorized 401'));

        const { result } = renderHook(() => useFetchMe());

        await act(async () => {
            try {
                await result.current.fetchMe();
            } catch (e) {
                // Expected
            }
        });

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/logout' }));
        expect(result.current.fetchMeError).toContain('401');
    });
});
