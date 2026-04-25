import { useState, useCallback, useMemo } from 'react';
import { AnalyticsRepository } from '../../infrastructure/repository/AnalyticsRepository';
import { AnalyticsMapper } from '../mapper/AnalyticsMapper';
import { CMSAnalyticsRequest } from '../../infrastructure/DTO/Request/CMSAnalyticsRequest';

/**
 * UseCase: Fetch CMS Analytics
 * Orchestrates the flow using DTOs, Entities, and Mappers.
 */
export const useFetchCMSAnalytics = () => {
    const repository = useMemo(() => new AnalyticsRepository(), []);

    const [data, setData] = useState(null); // Will hold a ResponseDTO
    const [stats, setStats] = useState({
        totalCourses: 0, totalEvents: 0, totalUsers: 0, 
        pendingReports: 0, courseAuthors: 0, eventOrganizers: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async (days = 60) => {
        setIsLoading(true);
        try {
            // 1. Create Request DTO
            const requestDto = new CMSAnalyticsRequest({ days });
            
            // 2. Fetch via Repo
            const rawData = await repository.getFullAnalytics(requestDto);
            
            // 3. Map to Entity via Mapper
            const entity = AnalyticsMapper.toEntity(rawData);
            
            // 4. Map to Response DTO via Mapper
            const responseDto = AnalyticsMapper.toResponseDTO(entity);
            
            setData(responseDto);
            setStats(entity.getSummaryStats());
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch scholarly analytics");
        } finally {
            setIsLoading(false);
        }
    }, [repository]);

    return {
        data, 
        stats,
        isLoading,
        error,
        fetchAnalytics
    };
};
