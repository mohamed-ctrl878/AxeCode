import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '../../infrastructure/repository/ProblemRepository';
import { ProblemDTO } from '../../infrastructure/DTO/ProblemDTO';
import { EntityMapper } from '../mapper/EntityMapper';
import { flattenStrapi } from '../../core/utils/strapiFlatten';
import { useMemo, useCallback } from 'react';

/**
 * useSearchProblems: UseCase hook for global problem search by title query.
 */
export const useSearchProblems = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const searchLogic = useCallback(async (query) => {
        if (!query || query.trim().length < 2) return [];
        const response = await repository.search(query);
        const dataArray = flattenStrapi(response) || [];
        if (!Array.isArray(dataArray)) return [];
        
        return dataArray.map(item => {
            const dto = new ProblemDTO(item);
            return EntityMapper.toCardProblem(dto);
        });
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(searchLogic);

    return {
        searchProblems: execute,
        problems: returnedData || [],
        loading: inProgress,
        error
    };
};
