import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateUserName } from '../../src/domain/useCase/useUpdateUserName';
import { MOCK_USER_DATA } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock UserRepository
const mockUpdateName = vi.fn();
vi.mock('@infrastructure/repository/UserRepository', () => {
    return {
        UserRepository: class {
            constructor() {
                this.updateUser = mockUpdateName;
            }
        }
    };
});

describe('useUpdateUserName Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update display name', async () => {
        const updatedUser = { ...MOCK_USER_DATA, username: 'UpdatedName' };
        mockUpdateName.mockResolvedValue(updatedUser);

        const { result } = renderHook(() => useUpdateUserName());

        await act(async () => {
            const data = await result.current.updateName(1, { firstname: 'UpdatedName' });
            expect(data.username).toBe('UpdatedName');
        });

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setUserData' }));
        expect(result.current.isUpdating).toBe(false);
    });
});
