import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchCoursePreview } from '../useFetchCoursePreview';

const mockGetPreview = vi.fn();

// Mock the repository
vi.mock('../../../infrastructure/repository/CourseRepository', () => {
    return {
        CourseRepository: vi.fn().mockImplementation(function () {
            return {
                getPreview: mockGetPreview
            };
        })
    };
});

const MOCK_RAW_COURSE = {
    id: 1,
    documentId: 'abc-123',
    title: 'Test Course',
    description: [{ type: 'paragraph', children: [{ text: 'Description' }] }],
    picture: { id: 1, url: '/test.jpg', name: 'test' },
    difficulty: 'Easy',
    contentType: 'course',
    price: 49,
    student_count: 100,
    hasAccess: false,
    entitlementsId: null,
    users_permissions_user: { id: 1, documentId: 'user-1', username: 'TestInstructor' },
    weeks: [
        {
            id: 1,
            documentId: 'week-1',
            title: 'Week 1',
            lessons: [
                { id: 101, documentId: 'lesson-1', title: 'Lesson 1', typeOfLesson: 'video' }
            ]
        }
    ],
    interactions: { rating: { average: 4.5, total: 10 } }
};

describe('useFetchCoursePreview Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct default states', () => {
        const { result } = renderHook(() => useFetchCoursePreview());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.coursePreview).toBe(null);
    });

    it('should fetch and map course preview successfully', async () => {
        mockGetPreview.mockResolvedValue(MOCK_RAW_COURSE);

        const { result } = renderHook(() => useFetchCoursePreview());

        await act(async () => {
            await result.current.fetchCoursePreview('abc-123');
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.coursePreview).not.toBe(null);
        expect(result.current.coursePreview.title).toBe('Test Course');
        expect(result.current.coursePreview.uid).toBe('abc-123');
        expect(result.current.coursePreview.difficulty).toBe('Easy');
        expect(result.current.coursePreview.price).toBe(49);
        expect(result.current.coursePreview.instructor).not.toBe(null);
        expect(result.current.coursePreview.instructor.username).toBe('TestInstructor');
        expect(result.current.coursePreview.weeks).toHaveLength(1);
        expect(result.current.coursePreview.weeks[0].lessons).toHaveLength(1);
    });

    it('should handle API errors gracefully', async () => {
        const errorMessage = 'Network Error';
        mockGetPreview.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useFetchCoursePreview());

        await act(async () => {
            try {
                await result.current.fetchCoursePreview('abc-123');
            } catch (e) {
                // Expected error
            }
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.coursePreview).toBe(null);
    });

    it('should throw if documentId is missing', async () => {
        const { result } = renderHook(() => useFetchCoursePreview());

        await act(async () => {
            try {
                await result.current.fetchCoursePreview(null);
            } catch (e) {
                expect(e.message).toBe('documentId is required to fetch course preview.');
            }
        });

        expect(result.current.error).toBe('documentId is required to fetch course preview.');
    });
});
