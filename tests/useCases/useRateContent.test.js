import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRateContent } from '../../src/domain/useCase/useRateContent';

// Mock RepositoryRegistry
const { mockRate } = vi.hoisted(() => ({ mockRate: vi.fn() }));
vi.mock('@infrastructure/repository/RepositoryRegistry', () => ({
    repositoryRegistry: {
        sharedInteractionRepository: {
            rate: mockRate
        }
    }
}));

describe('useRateContent Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully submit rating', async () => {
        mockRate.mockResolvedValue({ average: 4.5 });

        const { result } = renderHook(() => useRateContent());

        await act(async () => {
            const res = await result.current.rateContent('course-1', 'course', 5);
            expect(res.average).toBe(4.5);
        });

        expect(mockRate).toHaveBeenCalledWith('course-1', 'course', 5);
        expect(result.current.isRating).toBe(false);
    });
});
