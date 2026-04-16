import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateArticle } from '../../src/domain/useCase/useUpdateArticle';
import { MOCK_ARTICLE_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock ArticleRepository
const mockUpdate = vi.fn();
vi.mock('@infrastructure/repository/ArticleRepository', () => {
    return {
        ArticleRepository: class {
            constructor() {
                this.update = mockUpdate;
            }
        }
    };
});

describe('useUpdateArticle Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update an article', async () => {
        mockUpdate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useUpdateArticle());

        await act(async () => {
            const data = await result.current.updateArticle(1, MOCK_ARTICLE_DATA);
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockUpdate).toHaveBeenCalledWith(1, MOCK_ARTICLE_DATA);
    });
});
