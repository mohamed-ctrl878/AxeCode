import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetchRoadmaps } from '../useFetchRoadmaps';
import { RoadmapRepository } from '@infrastructure/repository/RoadmapRepository';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Use vi.hoisted to ensure the mock function is available during hoisting
const { mockGetAll } = vi.hoisted(() => ({
    mockGetAll: vi.fn()
}));

// Mock the repository
vi.mock('@infrastructure/repository/RoadmapRepository', () => {
    return {
        RoadmapRepository: vi.fn().mockImplementation(function () {
            this.getAll = mockGetAll;
        })
    };
});

describe('useFetchRoadmaps Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct default states', () => {
        const { result } = renderHook(() => useFetchRoadmaps());

        expect(result.current.roadmaps).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should fetch and map roadmaps successfully', async () => {
        const mockData = [
            {
                id: 1,
                documentId: 'rm-1',
                title: 'Frontend Roadmap',
                description: [{ type: 'paragraph', children: [{ text: 'Learn React' }] }],
                flowData: { nodes: [{}, {}] },
                color: '#FF0000',
                icon: 'faMap',
                author: { username: 'john_doe' },
                createdAt: '2023-01-01T00:00:00Z'
            }
        ];

        mockGetAll.mockResolvedValue(mockData);

        const { result } = renderHook(() => useFetchRoadmaps());

        // Use act to trigger state changes
        await act(async () => {
            await result.current.fetchRoadmaps();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.roadmaps).not.toBeNull();
        expect(result.current.roadmaps).toHaveLength(1);
        expect(result.current.roadmaps[0].title).toBe('Frontend Roadmap');
        expect(result.current.error).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
        mockGetAll.mockRejectedValue(new Error('API Failure'));

        const { result } = renderHook(() => useFetchRoadmaps());

        await act(async () => {
            try {
                await result.current.fetchRoadmaps();
            } catch (e) {
                // Error is handled by the hook state
            }
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('API Failure');
        expect(result.current.roadmaps).toBeNull();
    });
});
