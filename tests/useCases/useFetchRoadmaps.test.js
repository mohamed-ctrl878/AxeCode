import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchRoadmaps } from '../../src/domain/useCase/useFetchRoadmaps';

// Mock RoadmapRepository
const mockGetAll = vi.fn();
vi.mock('@infrastructure/repository/RoadmapRepository', () => {
    return {
        RoadmapRepository: class {
            constructor() {
                this.getAll = mockGetAll;
            }
        }
    };
});


describe('useFetchRoadmaps Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch and map roadmaps', async () => {
        mockGetAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        const { result } = renderHook(() => useFetchRoadmaps());

        await act(async () => {
            const data = await result.current.fetchRoadmaps();
            expect(data.length).toBe(2);
            expect(data[0].id).toBe(1);
        });

        expect(mockGetAll).toHaveBeenCalled();
        expect(result.current.loading).toBe(false);
        expect(result.current.roadmaps).toHaveLength(2);
    });
});
