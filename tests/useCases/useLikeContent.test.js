import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLikeContent } from '../../src/domain/useCase/useLikeContent';

// Mock RepositoryRegistry
const mockLike = vi.fn();
vi.mock('../../src/infrastructure/repository/RepositoryRegistry', () => ({
    repositoryRegistry: {
        sharedInteractionRepository: {
            like: mockLike
        }
    }
}));

describe('useLikeContent Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully toggle like', async () => {
        mockLike.mockResolvedValue({ success: true, count: 10 });

        const { result } = renderHook(() => useLikeContent());

        await act(async () => {
            const res = await result.current.toggleLike('doc-1', 'blog');
            expect(res.success).toBe(true);
        });

        expect(mockLike).toHaveBeenCalledWith('doc-1', 'blog');
        expect(result.current.isLiking).toBe(false);
    });
});
