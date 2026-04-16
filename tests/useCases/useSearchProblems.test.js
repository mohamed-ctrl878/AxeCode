import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchProblems } from '../../src/domain/useCase/useSearchProblems';
import { MOCK_SEARCH_RESULTS } from './mockData';

// Mock ProblemRepository
const mockSearch = vi.fn();
vi.mock('@infrastructure/repository/ProblemRepository', () => {
    return {
        ProblemRepository: class {
            constructor() {
                this.search = mockSearch;
            }
        }
    };
});

// Mock utils and mappers
vi.mock('@core/utils/strapiFlatten', () => ({
    flattenStrapi: vi.fn().mockImplementation((data) => data)
}));

vi.mock('@domain/mapper/EntityMapper', () => ({
    EntityMapper: {
        toCardProblem: vi.fn().mockImplementation((dto) => ({ ...dto, mapped: true }))
    }
}));

describe('useSearchProblems Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully search for problems', async () => {
        mockSearch.mockResolvedValue(MOCK_SEARCH_RESULTS);

        const { result } = renderHook(() => useSearchProblems());

        await act(async () => {
            const data = await result.current.searchProblems('test');
            expect(data.length).toBe(2);
            expect(data[0].mapped).toBe(true);
        });

        expect(mockSearch).toHaveBeenCalledWith('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.problems).toHaveLength(2);
    });

    it('should return empty array for short queries', async () => {
        const { result } = renderHook(() => useSearchProblems());

        await act(async () => {
            const data = await result.current.searchProblems('t');
            expect(data).toEqual([]);
        });

        expect(mockSearch).not.toHaveBeenCalled();
    });
});
