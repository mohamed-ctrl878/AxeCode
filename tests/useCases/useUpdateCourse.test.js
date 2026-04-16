import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateCourse } from '../../src/domain/useCase/useUpdateCourse';
import { MOCK_COURSE_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock CourseRepository
const mockUpdate = vi.fn();
vi.mock('@infrastructure/repository/CourseRepository', () => {
    return {
        CourseRepository: class {
            constructor() {
                this.update = mockUpdate;
            }
        }
    };
});

describe('useUpdateCourse Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update a course', async () => {
        mockUpdate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useUpdateCourse());

        await act(async () => {
            const data = await result.current.updateCourse({ id: 1, data: MOCK_COURSE_DATA });
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockUpdate).toHaveBeenCalledWith(1, MOCK_COURSE_DATA);
        expect(result.current.inProgress).toBe(false);
    });
});
