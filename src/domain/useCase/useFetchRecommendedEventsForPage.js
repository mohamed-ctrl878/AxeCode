import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { EventDTO } from '@infrastructure/DTO/EventDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching recommended events.
 * Pipeline: API → EventDTO → EntityMapper.toCardEvent → CardEventEntity[]
 * @returns {{ fetchEvents: Function, events: CardEventEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchRecommendedEventsForPage = () => {
    const repository = new RecommendationRepository();

    const fetchLogic = useCallback(async (limit = 20) => {
        const rawData = await repository.getEvents(limit);
        const items = Array.isArray(rawData) ? rawData : [];
        return items
            .map(item => new EventDTO(item))
            .map(dto => EntityMapper.toCardEvent(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchEvents: execute,
        events: returnedData,
        loading: inProgress,
        error
    };
};
