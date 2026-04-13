import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreatePost } from '../useCreatePost';
import { PostRepository } from '../../../infrastructure/repository/PostRepository';
import { MOCK_POST_DATA, MOCK_API_RESPONSE } from './mockData';

const mockCreate = vi.fn();

// Mock the repository - sharing the same mock function across all instances
vi.mock('../../../infrastructure/repository/PostRepository', () => {
    return {
        PostRepository: vi.fn().mockImplementation(function () {
            return {
                create: mockCreate
            };
        })
    };
});

describe('useCreatePost Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct default states', () => {
        const { result } = renderHook(() => useCreatePost());

        expect(result.current.inProgress).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.post).toBe(null);
    });

    it('should handle successful post creation', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreatePost());

        await act(async () => {
            await result.current.createPost(MOCK_POST_DATA);
        });

        expect(result.current.inProgress).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.post).toEqual(MOCK_API_RESPONSE);
    });

    it('should handle failed post creation', async () => {
        const errorMessage = 'Network Error';
        mockCreate.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useCreatePost());

        await act(async () => {
            try {
                await result.current.createPost(MOCK_POST_DATA);
            } catch (e) {
                // Expected error
            }
        });

        expect(result.current.inProgress).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.post).toBe(null);
    });
});
