import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteArticle } from '../../src/domain/useCase/useDeleteArticle';

// Mock ArticleRepository
const mockDelete = vi.fn();
vi.mock('../../src/infrastructure/repository/ArticleRepository', () => ({
    ArticleRepository: vi.fn().mockImplementation(() => ({
        delete: mockDelete
    }))
}));

describe('useDeleteArticle Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully delete an article', async () => {
        mockDelete.mockResolvedValue({ success: true });

        const { result } = renderHook(() => useDeleteArticle());

        await act(async () => {
            await result.current.deleteArticle(1);
        });

        expect(mockDelete).toHaveBeenCalledWith(1);
        expect(result.current.inProgress).toBe(false);
    });
});
