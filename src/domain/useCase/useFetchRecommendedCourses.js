import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { CourseDTO } from '@infrastructure/DTO/CourseDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching recommended courses.
 * Pipeline: API → CourseDTO → EntityMapper.toCardCourse → CardCourseEntity[]
 * @returns {{ fetchCourses: Function, courses: CardCourseEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchRecommendedCourses = () => {
    const repository = new RecommendationRepository();

    const fetchLogic = useCallback(async (limit = 20) => {
        const populate = {
            users_permissions_user: {
                fields: ['firstname', 'lastname', 'email', 'username', 'birthday', 'university', 'bio'],
                populate: ['avatar']
            },
            picture: true
        };
        const rawData = await repository.getCourses(limit, [], 'recommend', populate);
        const items = Array.isArray(rawData) ? rawData : [];
        return items
            .map(item => new CourseDTO(item))
            .map(dto => EntityMapper.toCardCourse(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchCourses: execute,
        courses: returnedData,
        loading: inProgress,
        error
    };
};
