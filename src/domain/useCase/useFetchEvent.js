import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '@infrastructure/repository/EventRepository';
import { EventDTO } from '@infrastructure/DTO/EventDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single event by ID.
 * Pipeline: API -> EventDTO -> EntityMapper.toEvent -> EventEntity
 * 
 * @returns {{ fetchEvent: Function, event: import('../../entity/EventEntity').EventEntity|null, loading: boolean, error: string|null }}
 */
export const useFetchEvent = () => {
    const repository = new EventRepository();

    const fetchLogic = useCallback(async (id) => {
        if (!id) throw new Error("Event ID is required");
        console.log("id",id);

        const rawData = await repository.getById(id);

        if (!rawData || !rawData.data) {
            throw new Error("Event not found");
        }

        const item = rawData.data || rawData;

        // 1. Convert raw API response to structured DTO
        const dto = new EventDTO(item);

        // 2. Map DTO to pure Domain Entity (EventEntity)
        const entity = EntityMapper.toEvent(dto);

        return entity;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchEvent: execute,
        event: returnedData,
        loading: inProgress,
        error
    };
};
