import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchCourses } from '../../src/domain/useCase/useSearchCourses';
import { MOCK_SEARCH_RESULTS } from './mockData';

// Mock CourseRepository
const mockSearch = vi.fn();
vi.mock('@infrastructure/repository/CourseRepository', () => {
    return {
        CourseRepository: class {
            constructor() {
                this.search = mockSearch;
            }
        }
    };
});

describe('useSearchCourses Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully search for courses', async () => {
        mockSearch.mockResolvedValue(MOCK_SEARCH_RESULTS);

        const { result } = renderHook(() => useSearchCourses());

        await act(async () => {
            const data = await result.current.searchCourses('react');
            expect(data.length).toBe(2);
        });

        expect(mockSearch).toHaveBeenCalledWith('react');
        expect(result.current.loading).toBe(false);
        expect(result.current.courses).toHaveLength(2);
    });

    it('should handle search error', async () => {
        mockSearch.mockRejectedValue(new Error('Search failed'));

        const { result } = renderHook(() => useSearchCourses());

        await act(async () => {
            try {
                await result.current.searchCourses('react');
            } catch (e) {
                // Expected
            }
        });

        expect(result.current.error).toBe('Search failed');
    });
});
