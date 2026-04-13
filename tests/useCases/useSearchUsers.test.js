import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchUsers } from '../../src/domain/useCase/useSearchUsers';
import { MOCK_USER_DATA } from './mockData';

// Mock UserRepository
const mockSearchByQuery = vi.fn();
vi.mock('../../src/infrastructure/repository/UserRepository', () => ({
    UserRepository: vi.fn().mockImplementation(() => ({
        searchByQuery: mockSearchByQuery
    }))
}));

describe('useSearchUsers Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully search for users', async () => {
        const mockResults = [MOCK_USER_DATA];
        mockSearchByQuery.mockResolvedValue(mockResults);

        const { result } = renderHook(() => useSearchUsers());

        await act(async () => {
            const data = await result.current.searchUsers('testuser');
            expect(data.length).toBe(1);
            expect(data[0].username).toBe(MOCK_USER_DATA.username);
        });

        expect(mockSearchByQuery).toHaveBeenCalledWith('testuser');
        expect(result.current.loading).toBe(false);
    });
});
