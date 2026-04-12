import { useAsyncUseCase } from './useAsyncUseCase';
import { EventRepository } from '../../infrastructure/repository/EventRepository';
import { EventDTO } from '../../infrastructure/DTO/EventDTO';
import { EntityMapper } from '../mapper/EntityMapper';
import { flattenStrapi } from '../../core/utils/strapiFlatten';
import { useMemo, useCallback } from 'react';

/**
 * useSearchEvents: UseCase hook for global event search by title query.
 */
export const useSearchEvents = () => {
    const repository = useMemo(() => new EventRepository(), []);

    const searchLogic = useCallback(async (query) => {
        if (!query || query.trim().length < 2) return [];
        const response = await repository.search(query);
        const dataArray = flattenStrapi(response) || [];
        if (!Array.isArray(dataArray)) return [];
        
        return dataArray.map(item => {
            const dto = new EventDTO(item);
            return EntityMapper.toCardEvent(dto);
        });
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(searchLogic);

    return {
        searchEvents: execute,
        events: returnedData || [],
        loading: inProgress,
        error
    };
};
