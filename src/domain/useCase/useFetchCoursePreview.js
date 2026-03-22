import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '@infrastructure/repository/CourseRepository';
import { CourseDTO } from '@infrastructure/DTO/CourseDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single course preview by documentId.
 * Pipeline: API → CourseDTO → EntityMapper.toCoursePreview → CoursePreviewEntity
 * @returns {{ fetchCoursePreview: Function, coursePreview: CoursePreviewEntity|null, loading: boolean, error: string|null }}
 */
export const useFetchCoursePreview = () => {
    const repository = new CourseRepository();

    const fetchLogic = useCallback(async (documentId) => {
        if (!documentId) {
            throw new Error('documentId is required to fetch course preview.');
        }

        // Strapi v4/v5 deep populate for weeks and their lessons
        // Use explicit populate settings to avoid 'related' key validation errors in some Strapi versions
        const populateQuery = 'populate[picture]=true&populate[weeks][populate][lessons][populate][video]=true';
        const rawData = await repository.getPreview(`${documentId}?${populateQuery}`);
        const dto = new CourseDTO(rawData);
        return EntityMapper.toCoursePreview(dto);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchCoursePreview: execute,
        coursePreview: returnedData,
        loading: inProgress,
        error
    };
};
