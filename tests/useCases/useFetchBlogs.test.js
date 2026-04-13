import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchBlogs } from '../../src/domain/useCase/useFetchBlogs';
import { MOCK_LIST_RESPONSE } from './mockData';

// Mock RecommendationRepository
const mockGetBlogs = vi.fn();
vi.mock('../../src/infrastructure/repository/RecommendationRepository', () => ({
    RecommendationRepository: vi.fn().mockImplementation(() => ({
        getBlogs: mockGetBlogs
    }))
}));

// Mock Mapper and DTO
vi.mock('../../domain/mapper/EntityMapper', () => ({
    EntityMapper: {
        toBlog: vi.fn().mockImplementation((dto) => ({ ...dto, mapped: true, uid: dto.id }))
    }
}));

describe('useFetchBlogs Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch initial blogs', async () => {
        mockGetBlogs.mockResolvedValue(MOCK_LIST_RESPONSE);

        const { result } = renderHook(() => useFetchBlogs());

        await act(async () => {
            await result.current.fetchBlogs(true, 20, 'recommend');
        });

        expect(mockGetBlogs).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.blogs).toHaveLength(2);
        expect(result.current.hasMore).toBe(false); // Since mock list length < 20
    });

    it('should append blogs and deduplicate on pagination', async () => {
        // Initial Fetch
        mockGetBlogs.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
        const { result } = renderHook(() => useFetchBlogs());

        await act(async () => {
            await result.current.fetchBlogs(true, 2, 'recommend');
        });

        expect(result.current.blogs).toHaveLength(2);

        // Pagination Fetch
        mockGetBlogs.mockResolvedValueOnce([{ id: 2 }, { id: 3 }]); // id 2 is duplicate
        await act(async () => {
            await result.current.fetchBlogs(false, 2, 'recommend');
        });

        expect(result.current.blogs).toHaveLength(3); // 1, 2, 3
    });

    it('should handle fetch error', async () => {
        mockGetBlogs.mockRejectedValue(new Error('Network Error'));

        const { result } = renderHook(() => useFetchBlogs());

        await act(async () => {
            await result.current.fetchBlogs();
        });

        expect(result.current.error).toBe('Network Error');
        expect(result.current.loading).toBe(false);
    });
});
