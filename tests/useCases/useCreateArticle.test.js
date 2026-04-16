import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateArticle } from '../../src/domain/useCase/useCreateArticle';
import { MOCK_ARTICLE_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock ArticleRepository
const mockCreate = vi.fn();
vi.mock('@infrastructure/repository/ArticleRepository', () => {
    return {
        ArticleRepository: class {
            constructor() {
                this.create = mockCreate;
            }
        }
    };
});

describe('useCreateArticle Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully create an article', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreateArticle());

        await act(async () => {
            const data = await result.current.createArticle(MOCK_ARTICLE_DATA);
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockCreate).toHaveBeenCalledWith(MOCK_ARTICLE_DATA);
        expect(result.current.inProgress).toBe(false);
        expect(result.current.article).toEqual(MOCK_API_RESPONSE);
    });

    it('should handle creation error', async () => {
        const error = new Error('Network Error');
        mockCreate.mockRejectedValue(error);

        const { result } = renderHook(() => useCreateArticle());

        await act(async () => {
            try {
                await result.current.createArticle(MOCK_ARTICLE_DATA);
            } catch (e) {
                // Expected
            }
        });

        expect(result.current.error).toBe('Network Error');
    });
});
