import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchCMSAnalytics } from '../../src/domain/useCase/useFetchCMSAnalytics';

const mockCourseGetAll = vi.fn();
const mockEventGetAll = vi.fn();
const mockReportGetAll = vi.fn();
const mockUserGetAll = vi.fn();

vi.mock('@infrastructure/repository/CourseRepository', () => ({
    CourseRepository: class {
        constructor() { this.getAll = mockCourseGetAll; }
    }
}));

vi.mock('@infrastructure/repository/EventRepository', () => ({
    EventRepository: class {
        constructor() { this.getAll = mockEventGetAll; }
    }
}));

vi.mock('@infrastructure/repository/ReportRepository', () => ({
    ReportRepository: class {
        constructor() { this.getAll = mockReportGetAll; }
    }
}));

vi.mock('@infrastructure/repository/UserRepository', () => ({
    UserRepository: class {
        constructor() { this.getAllUsers = mockUserGetAll; }
    }
}));

describe('useFetchCMSAnalytics Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully aggregate analytics metrics', async () => {
        // Mock successful repository responses
        mockCourseGetAll.mockResolvedValue({ meta: { pagination: { total: 42 } } });
        mockEventGetAll.mockResolvedValue({ meta: { pagination: { total: 10 } } });
        mockReportGetAll.mockResolvedValue({ meta: { pagination: { total: 5 } } });
        mockUserGetAll.mockResolvedValue(new Array(150).fill({ id: 1 })); // 150 users

        const { result } = renderHook(() => useFetchCMSAnalytics());

        // Initially loading
        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(mockCourseGetAll).toHaveBeenCalledWith(null, 1, 1);
        expect(mockEventGetAll).toHaveBeenCalledWith(1, 1);
        expect(mockReportGetAll).toHaveBeenCalledWith(1, 1, '', 'PENDING');
        expect(mockUserGetAll).toHaveBeenCalled();

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.stats).toEqual({
            totalCourses: 42,
            totalEvents: 10,
            pendingReports: 5,
            totalUsers: 150
        });
    });

    it('should handle zero metrics gracefully', async () => {
        // Mock responses with zero counts
        mockCourseGetAll.mockResolvedValue({ meta: { pagination: { total: 0 } } });
        mockEventGetAll.mockResolvedValue({}); // Empty object fallback test
        mockReportGetAll.mockResolvedValue({ meta: null }); // Null middle field fallback test
        mockUserGetAll.mockResolvedValue([]); 

        const { result } = renderHook(() => useFetchCMSAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.stats).toEqual({
            totalCourses: 0,
            totalEvents: 0,
            pendingReports: 0,
            totalUsers: 0
        });
    });

    it('should handle errors thrown by repositories', async () => {
        const error = new Error('Database connection failed');
        mockCourseGetAll.mockRejectedValue(error);
        mockEventGetAll.mockResolvedValue({ meta: { pagination: { total: 10 } } });
        mockReportGetAll.mockResolvedValue({ meta: { pagination: { total: 5 } } });
        mockUserGetAll.mockResolvedValue([]);

        const { result } = renderHook(() => useFetchCMSAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Database connection failed');
        // Stats should remain at defaults when error occurs during Promise.all
        expect(result.current.stats).toEqual({
            totalCourses: 0,
            totalEvents: 0,
            pendingReports: 0,
            totalUsers: 0
        });
    });
});
