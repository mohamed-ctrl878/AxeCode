import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteCourse } from '../../src/domain/useCase/useDeleteCourse';

// Mock CourseRepository
const mockDelete = vi.fn();
vi.mock('../../src/infrastructure/repository/CourseRepository', () => ({
    CourseRepository: vi.fn().mockImplementation(() => ({
        delete: mockDelete
    }))
}));

describe('useDeleteCourse Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully delete a course', async () => {
        mockDelete.mockResolvedValue({ success: true });

        const { result } = renderHook(() => useDeleteCourse());

        await act(async () => {
            const data = await result.current.deleteCourse(1);
            expect(data.success).toBe(true);
        });

        expect(mockDelete).toHaveBeenCalledWith(1);
        expect(result.current.inProgress).toBe(false);
    });
});
