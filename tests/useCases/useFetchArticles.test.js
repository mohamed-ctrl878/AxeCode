import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchArticles } from '../../src/domain/useCase/useFetchArticles';
import { MOCK_LIST_RESPONSE } from './mockData';

// Mock RecommendationRepository
const mockGetArticles = vi.fn();
vi.mock('../../src/infrastructure/repository/RecommendationRepository', () => ({
    RecommendationRepository: vi.fn().mockImplementation(() => ({
        getArticles: mockGetArticles
    }))
}));

// Mock Mapper and DTO
vi.mock('../../domain/mapper/EntityMapper', () => ({
    EntityMapper: {
        toArticle: vi.fn().mockImplementation((dto) => ({ ...dto, mapped: true }))
    }
}));

describe('useFetchArticles Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch and map articles', async () => {
        mockGetArticles.mockResolvedValue(MOCK_LIST_RESPONSE);

        const { result } = renderHook(() => useFetchArticles());

        await act(async () => {
            const data = await result.current.fetchArticles();
            expect(data.length).toBe(MOCK_LIST_RESPONSE.length);
            expect(data[0].mapped).toBe(true);
        });

        expect(mockGetArticles).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.articles).toHaveLength(2);
    });
});
