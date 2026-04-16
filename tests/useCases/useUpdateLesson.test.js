import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateLesson } from '../../src/domain/useCase/useUpdateLesson';
import { MOCK_LESSON_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock LessonRepository
const mockUpdate = vi.fn();
vi.mock('@infrastructure/repository/LessonRepository', () => {
    return {
        LessonRepository: class {
            constructor() {
                this.update = mockUpdate;
            }
        }
    };
});

describe('useUpdateLesson Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully update a lesson', async () => {
        mockUpdate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useUpdateLesson());

        await act(async () => {
            const data = await result.current.updateLesson({ id: 1, data: MOCK_LESSON_DATA });
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockUpdate).toHaveBeenCalledWith(1, MOCK_LESSON_DATA);
        expect(result.current.inProgress).toBe(false);
    });
});
