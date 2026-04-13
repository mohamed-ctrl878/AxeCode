import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchEvents } from '../../src/domain/useCase/useSearchEvents';
import { MOCK_SEARCH_RESULTS } from './mockData';

// Mock EventRepository
const mockSearch = vi.fn();
vi.mock('../../src/infrastructure/repository/EventRepository', () => ({
    EventRepository: vi.fn().mockImplementation(() => ({
        search: mockSearch
    }))
}));

describe('useSearchEvents Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully search for events', async () => {
        mockSearch.mockResolvedValue(MOCK_SEARCH_RESULTS);

        const { result } = renderHook(() => useSearchEvents());

        await act(async () => {
            const data = await result.current.searchEvents('conference');
            expect(data.length).toBe(2);
        });

        expect(mockSearch).toHaveBeenCalledWith('conference');
        expect(result.current.loading).toBe(false);
        expect(result.current.events).toHaveLength(2);
    });
});
