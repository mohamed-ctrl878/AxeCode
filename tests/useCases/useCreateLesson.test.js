import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateLesson } from '../useCreateLesson';
import { LessonRepository } from '../../../infrastructure/repository/LessonRepository';
import { MOCK_LESSON_DATA, MOCK_API_RESPONSE } from './mockData';

const mockCreate = vi.fn();

vi.mock('../../../infrastructure/repository/LessonRepository', () => {
    return {
        LessonRepository: vi.fn().mockImplementation(function () {
            return {
                create: mockCreate
            };
        })
    };
});

describe('useCreateLesson Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle successful lesson creation', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreateLesson());

        await act(async () => {
            await result.current.createLesson(MOCK_LESSON_DATA);
        });

        expect(result.current.inProgress).toBe(false);
        expect(result.current.lesson).toEqual(MOCK_API_RESPONSE);
    });
});
