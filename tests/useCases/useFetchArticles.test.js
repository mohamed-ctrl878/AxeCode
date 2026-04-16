import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchArticles } from '../../src/domain/useCase/useFetchArticles';
import { MOCK_LIST_RESPONSE } from './mockData';

// Mock RecommendationRepository
const mockGetArticles = vi.fn();
vi.mock('@infrastructure/repository/RecommendationRepository', () => {
    return {
        RecommendationRepository: class {
            constructor() {
                this.getArticles = mockGetArticles;
            }
        }
    };
});


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
        });

        expect(mockGetArticles).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.articles).toHaveLength(2);
    });
});
