import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetchCMSAnalytics } from '../../src/domain/useCase/useFetchCMSAnalytics';
import { AnalyticsRepository } from '../../src/infrastructure/repository/AnalyticsRepository';

// Create a stable mock function that can be accessed across instances
const mockGetFullAnalytics = vi.fn();

// Mock the AnalyticsRepository
vi.mock('../../src/infrastructure/repository/AnalyticsRepository', () => ({
    AnalyticsRepository: class {
        constructor() {
            this.getFullAnalytics = mockGetFullAnalytics;
        }
    }
}));

describe('useFetchCMSAnalytics Hook (Refactored)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch and map analytics metrics', async () => {
        // Mock raw data return from API
        const mockRawData = {
            courses: { total: 42, timeline: [] },
            events: { total: 10, timeline: [] },
            users: { total: 150, timeline: [] },
            reports: { total: 5, timeline: [] },
            contributors: {
                authors: { total: 5, timeline: [] },
                organizers: { total: 3, timeline: [] }
            }
        };

        mockGetFullAnalytics.mockResolvedValue(mockRawData);

        const { result } = renderHook(() => useFetchCMSAnalytics());

        // Wait for it to settle
        await act(async () => {
            await result.current.fetchAnalytics(60);
        });

        expect(mockGetFullAnalytics).toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        
        expect(result.current.stats).toEqual({
            totalCourses: 42,
            totalEvents: 10,
            totalUsers: 150,
            pendingReports: 5,
            courseAuthors: 5,
            eventOrganizers: 3
        });
    });

    it('should handle zero metrics gracefully', async () => {
        const mockRawData = {
            courses: { total: 0, timeline: [] },
            events: { total: 0, timeline: [] },
            users: { total: 0, timeline: [] },
            reports: { total: 0, timeline: [] },
            contributors: {
                authors: { total: 0, timeline: [] },
                organizers: { total: 0, timeline: [] }
            }
        };

        mockGetFullAnalytics.mockResolvedValue(mockRawData);

        const { result } = renderHook(() => useFetchCMSAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(result.current.stats.totalCourses).toBe(0);
        expect(result.current.error).toBeNull();
    });

    it('should handle repository errors correctly', async () => {
        const error = new Error('Database connection failed');
        mockGetFullAnalytics.mockRejectedValue(error);

        const { result } = renderHook(() => useFetchCMSAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(result.current.isLoading).toBe(false);
        // Clean error string should be matched
        expect(result.current.error).toBe('Database connection failed');
        expect(result.current.stats.totalCourses).toBe(0);
    });
});
