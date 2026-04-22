import { useState, useCallback } from 'react';
import { CourseRepository } from '@infrastructure/repository/CourseRepository';
import { EventRepository } from '@infrastructure/repository/EventRepository';
import { ReportRepository } from '@infrastructure/repository/ReportRepository';
import { UserRepository } from '@infrastructure/repository/UserRepository';

/**
 * UseCase: Fetches high-level metrics for the CMS Dashboard.
 * Utilizes Promise.all to fetch metadata without heavily loading payload arrays.
 */
export const useFetchCMSAnalytics = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEvents: 0,
        pendingReports: 0,
        totalUsers: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const courseRepo = new CourseRepository();
            const eventRepo = new EventRepository();
            const reportRepo = new ReportRepository();
            const userRepo = new UserRepository();

            const [coursesRes, eventsRes, reportsRes, usersRes] = await Promise.all([
                courseRepo.getAll(null, 1, 1), // passing size 1 just to get meta.total
                eventRepo.getAll(1, 1),
                reportRepo.getAll(1, 1, '', 'PENDING'),
                userRepo.getAllUsers()
            ]);

            setStats({
                totalCourses: coursesRes?.meta?.pagination?.total || 0,
                totalEvents: eventsRes?.meta?.pagination?.total || 0,
                pendingReports: reportsRes?.meta?.pagination?.total || 0,
                totalUsers: Array.isArray(usersRes) ? usersRes.length : 0
            });
        } catch (err) {
            console.error('[CMS Analytics] Fetch failed:', err);
            setError(err.message || 'Failed to load analytics');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        stats,
        isLoading,
        error,
        fetchAnalytics
    };
};
