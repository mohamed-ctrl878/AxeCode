import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateCourse } from '../../src/domain/useCase/useCreateCourse';
import { MOCK_COURSE_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock CourseRepository
const mockCreate = vi.fn();
vi.mock('@infrastructure/repository/CourseRepository', () => {
    return {
        CourseRepository: class {
            constructor() {
                this.create = mockCreate;
            }
        }
    };
});

describe('useCreateCourse Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully create a course', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreateCourse());

        await act(async () => {
            const data = await result.current.createCourse(MOCK_COURSE_DATA);
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockCreate).toHaveBeenCalledWith(MOCK_COURSE_DATA);
        expect(result.current.inProgress).toBe(false);
        expect(result.current.course).toEqual(MOCK_API_RESPONSE);
    });
});
