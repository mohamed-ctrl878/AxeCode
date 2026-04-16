import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteLesson } from '../../src/domain/useCase/useDeleteLesson';

// Mock LessonRepository
const mockDelete = vi.fn();
vi.mock('@infrastructure/repository/LessonRepository', () => {
    return {
        LessonRepository: class {
            constructor() {
                this.delete = mockDelete;
            }
        }
    };
});

describe('useDeleteLesson Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully delete a lesson', async () => {
        mockDelete.mockResolvedValue({ success: true });

        const { result } = renderHook(() => useDeleteLesson());

        await act(async () => {
            await result.current.deleteLesson(1);
        });

        expect(mockDelete).toHaveBeenCalledWith(1);
        expect(result.current.inProgress).toBe(false);
    });
});
