import { useState, useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { LessonRepository } from '@infrastructure/repository/LessonRepository';
import { LessonDTO } from '@infrastructure/DTO/LessonDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';
import { flattenStrapi } from '@core/utils/strapiFlatten';

/**
 * useFetchLesson: Domain Use Case for fetching a single lesson by ID.
 * Maps the raw Strapi response to a LessonEntity.
 */
export const useFetchLesson = () => {
    const repository = new LessonRepository();
    const [lesson, setLesson] = useState(null);

    const fetchLogic = useCallback(async (id) => {
        // Strapi v4/v5 deep populate for lesson media
        const response = await repository.getById(`${id}?populate=*`);
        const flatData = flattenStrapi(response);
        const dto = new LessonDTO(flatData);
        const entity = EntityMapper.toLesson(dto);
        setLesson(entity);
        return entity;
    }, []);

    const { execute, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchLesson: execute,
        lesson,
        loading: inProgress,
        error
    };
};
